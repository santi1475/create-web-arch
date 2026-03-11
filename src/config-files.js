/**
 * config-files.js — Inject config files from templates
 * Extracted as a module so tests can call it directly.
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { ARCHITECTURES, ARCH_ALIASES } from "./architecture.js";
import { buildShadcnConfig } from "./shadcn.js";

// Windows ESM symlink fix: use import.meta.url directly
const TEMPLATES = path.join(fileURLToPath(new URL(".", import.meta.url)), "../templates");

const VERSION = "5.0.0";

const readTemplate = async (filename, replacements = {}) => {
  const content = await fs.readFile(path.join(TEMPLATES, filename), "utf-8");
  return Object.entries(replacements).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, "g"), v), content
  );
};

const buildCmds = (pm) => ({
  install:   pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm install" : "npm install",
  installCI: pm === "yarn" ? "yarn --frozen-lockfile" : pm === "pnpm" ? "pnpm install --frozen-lockfile" : "npm ci",
  dev:       pm === "yarn" ? "yarn dev" : `${pm} run dev`,
  cache:     pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm" : "npm",
});

// i18n strings needed for README
const README_I18N = {
  es: {
    tagline:         (arch) => `Proyecto generado con [create-next-arch](https://github.com/tu-usuario/create-next-arch) — arquitectura \`${arch}\`.`,
    requirements:    "Requisitos",    install:      "Instalación",
    scripts:         "Scripts",       description:  "Descripción",
    dev:             "Servidor de desarrollo en `localhost:3000`",
    build:           "Build de producción", start: "Servidor de producción",
    lint:            "ESLint", structure: "Estructura",
    aliases:         "Aliases de importación",
    aliases_desc:    "Configurados en `tsconfig.json`:",
    env:             "Variables de entorno",
    arch_freedom:    "Libertad de arquitectura",
    arch_freedom_txt:"Esta arquitectura es una **base recomendada, no una restricción**. Mueve o añade carpetas en `src/` según las necesidades de tu proyecto.",
    commits:         "Commits",
    commits_txt:     "Este proyecto usa **Conventional Commits**. Ver [CONTRIBUTING.md](./CONTRIBUTING.md).",
    generate:        "Generar artefactos",
    generate_details: "Qué genera cada comando",
    starter:         "Starter inicial",
    starter_desc:    (starter) => `Modo de home elegido: **${starter}**. Puedes cambiarlo más adelante editando src/app/page.tsx.`,
    license:         "Licencia",
  },
  en: {
    tagline:         (arch) => `Project generated with [create-next-arch](https://github.com/tu-usuario/create-next-arch) — \`${arch}\` architecture.`,
    requirements:    "Requirements",  install:      "Getting started",
    scripts:         "Scripts",       description:  "Description",
    dev:             "Dev server at `localhost:3000`",
    build:           "Production build", start:    "Start production server",
    lint:            "Run ESLint", structure: "Project structure",
    aliases:         "Import aliases",
    aliases_desc:    "Configured in `tsconfig.json`:",
    env:             "Environment variables",
    arch_freedom:    "Architecture freedom",
    arch_freedom_txt:"This architecture is a **recommended base, not a restriction**. Move or add folders in `src/` as your project needs.",
    commits:         "Commits",
    commits_txt:     "This project uses **Conventional Commits**. See [CONTRIBUTING.md](./CONTRIBUTING.md).",
    generate:        "Generate artifacts",
    generate_details: "What each command generates",
    starter:         "Initial starter",
    starter_desc:    (starter) => `Selected home mode: **${starter}**. You can change it later by editing src/app/page.tsx.`,
    license:         "License",
  },
};

const GENERATE_DOC_PATHS = {
  feature: {
    component: "src/features/common/components",
    hook: "src/shared/hooks",
    service: "src/features/common/services",
  },
  layer: {
    component: "src/components/ui",
    hook: "src/hooks",
    service: "src/services",
  },
  ddd: {
    component: "src/presentation/components",
    hook: "src/presentation/hooks",
    service: "src/application/common/use-cases",
  },
};

const buildGenerateDetails = (lang, architecture) => {
  const paths = GENERATE_DOC_PATHS[architecture] ?? GENERATE_DOC_PATHS.layer;

  if (lang === "es") {
    const lines = [
      "`g` es alias de `generate`.",
      `- ` + "`component Nombre` crea `Nombre.tsx` en `" + paths.component + "` y te pregunta si será server/client component y si debe incluir test.",
      `- ` + "`hook Auth` crea `useAuth.ts` en `" + paths.hook + "`.",
      `- ` + "`service User` crea `UserService.ts` en `" + paths.service + "` con un esqueleto para llamadas a `/api`.",
    ];

    if (architecture === "feature") {
      lines.push("- `feature Checkout` crea `src/features/checkout/` con `components`, `hooks`, `services`, `types` e `index.ts` como Public API.");
    }

    return lines.join("\n");
  }

  const lines = [
    "`g` is an alias for `generate`.",
    `- ` + "`component Name` creates `Name.tsx` in `" + paths.component + "` and asks whether it should be a server/client component and whether to add a test file.",
    `- ` + "`hook Auth` creates `useAuth.ts` in `" + paths.hook + "`.",
    `- ` + "`service User` creates `UserService.ts` in `" + paths.service + "` with a starter `/api` fetch layer.",
  ];

  if (architecture === "feature") {
    lines.push("- `feature Checkout` creates `src/features/checkout/` with `components`, `hooks`, `services`, `types` and an `index.ts` Public API.");
  }

  return lines.join("\n");
};

/**
 * Inject all config files into projectPath.
 * @param {string} projectPath
 * @param {object} opts  - { extras, projectName, architecture, packageManager, lang, darkMode, starter }
 */
export async function injectConfigFilesForTest(projectPath, opts) {
  const { extras, projectName, architecture, packageManager, lang = "es", starter = "guided" } = opts;
  const cmds  = buildCmds(packageManager);
  const arch  = ARCHITECTURES[architecture];
  const aliases = ARCH_ALIASES[architecture];
  const r     = README_I18N[lang];

  await fs.writeFile(path.join(projectPath, ".gitignore"),      await readTemplate("gitignore.txt"));
  await fs.writeFile(path.join(projectPath, "CONTRIBUTING.md"), await readTemplate(`CONTRIBUTING.${lang}.md`));

  const aliasesJson = JSON.stringify(
    Object.fromEntries(Object.entries(aliases).map(([k, v]) => [k, v[0]])), null, 4
  );
  const generateExamples = [
    "create-next-arch generate component MyButton",
    "create-next-arch generate hook Auth",
    "create-next-arch generate service User",
  ].join("\n");
  const generateDetails = buildGenerateDetails(lang, architecture);

  await fs.writeFile(path.join(projectPath, "README.md"), await readTemplate("README.md", {
    PROJECT_NAME: projectName,
    README_TAGLINE: r.tagline(architecture),
    README_REQUIREMENTS: r.requirements,
    PACKAGE_MANAGER: packageManager,
    README_INSTALL: r.install,
    INSTALL_CMD: cmds.install,
    DEV_CMD: cmds.dev,
    README_SCRIPTS: r.scripts,
    README_DESCRIPTION: r.description,
    PM: packageManager,
    README_SCRIPT_DEV: r.dev,
    README_SCRIPT_BUILD: r.build,
    README_SCRIPT_START: r.start,
    README_SCRIPT_LINT: r.lint,
    README_STRUCTURE: r.structure,
    TREE: arch.tree,
    README_ALIASES: r.aliases,
    README_ALIASES_DESC: r.aliases_desc,
    ALIASES_JSON: aliasesJson,
    README_ENV: r.env,
    README_ARCH_FREEDOM: r.arch_freedom,
    README_ARCH_FREEDOM_TEXT: r.arch_freedom_txt,
    README_COMMITS: r.commits,
    README_COMMITS_TEXT: r.commits_txt,
    README_GENERATE: r.generate,
    README_GENERATE_EXAMPLES: generateExamples,
    README_GENERATE_DETAILS_TITLE: r.generate_details,
    README_GENERATE_DETAILS: generateDetails,
    README_STARTER: r.starter,
    README_STARTER_DESC: r.starter_desc(starter),
    README_LICENSE: r.license,
  }));

  if (extras.includes("envexample")) {
    await fs.writeFile(path.join(projectPath, ".env.example"),
      await readTemplate("env.example", { PROJECT_NAME: projectName })
    );
  }
  if (extras.includes("lint")) {
    await fs.writeFile(path.join(projectPath, ".eslintrc.json"), await readTemplate("eslintrc.json"));
    await fs.writeFile(path.join(projectPath, ".prettierrc"),    await readTemplate("prettierrc.json"));
    await fs.writeFile(path.join(projectPath, ".prettierignore"), ".next\nnode_modules\ndist\n");
  }
  if (extras.includes("commitlint")) {
    await fs.writeFile(path.join(projectPath, "commitlint.config.js"), await readTemplate("commitlint.config.js"));
    await fs.ensureDir(path.join(projectPath, ".husky"));
    await fs.writeFile(path.join(projectPath, ".husky/commit-msg"),
      `#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\nnpx --no -- commitlint --edit "$1"\n`
    );
    await fs.chmod(path.join(projectPath, ".husky/commit-msg"), "755");
  }
  if (extras.includes("ghactions")) {
    await fs.ensureDir(path.join(projectPath, ".github/workflows"));
    await fs.writeFile(path.join(projectPath, ".github/workflows/ci.yml"),
      await readTemplate("ci.yml", { CACHE: cmds.cache, INSTALL_CI_CMD: cmds.installCI, PM: packageManager })
    );
  }

  // .next-arch.json
  await fs.writeJson(path.join(projectPath, ".next-arch.json"), {
    architecture, packageManager, lang, starter, version: VERSION,
    createdAt: new Date().toISOString(),
  }, { spaces: 2 });
}