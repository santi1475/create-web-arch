import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import * as p from "@clack/prompts";

const RESOLUTION_I18N = {
  es: {
    conflict: (name) => `CONFLICTO: El directorio './${name}' ya contiene datos.`,
    strategy: "Selecciona una estrategia de resolución:",
    opt_rename: "📝 Especificar un identificador diferente",
    opt_purge: "💥 Purgar directorio existente y sobrescribir",
    opt_abort: "🛑 Abortar proceso de compilación",
    confirm_purge: (name) => `¿Confirmas la eliminación total de ./${name}? No se puede deshacer.`,
    purging: "Purgando registros del disco...",
    purged: "Directorio purgado correctamente.",
    new_name: "Introduce el nuevo nombre del proyecto:",
    empty_error: "El nombre no puede estar vacío.",
    invalid_name_error: "Solo minúsculas, números, guiones y underscores",
    aborted: "Proceso detenido de forma segura."
  },
  en: {
    conflict: (name) => `CONFLICT: The directory './${name}' already contains data.`,
    strategy: "Select a resolution strategy:",
    opt_rename: "📝 Specify a different identifier",
    opt_purge: "💥 Purge existing directory and overwrite",
    opt_abort: "🛑 Abort installation process",
    confirm_purge: (name) => `Are you sure you want to completely delete ./${name}? This cannot be undone.`,
    purging: "Purging files from disk...",
    purged: "Directory purged successfully.",
    new_name: "Enter the new project name:",
    empty_error: "The name cannot be empty.",
    invalid_name_error: "Lowercase, numbers, dashes and underscores only",
    aborted: "Installation safely aborted."
  }
};

/**
 * Interactively resolves conflicts if the target directory already exists.
 * @param {string} initialName - the desired directory name
 * @param {string} lang - "es" | "en"
 * @returns {Promise<{ projectName: string, targetPath: string }>}
 */
export async function handleDirectoryResolution(initialName, lang = "en") {
  let projectName = initialName;
  let targetPath = path.resolve(process.cwd(), projectName);
  const r = RESOLUTION_I18N[lang] ?? RESOLUTION_I18N.en;

  while (await fs.pathExists(targetPath)) {
    console.log(chalk.hex("#FF3366")(`\n  ⚠️  ${r.conflict(projectName)}`));

    const resolveAction = await p.select({
      message: r.strategy,
      options: [
        { value: "rename", label: r.opt_rename },
        { value: "purge", label: r.opt_purge },
        { value: "abort", label: r.opt_abort }
      ]
    });

    if (p.isCancel(resolveAction) || resolveAction === "abort") {
      p.cancel(r.aborted);
      process.exit(0);
    }

    if (resolveAction === "purge") {
      const confirmPurge = await p.confirm({
        message: chalk.red(r.confirm_purge(projectName)),
        initialValue: false
      });

      if (p.isCancel(confirmPurge)) {
        p.cancel(r.aborted);
        process.exit(0);
      }

      if (confirmPurge) {
        const spinner = p.spinner();
        spinner.start(r.purging);
        await fs.remove(targetPath);
        spinner.stop(chalk.green(`✨ ${r.purged}`));
        break; // Conflict resolved by purging
      }
      continue; // Ask again if they declined purge
    }

    if (resolveAction === "rename") {
      const newName = await p.text({
        message: r.new_name,
        validate: (val) => {
          const trimmed = val.trim();
          if (!trimmed) return r.empty_error;
          if (!/^[a-z0-9-_]+$/.test(trimmed)) return r.invalid_name_error;
        }
      });

      if (p.isCancel(newName)) {
        p.cancel(r.aborted);
        process.exit(0);
      }

      projectName = newName.trim();
      targetPath = path.resolve(process.cwd(), projectName);
    }
  }

  return { projectName, targetPath };
}
