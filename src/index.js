#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";

import { ARCHITECTURES, ARCH_ALIASES, injectArchitectureForTest as injectArchitecture, patchTsConfigForTest as patchTsConfig } from "./architecture.js";
import { cleanBoilerplateForTest as cleanBoilerplate } from "./boilerplate.js";
import { injectConfigFilesForTest as injectConfigFiles } from "./config-files.js";
import { checkMissingDeps, getDepReason } from "./dep-resolver.js";
import { buildShadcnConfig } from "./shadcn.js";
import { determineFastestPackageManager } from "./selectors/env.js";
import { renderIntro, askLanguageClack, askQuestionsClack, renderCompletionBox } from "./ui/interface.js";
import { handleDirectoryResolution } from "./services/resolver.js";
import { executeHighSpeedUnpack } from "./services/unpacker.js";

// Windows ESM symlink fix: use import.meta.url directly
const TEMPLATES = path.join(fileURLToPath(new URL(".", import.meta.url)), "../templates");

const packageJsonPath = path.join(fileURLToPath(new URL(".", import.meta.url)), "../package.json");
const VERSION = fs.readJsonSync(packageJsonPath).version;

// ─────────────────────────────────────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────────────────────────────────────

const I18N = {
  es: {
    q_name: "¿Nombre del proyecto?",
    q_template: "¿Qué plantilla de arquitectura deseas usar?",
    q_git_warn: "El proyecto se creará DENTRO de un repo Git existente. ¿Deseas continuar?",
    q_overwrite: "El archivo ya existe. ¿Sobreescribir?",
    q_rollback: "¿Eliminar la carpeta generada para dejar todo limpio?",
    q_comp_client: "¿Componente de cliente ('use client') o servidor?",
    q_comp_test: "¿Generar también el archivo de tests?",
    q_missing_deps: (pkgs) => `Faltan las dependencias recomendadas: ${pkgs.join(", ")}. ¿Quieres instalarlas ahora?`,
    err_exists: (n) => `La carpeta "${n}" ya existe.`,
    err_feature_only: "El tipo 'feature' solo está disponible en arquitectura feature-based.",
    cancelled: "Operación cancelada.",
    git_warn: "⚠️  Repositorio Git detectado en el directorio actual o en un padre.",
    next_steps: "Próximos pasos:",
    contributing: "Lee CONTRIBUTING.md para los estándares de commits.",
    open_file: "Abre el archivo y define tus props / tipos.",
    suggest_issues: "¿Bug inesperado? Reporta en: https://github.com/santi1475/create-web-arch/issues",
    projectNameMandatory: "El identificador del proyecto es obligatorio.",
    spin_git: "Inicializando Git…",
    ok_git: "Git listo (primer commit ✔)",
  },
  en: {
    q_name: "Project name?",
    q_template: "Which architecture template do you want to use?",
    q_git_warn: "Project will be created INSIDE an existing Git repo. Continue?",
    q_overwrite: "File already exists. Overwrite?",
    q_rollback: "Delete the generated folder to clean up?",
    q_comp_client: "Client ('use client') or server component?",
    q_comp_test: "Also generate the test file?",
    q_missing_deps: (pkgs) => `Recommended dependencies are missing: ${pkgs.join(", ")}. Do you want to install them?`,
    err_exists: (n) => `Folder "${n}" already exists.`,
    err_feature_only: "The 'feature' type is only available in feature-based architecture.",
    cancelled: "Operation cancelled.",
    git_warn: "⚠️  Git repository detected in current directory or a parent.",
    next_steps: "Next steps:",
    contributing: "Read CONTRIBUTING.md for commit standards.",
    open_file: "Open the file and define your props / types.",
    suggest_issues: "Unexpected bug? Report at: https://github.com/santi1475/create-web-arch/issues",
    projectNameMandatory: "Project name identifier is required.",
    spin_git: "Initializing Git…",
    ok_git: "Git ready (first commit ✔)",
  },
};

const GENERATE_PATHS = {
  component: { feature: () => "src/features/common/components", layer: () => "src/components/ui",        ddd: () => "src/presentation/components" },
  hook:      { feature: () => "src/shared/hooks",               layer: () => "src/hooks",                ddd: () => "src/presentation/hooks"      },
  service:   { feature: () => "src/features/common/services",   layer: () => "src/services",             ddd: () => "src/application/common/use-cases" },
  feature:   { feature: (n) => `src/features/${n.toLowerCase()}` },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────

const readTemplate = async (filename, replacements = {}) => {
  const content = await fs.readFile(path.join(TEMPLATES, filename), "utf-8");
  return Object.entries(replacements).reduce((acc, [k, v]) => acc.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, "g"), v), content);
};

const detectExistingGitRepo = () => {
  try {
    return spawnSync("git", ["rev-parse", "--git-dir"], { cwd: process.cwd(), encoding: "utf-8" }).status === 0;
  } catch { return false; }
};

/** @param {boolean} inherit — true shows output in real-time */
const run = (cmd, cwd, label, inherit = false, envOverrides = {}) => {
  const r = spawnSync(cmd, {
    cwd,
    shell: true,
    stdio: inherit ? "inherit" : "pipe",
    encoding: "utf-8",
    env: { ...process.env, ...envOverrides },
  });
  if (r.status !== 0) throw new Error(`${label}${inherit ? "" : `\n${r.stderr || r.stdout}`}`);
  return r.stdout ?? "";
};

const buildCmds = (pm) => ({
  install:   pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm install" : pm === "bun" ? "bun install" : "npm install",
  dev:       pm === "yarn" ? "yarn dev" : pm === "bun" ? "bun dev" : `${pm} run dev`,
  addDep:    pm === "yarn" ? `yarn add` : pm === "pnpm" ? `pnpm add` : pm === "bun" ? `bun add` : `npm install`,
  addDev:    pm === "yarn" ? `yarn add -D` : pm === "pnpm" ? `pnpm add -D` : pm === "bun" ? `bun add -d` : `npm install -D`,
});

const toPascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const toKebab  = (s) => s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const isInteractive = () => Boolean(process.stdin.isTTY && process.stdout.isTTY);

const readProjectConfig = async () => {
  const p = path.join(process.cwd(), ".web-arch.json");
  if (!(await fs.pathExists(p))) throw new Error("no_config");
  return fs.readJson(p);
};

/** Global error display — polished output */
const fatalError = (err, t) => {
  console.log(`\n${chalk.bgRed.white.bold(" ERROR ")} ${chalk.red(err.message)}`);
  if (t?.suggest_issues) console.log(chalk.dim(`\n${t.suggest_issues}\n`));
  process.exit(1);
};

const setupGit = (projectPath) => {
  run("git init",  projectPath, "git init");
  run("git add .", projectPath, "git add");
  run(`git commit -m "chore: initial scaffold by create-web-arch"`, projectPath, "git commit");
};

// ─────────────────────────────────────────────────────────────────────────────
// COMANDO: create
// ─────────────────────────────────────────────────────────────────────────────

const createCommand = async (projectNameArg, cliOptions = {}) => {
  let lang = "en";
  if (isInteractive()) {
    lang = await askLanguageClack();
  }
  const t = I18N[lang];

  renderIntro(VERSION);

  // Validate template parameter if supplied via CLI
  if (cliOptions.template && !["feature", "layer", "ddd"].includes(cliOptions.template)) {
    fatalError(new Error(`Invalid template: "${cliOptions.template}". Use: feature | layer | ddd`), t);
  }

  if (detectExistingGitRepo()) {
    console.log(chalk.yellow(`\n${t.git_warn}\n`));
    if (isInteractive()) {
      const proceed = await p.confirm({
        message: t.q_git_warn,
        initialValue: false
      });
      if (p.isCancel(proceed) || !proceed) {
        p.cancel(t.cancelled);
        process.exit(0);
      }
    }
  }

  let opts;
  if (isInteractive()) {
    try {
      const defaultPm = determineFastestPackageManager();
      opts = await askQuestionsClack({
        projectNameArg,
        templateArg: cliOptions.template,
        t,
        lang,
        defaultPm
      });
    } catch (err) {
      p.cancel(t.cancelled);
      process.exit(0);
    }
  } else {
    opts = {
      projectName: projectNameArg || "my-next-app",
      template: cliOptions.template || "feature",
      packageManager: "skip"
    };
  }

  const { projectName, template, packageManager } = opts;

  let resolvedProjectName = projectName;
  let projectPath = path.resolve(process.cwd(), projectName);

  if (isInteractive()) {
    const resolution = await handleDirectoryResolution(projectName, lang);
    resolvedProjectName = resolution.projectName;
    projectPath = resolution.targetPath;
  } else if (await fs.pathExists(projectPath)) {
    fatalError(new Error(t.err_exists(projectName)), t);
  }

  // 1. Download template using giget
  await executeHighSpeedUnpack(projectPath, template, lang);

  // 2. Rename package.json name to the chosen project name
  const pkgJsonPath = path.join(projectPath, "package.json");
  if (await fs.pathExists(pkgJsonPath)) {
    const pkgJson = await fs.readJson(pkgJsonPath);
    pkgJson.name = resolvedProjectName;
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }

  // Write a minimal .web-arch.json config so the generate command knows the architecture template type
  const configObj = {
    architecture: template,
    packageManager: packageManager === "skip" ? "npm" : packageManager,
    lang,
    version: VERSION,
    createdAt: new Date().toISOString()
  };
  await fs.writeJson(path.join(projectPath, ".web-arch.json"), configObj, { spaces: 2 });

  // 3. Install dependencies
  if (packageManager !== "skip") {
    const installSpinner = p.spinner();
    const instMsgStart = lang === "es"
      ? `Instalando dependencias usando ${packageManager}...`
      : `Installing dependencies using ${packageManager}...`;
    installSpinner.start(instMsgStart);

    try {
      const cmds = buildCmds(packageManager);
      run(cmds.install, projectPath, "install dependencies", false);
      const instMsgSuccess = lang === "es"
        ? `📦 Dependencias instaladas vía ${packageManager}.`
        : `📦 Dependencies installed via ${packageManager}.`;
      installSpinner.stop(chalk.green(instMsgSuccess));
    } catch (err) {
      const instMsgFail = lang === "es"
        ? `⚠️ Error al instalar dependencias de forma automática.`
        : `⚠️ Automated dependency installation failed.`;
      installSpinner.stop(chalk.yellow(instMsgFail));
    }
  }

  // 4. Initialize Git Repo
  try {
    const gitSpinner = p.spinner();
    gitSpinner.start(t.spin_git);
    setupGit(projectPath);
    gitSpinner.stop(chalk.green(t.ok_git));
  } catch (err) {
    // Ignore git error if it fails
  }

  // 5. Completion banner
  renderCompletionBox({
    projectName: resolvedProjectName,
    template,
    pkgManager: packageManager,
    t
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// COMANDO: generate
// ─────────────────────────────────────────────────────────────────────────────

const generateCommand = async (type, name) => {
  const validTypes = ["component", "hook", "service", "feature"];

  if (!validTypes.includes(type)) {
    fatalError(new Error(`Invalid type: "${type}". Use: ${validTypes.join(", ")}`), null);
  }
  if (!name) fatalError(new Error("Name required. Eg: generate component MyButton"), null);

  let config;
  try { config = await readProjectConfig(); }
  catch { fatalError(new Error("No .web-arch.json found. Run from a project root created with create-web-arch."), null); }

  const { architecture, packageManager = "npm", lang = "en" } = config;
  const t    = I18N[lang];

  // Feature type only for feature-based
  if (type === "feature" && architecture !== "feature") {
    fatalError(new Error(t.err_feature_only), t);
  }

  // ── Dependency resolver ───────────────────────────────────────────────────
  let pkgJson = {};
  const pkgPath = path.join(process.cwd(), "package.json");
  if (await fs.pathExists(pkgPath)) pkgJson = await fs.readJson(pkgPath);

  const missingDeps = checkMissingDeps(type, pkgJson);
  if (missingDeps.length) {
    console.log(chalk.yellow(`\n⚡ ${getDepReason(type, lang)}`));
    if (isInteractive()) {
      const installMissing = await p.confirm({
        message: t.q_missing_deps(missingDeps),
        initialValue: true,
      });
      if (p.isCancel(installMissing)) {
        p.cancel(t.cancelled);
        process.exit(0);
      }
      if (installMissing) {
        const cmds = buildCmds(packageManager);
        const depSpinner = p.spinner();
        depSpinner.start(`Installing ${missingDeps.join(", ")}…`);
        try {
          run(`${cmds.addDep} ${missingDeps.join(" ")}`, process.cwd(), "install missing deps", false);
          depSpinner.stop(chalk.green(`${missingDeps.join(", ")} installed`));
        } catch (err) {
          depSpinner.stop(chalk.red(`Failed to install: ${err.message}`));
        }
      }
    } else {
      console.log(chalk.dim(`Skipping prompt in non-interactive mode. Missing deps: ${missingDeps.join(", ")}`));
    }
  }

  // ── Generate logic ─────────────────────────────────────────────────────────
  const generateSpinner = p.spinner();

  if (type === "feature") {
    const featureName = toPascal(name);
    const featureSlug = name.toLowerCase();
    const featureDir  = path.join(process.cwd(), `src/features/${featureSlug}`);
    const subfolders  = ["components", "hooks", "services", "types"];

    generateSpinner.start(`Generating feature "${featureName}"…`);
    try {
      for (const sub of subfolders) {
        await fs.ensureDir(path.join(featureDir, sub));
        await fs.writeFile(path.join(featureDir, sub, ".gitkeep"), "");
      }
      const indexContent = await readTemplate("generate/feature-index.ts", {
        FEATURE_NAME:           featureName,
        FEATURE_SLUG:           featureSlug,
        FEATURE_EXPORT_EXAMPLE: `${featureName}Page`,
        FEATURE_NAME_LOWER:     featureSlug,
      });
      await fs.writeFile(path.join(featureDir, "index.ts"), indexContent);
      generateSpinner.stop(chalk.green(t.ok_feature(featureName)));

      console.log(`
  ${chalk.bold("Feature:")}      ${chalk.cyan(`src/features/${featureSlug}/`)}
  ${chalk.bold("Public API:")}   ${chalk.cyan(`src/features/${featureSlug}/index.ts`)}
  ${chalk.bold("Subfolders:")}   ${subfolders.map(s => chalk.dim(s)).join("  ")}
  ${chalk.dim(`Import: import { ... } from "@features/${featureSlug}"`)}
`);
    } catch (err) { generateSpinner.stop(chalk.red(err.message)); process.exit(1); }
    return;
  }

  const destDir = path.join(process.cwd(), GENERATE_PATHS[type][architecture](name));
  let destFile, templateFile, replacements, testFile;

  if (type === "component") {
    let isClient = false;
    let withTest = false;
    
    if (isInteractive()) {
      const isClientVal = await p.select({
        message: t.q_comp_client,
        options: [
          { value: false, label: "Server component (default)" },
          { value: true, label: "Client component ('use client')" }
        ]
      });
      if (p.isCancel(isClientVal)) {
        p.cancel(t.cancelled);
        process.exit(0);
      }
      isClient = isClientVal;

      const withTestVal = await p.confirm({
        message: t.q_comp_test,
        initialValue: false
      });
      if (p.isCancel(withTestVal)) {
        p.cancel(t.cancelled);
        process.exit(0);
      }
      withTest = withTestVal;
    }

    const componentName = toPascal(name);
    destFile    = path.join(destDir, `${componentName}.tsx`);
    templateFile = isClient ? "generate/component-client.tsx" : "generate/component.tsx";
    replacements = { COMPONENT_NAME: componentName };
    if (withTest) testFile = path.join(destDir, `${componentName}.test.tsx`);

  } else if (type === "hook") {
    const hookName = toPascal(name);
    destFile     = path.join(destDir, `use${hookName}.ts`);
    templateFile = "generate/hook.ts";
    replacements = { HOOK_NAME: hookName };

  } else if (type === "service") {
    const serviceName = toPascal(name);
    destFile     = path.join(destDir, `${serviceName}Service.ts`);
    templateFile = "generate/service.ts";
    replacements = { SERVICE_NAME: serviceName, SERVICE_SLUG: toKebab(serviceName) };
  }

  if (await fs.pathExists(destFile)) {
    let overwrite = false;
    if (isInteractive()) {
      const overwriteVal = await p.confirm({
        message: `${t.q_overwrite} (${path.relative(process.cwd(), destFile)})`,
        initialValue: false,
      });
      if (p.isCancel(overwriteVal)) {
        p.cancel(t.cancelled);
        process.exit(0);
      }
      overwrite = overwriteVal;
    }
    if (!overwrite) { console.log(chalk.dim(`\n${t.cancelled}\n`)); process.exit(0); }
  }

  generateSpinner.start(`Generating ${type} "${name}"…`);
  try {
    await fs.ensureDir(destDir);
    await fs.writeFile(destFile, await readTemplate(templateFile, replacements));
    if (testFile) await fs.writeFile(testFile, await readTemplate("generate/component.test.tsx", replacements));
    generateSpinner.stop(chalk.green(t.ok_gen(type, name)));

    console.log(`
  ${chalk.bold("File:")}         ${chalk.cyan(path.relative(process.cwd(), destFile))}
  ${testFile ? `${chalk.bold("Test:")}         ${chalk.cyan(path.relative(process.cwd(), testFile))}\n  ` : ""}${chalk.bold("Architecture:")} ${chalk.cyan(architecture)}
  ${chalk.dim(t.open_file)}
`);
  } catch (err) {
    generateSpinner.stop(chalk.red(err.message));
    process.exit(1);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

program
  .name("create-web-arch")
  .description("Next.js scaffolder — architecture + git + libraries")
  .version(VERSION);

program
  .command("create [project-name]", { isDefault: true })
  .description("Create a new Next.js project with architecture ready")
  .option("--template <type>", "Architecture template: feature | layer | ddd")
  .action(async (arg, options) => {
    try { await createCommand(arg, options); }
    catch (err) { fatalError(err, I18N.en); }
  });

program
  .command("generate <type> <n>")
  .alias("g")
  .description([
    "Generate an artifact respecting the project architecture.",
    "",
    "  Types:    component | hook | service | feature",
    "  Examples:",
    "    create-web-arch generate component MyButton",
    "    create-web-arch g hook Auth",
    "    create-web-arch g service User",
    "    create-web-arch g feature Checkout   (feature-based only)",
  ].join("\n"))
  .action(async (type, name) => {
    try { await generateCommand(type, name); }
    catch (err) { fatalError(err, I18N.en); }
  });

program.parse();