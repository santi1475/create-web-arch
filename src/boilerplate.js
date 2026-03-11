/**
 * boilerplate.js — Clean Next.js boilerplate after create-next-app
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { ARCHITECTURES } from "./architecture.js";

// Windows ESM symlink fix: use import.meta.url directly
const TEMPLATES = path.join(fileURLToPath(new URL(".", import.meta.url)), "../templates");

const readTemplate = async (filename, replacements = {}) => {
  const content = await fs.readFile(path.join(TEMPLATES, filename), "utf-8");
  return Object.entries(replacements).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, "g"), v), content
  );
};

const PAGE_I18N = {
  es: {
    badge: "Arquitectura lista",
    title: "Base inicial para construir algo real",
    subtitle: "El proyecto ya arranca con una estructura clara, comandos de generación y espacio para crecer sin rehacer carpetas desde el día uno.",
    demoBadge: "Starter demo",
    demoTitle: "Una base que ya parece producto",
    demoSubtitle: "El starter demo enseña mejor el valor de tu CLI: estructura, stack, orientación y una primera pantalla con intención visual.",
    architecture: "Arquitectura",
    stack: "Stack base",
    ui: "UI",
    nextStep: "Siguiente paso recomendado",
    generators: "Generadores",
    generatorsHint: "Estos comandos crean artefactos en la ruta correcta según tu arquitectura.",
    blueprint: "Cómo empezar con esta arquitectura",
    architectureFallback: "Arquitectura personalizada para Next.js",
    uiWithShadcn: "Shadcn/ui listo para añadir componentes reutilizables.",
    uiWithoutShadcn: "Tailwind puro por defecto; puedes añadir Shadcn/ui después si lo necesitas.",
    starterCommand: "create-next-arch generate component HeroBanner",
    secondaryCommand: "create-next-arch g service User",
    simpleTitle: "Starter listo",
    simpleBody: "Empieza editando src/app/page.tsx o genera tu primer artefacto.",
    demoMetricArchitecture: "Arquitectura",
    demoMetricReady: "Comandos listos",
    demoMetricScale: "Escala",
    demoMetricReadyValue: "3 flujos",
    demoMetricScaleValue: "Sin rehacer src",
    demoPanelTitle: "Ruta sugerida para arrancar hoy",
  },
  en: {
    badge: "Architecture ready",
    title: "Starter prepared to build something real",
    subtitle: "This project already ships with a clear structure, generation commands and enough room to grow without reorganizing everything on day one.",
    demoBadge: "Demo starter",
    demoTitle: "A starter that already feels like a product",
    demoSubtitle: "The demo starter shows the CLI value more clearly: structure, stack, guidance and a first screen with stronger visual intent.",
    architecture: "Architecture",
    stack: "Base stack",
    ui: "UI",
    nextStep: "Recommended next step",
    generators: "Generators",
    generatorsHint: "These commands create artifacts in the correct path for your selected architecture.",
    blueprint: "How to start with this architecture",
    architectureFallback: "Custom architecture for Next.js",
    uiWithShadcn: "Shadcn/ui is ready so you can add reusable components fast.",
    uiWithoutShadcn: "Plain Tailwind by default; you can add Shadcn/ui later if you need it.",
    starterCommand: "create-next-arch generate component HeroBanner",
    secondaryCommand: "create-next-arch g service User",
    simpleTitle: "Starter ready",
    simpleBody: "Start by editing src/app/page.tsx or generate your first artifact.",
    demoMetricArchitecture: "Architecture",
    demoMetricReady: "Ready commands",
    demoMetricScale: "Scalability",
    demoMetricReadyValue: "3 starter flows",
    demoMetricScaleValue: "No src rewrite later",
    demoPanelTitle: "Suggested path to start today",
  },
};

const buildArchitectureBlueprint = (architecture, lang) => {
  const copy = {
    es: {
      feature: [
        {
          label: "Módulos funcionales",
          title: "Agrupa UI, hooks y servicios por feature",
          detail: "Empieza creando una feature real como checkout, auth o dashboard y consume esa feature solo desde su Public API.",
        },
        {
          label: "Public API",
          title: "Centraliza las exportaciones en index.ts",
          detail: "Evita imports profundos entre módulos. Si otra zona del proyecto necesita algo de una feature, impórtalo desde @features/<slug>.",
        },
        {
          label: "Escalado",
          title: "Crece sin mezclar responsabilidades",
          detail: "Cuando una pantalla evoluciona, su complejidad sigue contenida dentro de la misma feature en lugar de dispersarse por todo src.",
        },
      ],
      layer: [
        {
          label: "Capas claras",
          title: "Componentes, hooks y servicios en rutas predecibles",
          detail: "Es la opción más simple para equipos pequeños o productos que aún están definiendo sus dominios de negocio.",
        },
        {
          label: "Flujo rápido",
          title: "UI en components, lógica en hooks, acceso remoto en services",
          detail: "El scaffold ya te deja esas rutas listas para que la primera iteración no derive en carpetas improvisadas.",
        },
        {
          label: "Refactor progresivo",
          title: "Puedes migrar a feature-based más adelante",
          detail: "Si detectas que un área como billing o auth crece demasiado, luego puedes encapsularla sin rehacer toda la base inicial.",
        },
      ],
      ddd: [
        {
          label: "Dominio",
          title: "Entidades y contratos primero",
          detail: "Usa domain para modelar reglas, invariantes y repositorios, manteniendo la lógica central aislada de React y de la infraestructura.",
        },
        {
          label: "Aplicación",
          title: "Casos de uso que orquestan el negocio",
          detail: "application es la capa donde conectas reglas de dominio con acciones concretas como crear pedidos, autenticar o consultar reportes. Tus services iniciales viven en src/application/common/use-cases.",
        },
        {
          label: "Infraestructura",
          title: "API, storage y persistencia quedan fuera del core",
          detail: "La UI consume casos de uso y la infraestructura implementa detalles técnicos, reduciendo acoplamiento en apps complejas.",
        },
      ],
    },
    en: {
      feature: [
        {
          label: "Functional modules",
          title: "Keep UI, hooks and services inside each feature",
          detail: "Start by creating a real feature such as checkout, auth or dashboard and consume it only through its Public API.",
        },
        {
          label: "Public API",
          title: "Centralize exports in index.ts",
          detail: "Avoid deep imports between modules. If another area needs something from a feature, import it from @features/<slug>.",
        },
        {
          label: "Scaling",
          title: "Grow without mixing responsibilities",
          detail: "When a screen becomes complex, the complexity stays inside the feature instead of spreading across the whole src tree.",
        },
      ],
      layer: [
        {
          label: "Clear layers",
          title: "Components, hooks and services in predictable places",
          detail: "This is the simplest option for small teams or products still discovering their business domains.",
        },
        {
          label: "Fast flow",
          title: "UI in components, logic in hooks, remote access in services",
          detail: "The scaffold already creates those paths so your first iteration does not drift into improvised folders.",
        },
        {
          label: "Progressive refactor",
          title: "You can migrate to feature-based later",
          detail: "If an area like billing or auth grows too much, you can encapsulate it later without reworking the whole starter.",
        },
      ],
      ddd: [
        {
          label: "Domain",
          title: "Entities and contracts first",
          detail: "Use domain to model rules, invariants and repositories while keeping the core isolated from React and infrastructure details.",
        },
        {
          label: "Application",
          title: "Use cases orchestrate business flows",
          detail: "application is where you connect domain rules with concrete actions such as placing orders, authenticating or loading reports. Starter services live in src/application/common/use-cases.",
        },
        {
          label: "Infrastructure",
          title: "API, storage and persistence stay outside the core",
          detail: "The UI consumes use cases and infrastructure implements technical details, which reduces coupling in complex apps.",
        },
      ],
    },
  };

  return (copy[lang] ?? copy.en)[architecture] ?? (copy[lang] ?? copy.en).layer;
};

const formatLibraries = (libs) => {
  if (!libs?.length) return "Next.js · Tailwind CSS";

  const labels = {
    "lucide-react": "Lucide React",
    "zod": "Zod",
    "@tanstack/react-query": "TanStack Query",
    "zustand": "Zustand",
    "shadcn": "Shadcn/ui",
  };

  return ["Next.js", "Tailwind CSS", ...libs.map((lib) => labels[lib] ?? lib)].join(" · ");
};

export async function cleanBoilerplateForTest(projectPath, projectNameOrOptions, darkModeArg = false) {
  const options = typeof projectNameOrOptions === "object"
    ? projectNameOrOptions
    : { projectName: projectNameOrOptions, darkMode: darkModeArg };

  const {
    projectName,
    darkMode = false,
    architecture,
    libs = [],
    lang = "en",
    starter = "guided",
  } = options;

  const copy = PAGE_I18N[lang] ?? PAGE_I18N.en;
  const architectureInfo = architecture ? ARCHITECTURES[architecture] : null;
  const librarySummary = formatLibraries(libs);
  const blueprint = buildArchitectureBlueprint(architecture, lang);
  const pageTemplate = starter === "simple"
    ? "page-simple.tsx"
    : starter === "demo"
      ? "page-demo.tsx"
      : "page.tsx";

  await fs.writeFile(
    path.join(projectPath, "src/app/page.tsx"),
    await readTemplate(pageTemplate, {
      PROJECT_NAME: projectName,
      PAGE_BADGE: copy.badge,
      PAGE_TITLE: copy.title,
      PAGE_SUBTITLE: copy.subtitle,
      PAGE_ARCH_LABEL: copy.architecture,
      PAGE_STACK_LABEL: copy.stack,
      PAGE_UI_LABEL: copy.ui,
      PAGE_NEXT_STEP_LABEL: copy.nextStep,
      PAGE_GENERATORS_LABEL: copy.generators,
      PAGE_GENERATORS_HINT: copy.generatorsHint,
      ARCHITECTURE_NAME: architectureInfo?.label ?? copy.architectureFallback,
      ARCHITECTURE_SUMMARY: architectureInfo?.[`description_${lang}`] ?? architectureInfo?.description_en ?? copy.architectureFallback,
      LIBRARIES_SUMMARY: librarySummary,
      UI_SUMMARY: libs.includes("shadcn") ? copy.uiWithShadcn : copy.uiWithoutShadcn,
      STARTER_COMMAND: copy.starterCommand,
      SECONDARY_COMMAND: architecture === "feature" ? "create-next-arch g feature Checkout" : copy.secondaryCommand,
      PAGE_BLUEPRINT_LABEL: copy.blueprint,
      PAGE_DEMO_BADGE: copy.demoBadge,
      PAGE_DEMO_TITLE: copy.demoTitle,
      PAGE_DEMO_SUBTITLE: copy.demoSubtitle,
      PAGE_SIMPLE_TITLE: copy.simpleTitle,
      PAGE_SIMPLE_BODY: copy.simpleBody,
      PAGE_DEMO_METRIC_ARCH_LABEL: copy.demoMetricArchitecture,
      PAGE_DEMO_METRIC_READY_LABEL: copy.demoMetricReady,
      PAGE_DEMO_METRIC_SCALE_LABEL: copy.demoMetricScale,
      PAGE_DEMO_METRIC_READY_VALUE: copy.demoMetricReadyValue,
      PAGE_DEMO_METRIC_SCALE_VALUE: copy.demoMetricScaleValue,
      PAGE_DEMO_PANEL_TITLE: copy.demoPanelTitle,
      BLUEPRINT_ONE_LABEL: blueprint[0].label,
      BLUEPRINT_ONE_TITLE: blueprint[0].title,
      BLUEPRINT_ONE_DETAIL: blueprint[0].detail,
      BLUEPRINT_TWO_LABEL: blueprint[1].label,
      BLUEPRINT_TWO_TITLE: blueprint[1].title,
      BLUEPRINT_TWO_DETAIL: blueprint[1].detail,
      BLUEPRINT_THREE_LABEL: blueprint[2].label,
      BLUEPRINT_THREE_TITLE: blueprint[2].title,
      BLUEPRINT_THREE_DETAIL: blueprint[2].detail,
    })
  );

  const cssTemplate = darkMode ? "globals-dark.css" : "globals.css";
  await fs.writeFile(
    path.join(projectPath, "src/app/globals.css"),
    await readTemplate(cssTemplate)
  );

  if (darkMode) {
    await fs.writeFile(
      path.join(projectPath, "src/app/layout.tsx"),
      await readTemplate("layout-dark.tsx", { PROJECT_NAME: projectName })
    );

    const uiDir = path.join(projectPath, "src/shared/components/ui");
    await fs.ensureDir(uiDir);
    await fs.writeFile(
      path.join(uiDir, "ThemeProvider.tsx"),
      await readTemplate("ThemeProvider.tsx")
    );
  }
}