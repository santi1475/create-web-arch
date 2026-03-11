#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

import { ARCHITECTURES, ARCH_ALIASES, injectArchitectureForTest as injectArchitecture, patchTsConfigForTest as patchTsConfig } from "./architecture.js";
import { cleanBoilerplateForTest as cleanBoilerplate } from "./boilerplate.js";
import { injectConfigFilesForTest as injectConfigFiles } from "./config-files.js";
import { checkMissingDeps, getDepReason } from "./dep-resolver.js";
import { buildShadcnConfig } from "./shadcn.js";

// Windows ESM symlink fix: use import.meta.url directly
const TEMPLATES = path.join(fileURLToPath(new URL(".", import.meta.url)), "../templates");
const VERSION    = "5.0.0";

// ─────────────────────────────────────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────────────────────────────────────

const I18N = {
  es: {
    q_lang: "🌐  Idioma / Language:",
    q_name: "¿Nombre del proyecto?",
    q_preset: "¿Qué stack quieres usar?",
    q_arch: "¿Qué arquitectura quieres usar?",
    q_extras: "¿Qué extras incluir?",
    q_libs: "¿Qué librerías quieres añadir?",
    q_starter: "¿Qué tipo de página inicial quieres?",
    q_shadcn: "¿Quieres incluir Shadcn/ui como base de componentes?",
    q_darkmode: "¿Soporte de modo oscuro? (next-themes + CSS vars)",
    q_pm: "¿Gestor de paquetes?",
    q_git_warn: "El proyecto se creará DENTRO de un repo existente. ¿Continuar?",
    q_overwrite: "El archivo ya existe. ¿Sobreescribir?",
    q_rollback: "¿Eliminar la carpeta generada para dejar todo limpio?",
    q_comp_client: "¿Componente de cliente ('use client') o servidor?",
    q_comp_test: "¿Generar también el archivo de tests?",
    q_missing_deps: (pkgs) => `Veo que no tienes ${pkgs.join(", ")}. ¿Quieres que lo instale y configure?`,
    preset_minimal: "Solo arquitectura + Tailwind",
    preset_full: "Next + TanStack Query + Zod + Lucide (Shadcn opcional)",
    preset_custom: "Elige librerías a la carta",
    starter_simple: "Simple",
    starter_simple_desc: "Landing mínima para empezar rápido",
    starter_guided: "Guiada",
    starter_guided_desc: "Home con orientación según arquitectura",
    starter_demo: "Demo",
    starter_demo_desc: "Home más rica con métricas y foco visual",
    err_starter: "Starter inválido. Usa: simple, guided o demo",
    spin_cna: "Ejecutando create-next-app@latest…",
    spin_clean: "Limpiando boilerplate…",
    spin_arch: "Inyectando arquitectura",
    spin_ts: "Actualizando tsconfig.json…",
    spin_cfg: "Copiando archivos de configuración…",
    spin_libs: "Instalando librerías…",
    spin_extras: "Instalando dependencias extra…",
    spin_shadcn: "Inicializando Shadcn/ui…",
    spin_git: "Inicializando Git…",
    spin_rm: "Eliminando carpeta…",
    ok_cna: "Next.js instalado",
    ok_clean: "Boilerplate limpiado",
    ok_arch: "Arquitectura lista",
    ok_ts: "tsconfig.json con aliases listo",
    ok_cfg: "Archivos de configuración listos",
    ok_libs: (n) => `${n} librerías instaladas`,
    ok_extras: (n) => `${n} dependencias extra instaladas`,
    ok_shadcn: "Shadcn/ui inicializado",
    warn_shadcn: "No se pudo inicializar Shadcn/ui automáticamente. El proyecto seguirá creándose.",
    warn_shadcn_manual: "Puedes ejecutarlo luego manualmente dentro del proyecto con:",
    ok_git: "Git listo (primer commit ✔)",
    ok_rm: (n) => `"${n}" eliminada.`,
    ok_project: "¡Proyecto listo!",
    ok_gen: (t, n) => `${t} "${n}" generado`,
    ok_feature: (n) => `Feature "${n}" generada con Public API`,
    err_name: "Solo minúsculas, números, guiones y underscores",
    err_exists: (n) => `La carpeta "${n}" ya existe.`,
    err_type: (t, v) => `Tipo inválido: "${t}". Usa: ${v}`,
    err_noname: "Falta el nombre. Ej: generate component MyButton",
    err_noconfig: "No se encontró .next-arch.json.\nEjecuta desde la raíz de un proyecto creado con create-next-arch.",
    err_fail: "Error:",
    err_feature_only: "El tipo 'feature' solo está disponible en arquitectura feature-based.",
    cancelled: "Operación cancelada.",
    git_warn: "⚠  Repositorio Git detectado en el directorio actual o en un padre.",
    next_steps: "Próximos pasos:",
    generate_hint: "Genera artefactos respetando tu arquitectura:",
    contributing: "Lee CONTRIBUTING.md para los estándares de commits.",
    open_file: "Abre el archivo y define tus props / tipos.",
    suggest_issues: "¿Bug inesperado? Reporta en: https://github.com/tu-usuario/create-next-arch/issues",
  },
  en: {
    q_lang: "🌐  Language / Idioma:",
    q_name: "Project name?",
    q_preset: "What stack do you want?",
    q_arch: "What architecture?",
    q_extras: "Which extras to include?",
    q_libs: "Which libraries to add?",
    q_starter: "What kind of starter page do you want?",
    q_shadcn: "Do you want to include Shadcn/ui as your component base?",
    q_darkmode: "Dark mode support? (next-themes + CSS vars)",
    q_pm: "Package manager?",
    q_git_warn: "Project will be created INSIDE an existing repo. Continue?",
    q_overwrite: "File already exists. Overwrite?",
    q_rollback: "Delete the generated folder to clean up?",
    q_comp_client: "Client ('use client') or server component?",
    q_comp_test: "Also generate the test file?",
    q_missing_deps: (pkgs) => `I see you don't have ${pkgs.join(", ")}. Install and configure it?`,
    preset_minimal: "Architecture + Tailwind only",
    preset_full: "Next + TanStack Query + Zod + Lucide (optional Shadcn)",
    preset_custom: "Pick libraries à la carte",
    starter_simple: "Simple",
    starter_simple_desc: "Minimal landing to start fast",
    starter_guided: "Guided",
    starter_guided_desc: "Home that explains the chosen architecture",
    starter_demo: "Demo",
    starter_demo_desc: "Richer home with metrics and visual emphasis",
    err_starter: "Invalid starter. Use: simple, guided or demo",
    spin_cna: "Running create-next-app@latest…",
    spin_clean: "Cleaning boilerplate…",
    spin_arch: "Injecting architecture",
    spin_ts: "Updating tsconfig.json…",
    spin_cfg: "Copying config files…",
    spin_libs: "Installing libraries…",
    spin_extras: "Installing extra dependencies…",
    spin_shadcn: "Initializing Shadcn/ui…",
    spin_git: "Initializing Git…",
    spin_rm: "Deleting folder…",
    ok_cna: "Next.js installed",
    ok_clean: "Boilerplate cleaned",
    ok_arch: "Architecture ready",
    ok_ts: "tsconfig.json with aliases ready",
    ok_cfg: "Config files ready",
    ok_libs: (n) => `${n} libraries installed`,
    ok_extras: (n) => `${n} extra dependencies installed`,
    ok_shadcn: "Shadcn/ui initialized",
    warn_shadcn: "Shadcn/ui auto-init failed. Project creation will continue.",
    warn_shadcn_manual: "You can run it manually later inside the project with:",
    ok_git: "Git ready (first commit ✔)",
    ok_rm: (n) => `"${n}" deleted.`,
    ok_project: "Project ready!",
    ok_gen: (t, n) => `${t} "${n}" generated`,
    ok_feature: (n) => `Feature "${n}" generated with Public API`,
    err_name: "Lowercase, numbers, dashes and underscores only",
    err_exists: (n) => `Folder "${n}" already exists.`,
    err_type: (t, v) => `Invalid type: "${t}". Use: ${v}`,
    err_noname: "Name required. Eg: generate component MyButton",
    err_noconfig: "No .next-arch.json found.\nRun from the root of a project created with create-next-arch.",
    err_fail: "Error:",
    err_feature_only: "The 'feature' type is only available in feature-based architecture.",
    cancelled: "Operation cancelled.",
    git_warn: "⚠  Git repository detected in current directory or a parent.",
    next_steps: "Next steps:",
    generate_hint: "Generate artifacts respecting your architecture:",
    contributing: "Read CONTRIBUTING.md for commit standards.",
    open_file: "Open the file and define your props / types.",
    suggest_issues: "Unexpected bug? Report at: https://github.com/tu-usuario/create-next-arch/issues",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const EXTRA_PACKAGES = {
  lint:       ["prettier", "eslint-config-prettier"],
  commitlint: ["@commitlint/cli", "@commitlint/config-conventional", "husky"],
  tests:      ["jest", "@testing-library/react", "@testing-library/jest-dom", "jest-environment-jsdom"],
};

const LIBRARY_PACKAGES = {
  "lucide-react":          ["lucide-react"],
  "zod":                   ["zod"],
  "@tanstack/react-query": ["@tanstack/react-query"],
  "zustand":               ["zustand"],
  "shadcn":                [],
  "next-themes":           ["next-themes"],
};

const PRESETS = {
  minimal: { libs: [],                                                            extras: ["envexample"] },
  full:    { libs: ["lucide-react", "zod", "@tanstack/react-query"],            extras: ["lint", "commitlint", "envexample"] },
  custom:  null,
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
  install:   pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm install" : "npm install",
  installCI: pm === "yarn" ? "yarn --frozen-lockfile" : pm === "pnpm" ? "pnpm install --frozen-lockfile" : "npm ci",
  dev:       pm === "yarn" ? "yarn dev" : `${pm} run dev`,
  addDep:    (pkgs) => pm === "yarn" ? `yarn add ${pkgs}` : pm === "pnpm" ? `pnpm add ${pkgs}` : `npm install ${pkgs}`,
  addDev:    (pkgs) => pm === "yarn" ? `yarn add -D ${pkgs}` : pm === "pnpm" ? `pnpm add -D ${pkgs}` : `npm install -D ${pkgs}`,
  cache:     pm,
});

const toPascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const toKebab  = (s) => s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const isInteractive = () => Boolean(process.stdin.isTTY && process.stdout.isTTY);

const readProjectConfig = async () => {
  const p = path.join(process.cwd(), ".next-arch.json");
  if (!(await fs.pathExists(p))) throw new Error("no_config");
  return fs.readJson(p);
};

// ─────────────────────────────────────────────────────────────────────────────
// BANNER + ERROR HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const banner = () => console.log(chalk.cyan(`
  ╔══════════════════════════════════════════╗
  ║      create-next-arch   v${VERSION}         ║
  ║  Next.js scaffolder — architecture + git ║
  ╚══════════════════════════════════════════╝
`));

/** Global error display — polished output */
const fatalError = (err, t) => {
  console.log(`\n${chalk.bgRed.white.bold(" ERROR ")} ${chalk.red(err.message)}`);
  if (t?.suggest_issues) console.log(chalk.dim(`\n${t.suggest_issues}\n`));
  process.exit(1);
};

// ─────────────────────────────────────────────────────────────────────────────
// PREGUNTAS
// ─────────────────────────────────────────────────────────────────────────────

const askLanguage = async () => {
  const { lang } = await inquirer.prompt([{
    type: "list", name: "lang",
    message: "🌐  Language / Idioma:",
    choices: [{ name: "Español", value: "es" }, { name: "English", value: "en" }],
  }]);
  return lang;
};

const askQuestions = async (projectNameArg, t, cliOptions = {}) => {
  const base = await inquirer.prompt([
    ...(!projectNameArg ? [{
      type: "input", name: "projectName", message: t.q_name, default: "my-next-app",
      validate: (v) => /^[a-z0-9-_]+$/.test(v.trim()) ? true : t.err_name,
    }] : []),
    {
      type: "list", name: "preset", message: t.q_preset,
      choices: [
        { name: `${chalk.bold("⚡ Minimal")}   ${chalk.dim(t.preset_minimal)}`, value: "minimal", short: "Minimal" },
        { name: `${chalk.bold("🚀 Full")}      ${chalk.dim(t.preset_full)}`,    value: "full",    short: "Full"    },
        { name: `${chalk.bold("🔧 Custom")}    ${chalk.dim(t.preset_custom)}`,  value: "custom",  short: "Custom"  },
      ],
    },
    {
      type: "list", name: "architecture", message: t.q_arch,
      choices: Object.entries(ARCHITECTURES).map(([value, a]) => ({
        name: `${chalk.bold(a.label.padEnd(26))} ${chalk.dim(a[`description_${t === I18N.en ? "en" : "es"}`])}`,
        value, short: a.label,
      })),
    },
  ]);

  let libs   = PRESETS[base.preset]?.libs   ?? [];
  let extras = PRESETS[base.preset]?.extras ?? [];

  if (base.preset === "custom") {
    const r1 = await inquirer.prompt([{
      type: "checkbox", name: "libs", message: t.q_libs,
      choices: [
        { name: `${chalk.bold("Lucide React")}         ${chalk.dim("Icon library")}`,                    value: "lucide-react",             checked: true  },
        { name: `${chalk.bold("Zod")}                  ${chalk.dim("Schema validation")}`,               value: "zod",                      checked: true  },
        { name: `${chalk.bold("TanStack Query")}        ${chalk.dim("Async state & data fetching")}`,     value: "@tanstack/react-query",     checked: false },
        { name: `${chalk.bold("Zustand")}              ${chalk.dim("Lightweight global state")}`,        value: "zustand",                  checked: false },
        { name: `${chalk.bold("Shadcn/ui")}            ${chalk.dim("Component base (init runs auto)")}`, value: "shadcn",                   checked: false },
      ],
    }]);
    const r2 = await inquirer.prompt([{
      type: "checkbox", name: "extras", message: t.q_extras,
      choices: [
        { name: `${chalk.bold("ESLint + Prettier")}    ${chalk.dim("prettier, eslint-config-prettier")}`, value: "lint",       checked: true  },
        { name: `${chalk.bold("Commitlint + Husky")}   ${chalk.dim("@commitlint/cli, husky")}`,           value: "commitlint", checked: true  },
        { name: `${chalk.bold("GitHub Actions CI")}    ${chalk.dim(".github/workflows/ci.yml")}`,         value: "ghactions",  checked: false },
        { name: `${chalk.bold("Testing (Jest+RTL)")}   ${chalk.dim("jest, @testing-library/react")}`,    value: "tests",      checked: false },
        { name: `${chalk.bold(".env.example")}         ${chalk.dim("env vars template")}`,               value: "envexample", checked: true  },
      ],
    }]);
    libs   = r1.libs;
    extras = r2.extras;
  } else {
    const { includeShadcn } = await inquirer.prompt([{
      type: "confirm",
      name: "includeShadcn",
      message: t.q_shadcn,
      default: base.preset === "full",
    }]);

    if (includeShadcn) libs = [...libs, "shadcn"];
  }

  const rest = await inquirer.prompt([
    ...(cliOptions.starter ? [] : [{
      type: "list",
      name: "starter",
      message: t.q_starter,
      choices: [
        { name: `${chalk.bold(t.starter_simple)}   ${chalk.dim(t.starter_simple_desc)}`, value: "simple" },
        { name: `${chalk.bold(t.starter_guided)}  ${chalk.dim(t.starter_guided_desc)}`, value: "guided" },
        { name: `${chalk.bold(t.starter_demo)}    ${chalk.dim(t.starter_demo_desc)}`, value: "demo" },
      ],
      default: "guided",
    }]),
    { type: "confirm", name: "darkMode",      message: t.q_darkmode, default: false },
    { type: "list",    name: "packageManager", message: t.q_pm, choices: ["npm", "pnpm", "yarn"], default: "npm" },
  ]);

  return {
    projectName: projectNameArg || base.projectName,
    preset: base.preset, architecture: base.architecture,
    libs, extras, starter: cliOptions.starter ?? rest.starter, ...rest,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

const rollback = async (projectPath, err, spinner, t) => {
  spinner.stop();
  console.log(`\n${chalk.bgRed.white.bold(" ERROR ")} ${chalk.red(err.message)}`);
  if (!(await fs.pathExists(projectPath))) {
    console.log(chalk.dim(`\n${t.suggest_issues}\n`));
    return;
  }
  const { cleanup } = await inquirer.prompt([{
    type: "confirm", name: "cleanup", message: chalk.yellow(t.q_rollback), default: true,
  }]);
  if (cleanup) {
    const s = ora(t.spin_rm).start();
    await fs.remove(projectPath);
    s.succeed(chalk.green(t.ok_rm(path.basename(projectPath))));
  }
  console.log(chalk.dim(`\n${t.suggest_issues}\n`));
};

// ─────────────────────────────────────────────────────────────────────────────
// PASOS
// ─────────────────────────────────────────────────────────────────────────────

const runCreateNextApp = (projectName, pm) => {
  run(
    `npx create-next-app@latest ${projectName} --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-${pm} --no-git`,
    process.cwd(), "create-next-app", true
  );
};

/** Installs TanStack Query, creates BaseService and ReactQueryProvider */
const setupTanstackQuery = async (projectPath, architecture, pm) => {
  const cmds = buildCmds(pm);
  run(cmds.addDep("@tanstack/react-query"), projectPath, "install @tanstack/react-query", true);

  // BaseService
  const libDir = {
    feature: "src/shared/lib",
    layer:   "src/lib",
    ddd:     "src/infrastructure/api",
  }[architecture] ?? "src/lib";
  await fs.ensureDir(path.join(projectPath, libDir));
  await fs.writeFile(
    path.join(projectPath, libDir, "http.ts"),
    await readTemplate("generate/base-service.ts")
  );

  // ReactQueryProvider — always in shared ui
  const uiDir = {
    feature: "src/shared/components/ui",
    layer:   "src/components/ui",
    ddd:     "src/presentation/components",
  }[architecture] ?? "src/shared/components/ui";
  await fs.ensureDir(path.join(projectPath, uiDir));
  await fs.writeFile(
    path.join(projectPath, uiDir, "ReactQueryProvider.tsx"),
    await readTemplate("ReactQueryProvider.tsx")
  );
};

const installLibraries = async (projectPath, libs, architecture, pm) => {
  const cmds    = buildCmds(pm);
  const regular = libs.filter(l => l !== "shadcn").flatMap(l => LIBRARY_PACKAGES[l] ?? []);
  if (regular.length) run(cmds.addDep(regular.join(" ")), projectPath, "install libs", true);

  // If TanStack Query selected, also write BaseService + Provider
  if (libs.includes("@tanstack/react-query")) {
    await setupTanstackQuery(projectPath, architecture, pm);
  }
  return regular.length;
};

/** Write pre-configured components.json so shadcn uses our aliases */
const writeShadcnConfig = async (projectPath, architecture) => {
  const config = buildShadcnConfig(architecture);
  await fs.writeJson(path.join(projectPath, "components.json"), config, { spaces: 2 });

  // Pre-create cn.ts to bypass Shadcn CLI flakiness with custom aliases
  const utilsFolder = architecture === "layer" ? "src/utils" : "src/shared/utils";
  const cnCode = `import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`;
  await fs.outputFile(path.join(projectPath, utilsFolder, "cn.ts"), cnCode);
};

const initShadcn = async (projectPath) => {
  // Use a project-local npm cache to avoid permission issues on some Windows setups.
  const localCache = path.join(projectPath, ".create-next-arch-cache", "npm-cache");
  await fs.ensureDir(localCache);

  run(
    "npx --yes shadcn@latest init --yes",
    projectPath,
    "shadcn init",
    true,
    {
      npm_config_cache: localCache,
      NPM_CONFIG_CACHE: localCache,
    }
  );
};

const installExtras = (projectPath, extras, pm) => {
  const cmds = buildCmds(pm);
  const pkgs = extras.flatMap(e => EXTRA_PACKAGES[e] ?? []);
  if (!pkgs.length) return 0;
  run(cmds.addDev(pkgs.join(" ")), projectPath, "install extras", true);
  return pkgs.length;
};

const setupGit = (projectPath) => {
  run("git init",  projectPath, "git init");
  run("git add .", projectPath, "git add");
  run(`git commit -m "chore: initial scaffold by create-next-arch"`, projectPath, "git commit");
};

// ─────────────────────────────────────────────────────────────────────────────
// COMANDO: create
// ─────────────────────────────────────────────────────────────────────────────

const createCommand = async (projectNameArg, cliOptions = {}) => {
  banner();

  const lang = await askLanguage();
  const t    = I18N[lang];

  if (cliOptions.starter && !["simple", "guided", "demo"].includes(cliOptions.starter)) {
    fatalError(new Error(t.err_starter), t);
  }

  if (detectExistingGitRepo()) {
    console.log(chalk.yellow(`\n${t.git_warn}\n`));
    const { proceed } = await inquirer.prompt([{
      type: "confirm", name: "proceed", message: t.q_git_warn, default: false,
    }]);
    if (!proceed) { console.log(chalk.dim(`\n${t.cancelled}\n`)); process.exit(0); }
  }

  let opts;
  try { opts = await askQuestions(projectNameArg, t, cliOptions); }
  catch { console.log(chalk.yellow(`\n${t.cancelled}`)); process.exit(0); }

  const { projectName, architecture, libs, extras, darkMode, packageManager, starter } = opts;
  const projectPath = path.resolve(process.cwd(), projectName);
  const cmds = buildCmds(packageManager);
  const arch = ARCHITECTURES[architecture];
  const aliases = ARCH_ALIASES[architecture];
  const hasShadcn = libs.includes("shadcn");

  if (await fs.pathExists(projectPath)) {
    fatalError(new Error(t.err_exists(projectName)), t);
  }

  // Preview
  console.log(chalk.dim(`\n📂 ${arch.label}\n`));
  console.log(chalk.dim(arch.tree.split("\n").map(l => `   ${l}`).join("\n")));
  console.log(chalk.dim("\n  🔗 tsconfig aliases:"));
  Object.entries(aliases).forEach(([k, [v]]) =>
    console.log(chalk.dim(`     ${chalk.cyan(k.padEnd(22))} → ${v}`))
  );
  console.log();

  const spinner = ora({ color: "cyan" });

  try {
    console.log(chalk.dim(`\n  → ${t.spin_cna}\n`));
    runCreateNextApp(projectName, packageManager);
    spinner.succeed(chalk.green(t.ok_cna));

    spinner.start(t.spin_clean);
    await cleanBoilerplate(projectPath, {
      projectName,
      darkMode,
      architecture,
      libs,
      lang,
      starter,
    });
    spinner.succeed(chalk.green(t.ok_clean));

    spinner.start(`${t.spin_arch} "${arch.label}"…`);
    await injectArchitecture(projectPath, architecture);
    spinner.succeed(chalk.green(t.ok_arch));

    spinner.start(t.spin_ts);
    await patchTsConfig(projectPath, architecture);
    spinner.succeed(chalk.green(t.ok_ts));

    // Pre-configure Shadcn BEFORE running its init (so it picks up our aliases)
    if (hasShadcn) {
      await writeShadcnConfig(projectPath, architecture);
    }

    spinner.start(t.spin_cfg);
    await injectConfigFiles(projectPath, { ...opts, lang }, t, lang);
    spinner.succeed(chalk.green(t.ok_cfg));

    // ── Single unified install (much faster than 3 separate npm calls) ────────
    const depsRegular = [
      ...libs.filter(l => l !== "shadcn").flatMap(l => LIBRARY_PACKAGES[l] ?? []),
      ...(darkMode ? ["next-themes"] : []),
    ];
    const devDeps = extras.flatMap(e => EXTRA_PACKAGES[e] ?? []);
    const cmds = buildCmds(packageManager);

    if (depsRegular.length || devDeps.length) {
      spinner.stop();
      const totalPkgs = depsRegular.length + devDeps.length;
      console.log(chalk.dim(`\n  → Instalando ${totalPkgs} paquetes en una sola llamada…\n`));
      if (depsRegular.length) run(cmds.addDep(depsRegular.join(" ")), projectPath, "install deps", true);
      if (devDeps.length)     run(cmds.addDev(devDeps.join(" ")),     projectPath, "install devDeps", true);
      spinner.succeed(chalk.green(`${totalPkgs} paquetes instalados`));
    }

    // TanStack Query extra setup (BaseService + Provider files)
    if (libs.includes("@tanstack/react-query")) {
      spinner.start("Configurando TanStack Query…");
      await setupTanstackQuery(projectPath, architecture, packageManager);
      spinner.succeed(chalk.green("TanStack Query configurado"));
    }

    if (hasShadcn) {
      spinner.stop();
      console.log(chalk.dim(`\n  → ${t.spin_shadcn}\n`));
      try {
        await initShadcn(projectPath);
        spinner.succeed(chalk.green(t.ok_shadcn));
      } catch (err) {
        spinner.warn(chalk.yellow(t.warn_shadcn));
        console.log(chalk.yellow(`  ${t.warn_shadcn_manual}`));
        console.log(chalk.cyan("  npx --yes shadcn@latest init --yes"));
        console.log(chalk.dim(`  (${err.message})\n`));
      }
    }

    spinner.start(t.spin_git);
    setupGit(projectPath);
    spinner.succeed(chalk.green(t.ok_git));

  } catch (err) {
    await rollback(projectPath, err, spinner, t);
    process.exit(1);
  }

  const libsLabel   = libs.length   ? libs.map(l => chalk.cyan(l)).join(", ")   : chalk.dim("—");
  const extrasLabel = extras.length ? extras.map(e => chalk.cyan(e)).join(", ") : chalk.dim("—");

  console.log(`
${chalk.bold.green(`✔  ${t.ok_project}`)}

  ${chalk.bold("Proyecto:")}     ${chalk.cyan(projectName)}
  ${chalk.bold("Arquitectura:")} ${chalk.cyan(arch.label)}
  ${chalk.bold("Starter:")}      ${chalk.cyan(starter)}
  ${chalk.bold("Dark mode:")}    ${darkMode ? chalk.cyan("✔") : chalk.dim("—")}
  ${chalk.bold("Librerías:")}    ${libsLabel}
  ${chalk.bold("Extras:")}       ${extrasLabel}
  ${chalk.bold("Git:")}          ${chalk.cyan("commit inicial ✔")}

${chalk.bold(t.next_steps)}

  ${chalk.cyan(`cd ${projectName}`)}
  ${chalk.cyan(cmds.dev)}

${chalk.bold(t.generate_hint)}

  ${chalk.cyan("create-next-arch generate component MyButton")}
  ${chalk.cyan("create-next-arch g hook Auth")}
  ${chalk.cyan("create-next-arch g service User")}
  ${architecture === "feature" ? chalk.cyan("create-next-arch g feature Checkout") + "\n" : ""}
  ${hasShadcn ? chalk.cyan("npx shadcn@latest add button") + "\n" : ""}
${chalk.dim(`→ ${t.contributing}`)}
`);
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
  catch { fatalError(new Error("No .next-arch.json found. Run from a project root created with create-next-arch."), null); }

  const { architecture, packageManager = "npm", lang = "en" } = config;
  const t    = I18N[lang];
  const arch = ARCHITECTURES[architecture];

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
      const { installMissing } = await inquirer.prompt([{
        type: "confirm", name: "installMissing",
        message: chalk.yellow(t.q_missing_deps(missingDeps)),
        default: true,
      }]);
      if (installMissing) {
        const cmds = buildCmds(packageManager);
        const spinner = ora({ color: "cyan" }).start(`Installing ${missingDeps.join(", ")}…`);
        try {
          run(cmds.addDep(missingDeps.join(" ")), process.cwd(), "install missing deps", false);
          // Also write BaseService if installing TanStack Query
          if (missingDeps.includes("@tanstack/react-query")) {
            await setupTanstackQuery(process.cwd(), architecture, packageManager);
          }
          spinner.succeed(chalk.green(`${missingDeps.join(", ")} installed`));
        } catch (err) {
          spinner.fail(chalk.red(`Failed to install: ${err.message}`));
        }
      }
    } else {
      console.log(chalk.dim(`Skipping prompt in non-interactive mode. Missing deps: ${missingDeps.join(", ")}`));
    }
  }

  // ── Generate logic ─────────────────────────────────────────────────────────
  const spinner = ora({ color: "cyan" });

  if (type === "feature") {
    // Special case: generate full feature scaffold + public API index
    const featureName = toPascal(name);
    const featureSlug = name.toLowerCase();
    const featureDir  = path.join(process.cwd(), `src/features/${featureSlug}`);
    const subfolders  = ["components", "hooks", "services", "types"];

    spinner.start(`Generating feature "${featureName}"…`);
    try {
      for (const sub of subfolders) {
        await fs.ensureDir(path.join(featureDir, sub));
        await fs.writeFile(path.join(featureDir, sub, ".gitkeep"), "");
      }
      // Public API index.ts
      const indexContent = await readTemplate("generate/feature-index.ts", {
        FEATURE_NAME:           featureName,
        FEATURE_SLUG:           featureSlug,
        FEATURE_EXPORT_EXAMPLE: `${featureName}Page`,
        FEATURE_NAME_LOWER:     featureSlug,
      });
      await fs.writeFile(path.join(featureDir, "index.ts"), indexContent);
      spinner.succeed(chalk.green(t.ok_feature(featureName)));

      console.log(`
  ${chalk.bold("Feature:")}      ${chalk.cyan(`src/features/${featureSlug}/`)}
  ${chalk.bold("Public API:")}   ${chalk.cyan(`src/features/${featureSlug}/index.ts`)}
  ${chalk.bold("Subfolders:")}   ${subfolders.map(s => chalk.dim(s)).join("  ")}
  ${chalk.dim(`Import: import { ... } from "@features/${featureSlug}"`)}
`);
    } catch (err) { spinner.fail(chalk.red(err.message)); process.exit(1); }
    return;
  }

  // ── component / hook / service ─────────────────────────────────────────────
  const destDir = path.join(process.cwd(), GENERATE_PATHS[type][architecture](name));
  let destFile, templateFile, replacements, testFile;

  if (type === "component") {
    const isClient = isInteractive()
      ? (await inquirer.prompt([{
          type: "list", name: "isClient", message: t.q_comp_client,
          choices: [
            { name: "Server component (default)", value: false },
            { name: "Client component ('use client')", value: true  },
          ],
        }])).isClient
      : false;
    const withTest = isInteractive()
      ? (await inquirer.prompt([{
          type: "confirm", name: "withTest", message: t.q_comp_test, default: false,
        }])).withTest
      : false;
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
    const { overwrite } = await inquirer.prompt([{
      type: "confirm", name: "overwrite",
      message: chalk.yellow(`${t.q_overwrite} (${path.relative(process.cwd(), destFile)})`),
      default: false,
    }]);
    if (!overwrite) { console.log(chalk.dim(`\n${t.cancelled}\n`)); process.exit(0); }
  }

  spinner.start(`Generating ${type} "${name}"…`);
  try {
    await fs.ensureDir(destDir);
    await fs.writeFile(destFile, await readTemplate(templateFile, replacements));
    if (testFile) await fs.writeFile(testFile, await readTemplate("generate/component.test.tsx", replacements));
    spinner.succeed(chalk.green(t.ok_gen(type, name)));

    console.log(`
  ${chalk.bold("File:")}         ${chalk.cyan(path.relative(process.cwd(), destFile))}
  ${testFile ? `${chalk.bold("Test:")}         ${chalk.cyan(path.relative(process.cwd(), testFile))}\n  ` : ""}${chalk.bold("Architecture:")} ${chalk.cyan(arch.label)}
  ${chalk.dim(t.open_file)}
`);
  } catch (err) {
    spinner.fail(chalk.red(err.message));
    process.exit(1);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

program
  .name("create-next-arch")
  .description("Next.js scaffolder — architecture + git + libraries")
  .version(VERSION);

program
  .command("create [project-name]", { isDefault: true })
  .description("Create a new Next.js project with architecture ready")
  .option("--starter <mode>", "Starter page mode: simple | guided")
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
    "    create-next-arch generate component MyButton",
    "    create-next-arch g hook Auth",
    "    create-next-arch g service User",
    "    create-next-arch g feature Checkout   (feature-based only)",
  ].join("\n"))
  .action(async (type, name) => {
    try { await generateCommand(type, name); }
    catch (err) { fatalError(err, I18N.en); }
  });

program.parse();