import * as p from "@clack/prompts";
import chalk from "chalk";
import gradient from "gradient-string";
import boxen from "boxen";
import { ARCHITECTURES } from "../architecture.js";

const techGradient = gradient(["#f700ffff", "#00f6ac", "#ffffff"]);
const accentColor = "#00f6ac";
const borderTheme = "#ffffff";
/**
 * Renders the Cyber-Minimalist tech intro banner
 * @param {string} version 
 */
export function renderIntro(version) {
  console.clear();
  
  const introBox = boxen(
    techGradient("  C R E A T E   ///   W E B   ///   A R C H  "),
    {
      padding: { top: 1, bottom: 1, left: 3, right: 3 },
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: "round",
      borderColor: borderTheme,
      title: chalk.bold.hex(accentColor)(` v${version} `),
      titleAlignment: "right"
    }
  );

  console.log(introBox);
  p.intro(chalk.black.bgHex("#4364F7")(" SYSTEM // INITIALIZING CONFIGURATION MAP "));
}

/**
 * Interactive prompts for create command using @clack/prompts
 */
export async function askQuestionsClack({
  projectNameArg,
  frameworkArg,
  templateArg,
  t,
  lang,
  defaultPm = "npm"
}) {
  const result = {};

  // 1. Project Name (if not supplied via CLI)
  if (!projectNameArg) {
    const name = await p.text({
      message: chalk.hex(accentColor)("┌─ TARGET_DIRECTORY"),
      placeholder: "e.g., my-next-app",
      validate: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return t.projectNameMandatory || "Project name is required.";
        if (!/^[a-z0-9-_]+$/.test(trimmed)) return t.err_name;
      }
    });
    if (p.isCancel(name)) handleCancel();
    result.projectName = name.trim();
  } else {
    result.projectName = projectNameArg;
  }

  // 2. Framework Selection (if not supplied via CLI)
  if (!frameworkArg) {
    const framework = await p.select({
      message: chalk.hex(accentColor)("├─ FRAMEWORK"),
      options: [
        { value: "next", label: "▲ Next.js", hint: "App Router, React 19 (Recommended)" },
        { value: "astro", label: "🚀 Astro", hint: "Content-focused, islands architecture" }
      ]
    });
    if (p.isCancel(framework)) handleCancel();
    result.framework = framework;
  } else {
    result.framework = frameworkArg;
  }

  // 3. Template / Architecture Selection (if not supplied via CLI)
  if (!templateArg) {
    const template = await p.select({
      message: chalk.hex(accentColor)("├─ ARCHITECTURE_TEMPLATE"),
      options: [
        { value: "feature", label: "📦 Feature-Driven System", hint: "Domain-centric & highly modular (Recommended)" },
        { value: "layer", label: "🥞 Layered Clean Architecture", hint: "Strict separation of concerns" },
        { value: "ddd", label: "🏗️ Domain-Driven Design Lite", hint: "Separates domain, application and infrastructure" }
      ]
    });
    if (p.isCancel(template)) handleCancel();
    result.template = template;
  } else {
    result.template = templateArg;
  }

  // 4. Package Manager (for dependencies installation)
  const packageManager = await p.select({
    message: chalk.hex(accentColor)("└─ DEPS_INSTALLATION_PACKAGE_MANAGER"),
    options: [
      { value: "npm", label: "npm", hint: "Standard npm install" },
      { value: "pnpm", label: "pnpm", hint: "Fast disk space efficient" },
      { value: "yarn", label: "yarn", hint: "Yarn package manager" },
      { value: "bun", label: "bun", hint: "Ultra-fast JavaScript runtime" },
      { value: "skip", label: "Omitir instalación / Skip installation", hint: "Do not run install command" }
    ],
    initialValue: defaultPm
  });
  if (p.isCancel(packageManager)) handleCancel();
  result.packageManager = packageManager;

  return result;
}

/**
 * Prompt Language choice
 */
export async function askLanguageClack() {
  const lang = await p.select({
    message: chalk.hex(accentColor)("🌐 CHOOSE_SYSTEM_LANGUAGE // IDIOMA"),
    options: [
      { value: "es", label: "Español" },
      { value: "en", label: "English" }
    ]
  });
  if (p.isCancel(lang)) handleCancel();
  return lang;
}

function handleCancel() {
  p.cancel(chalk.red("✖ ENGINE_HALTED: Operación abortada por el usuario."));
  process.exit(0);
}

/**
 * Render standard premium completion box
 */
export function renderCompletionBox({ projectName, framework, template, pkgManager, t }) {
  const successUIMap = `
${chalk.bold.hex(accentColor)(`✔ ${t.ok_project || "Project ready!"}`)}

  ${chalk.bold("Proyecto:")}     ${chalk.cyan(projectName)}
  ${chalk.bold("Framework:")}    ${chalk.cyan(framework)}
  ${chalk.bold("Template:")}     ${chalk.cyan(template)}
  ${chalk.bold("Git:")}          ${chalk.cyan("commit inicial ✔")}

${chalk.bold(t.next_steps || "Next steps:")}

  ${chalk.cyan(`cd ${projectName}`)}
  ${pkgManager !== "skip" ? chalk.cyan(`${pkgManager} run dev`) : chalk.cyan(`npm install\n  npm run dev`)}
  `;

  console.log(boxen(successUIMap, {
    padding: 1,
    margin: { top: 1, bottom: 2, left: 0, right: 0 },
    borderStyle: "round",
    borderColor: borderTheme
  }));
}
