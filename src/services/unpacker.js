import { downloadTemplate } from "giget";
import * as p from "@clack/prompts";
import chalk from "chalk";

/**
 * Downloads the requested architecture template using giget.
 * @param {string} targetDir - where the user wants to create the project
 * @param {string} template - feature | layer | ddd
 * @param {string} lang - "es" | "en"
 */
export async function executeHighSpeedUnpack(targetDir, template, lang = "en") {
  const spinner = p.spinner();
  const msgStart = lang === "es" 
    ? "Descargando plantilla de arquitectura desde GitHub..." 
    : "Downloading architecture template from GitHub...";
  
  spinner.start(msgStart);

  const templatePath = `gh:santi1475/next-architecture-templates/templates/${template}`;

  try {
    await downloadTemplate(templatePath, {
      dir: targetDir,
      force: true,
      install: false, // do not auto-install dependencies
    });
    
    const msgSuccess = lang === "es"
      ? "📥 Plantilla descargada y descomprimida correctamente."
      : "📥 Template successfully downloaded and unpacked.";
    spinner.stop(chalk.green(msgSuccess));
  } catch (error) {
    const msgError = lang === "es"
      ? "💥 Fallo al descargar los manifiestos del repositorio remoto."
      : "💥 Failed to download remote templates from the repository.";
    spinner.stop(chalk.red(msgError));
    throw new Error(`Giget template download failed: ${error.message}`);
  }
}
