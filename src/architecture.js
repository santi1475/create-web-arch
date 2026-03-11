import fs from "fs-extra";
import path from "path";

export const ARCH_ALIASES = {
  feature: {
    "@features/*": ["./src/features/*"],
    "@shared/*":   ["./src/shared/*"],
    "@ui/*":       ["./src/shared/components/ui/*"],
    "@hooks/*":    ["./src/shared/hooks/*"],
    "@utils/*":    ["./src/shared/utils/*"],
    "@types/*":    ["./src/shared/types/*"],
  },
  layer: {
    "@components/*": ["./src/components/*"],
    "@ui/*":         ["./src/components/ui/*"],
    "@hooks/*":      ["./src/hooks/*"],
    "@services/*":   ["./src/services/*"],
    "@store/*":      ["./src/store/*"],
    "@utils/*":      ["./src/utils/*"],
    "@types/*":      ["./src/types/*"],
  },
  ddd: {
    "@domain/*":         ["./src/domain/*"],
    "@application/*":    ["./src/application/*"],
    "@infrastructure/*": ["./src/infrastructure/*"],
    "@presentation/*":   ["./src/presentation/*"],
    "@shared/*":         ["./src/shared/*"],
  },
};

export const ARCHITECTURES = {
  feature: {
    label: "Feature-based",
    description_es: "Agrupa el código por módulo/feature (auth, dashboard…)",
    description_en: "Groups code by module/feature (auth, dashboard…)",
    tree: `src/
├── app/
├── features/
│   ├── auth/        (components, hooks, services, types)
│   └── dashboard/   (components, hooks, services)
└── shared/
    ├── components/  (ui, layout)
    ├── hooks/
    ├── lib/
    ├── types/
    └── utils/`,
    folders: [
      "src/app",
      "src/features/auth/components", "src/features/auth/hooks",
      "src/features/auth/services",   "src/features/auth/types",
      "src/features/dashboard/components", "src/features/dashboard/hooks",
      "src/features/dashboard/services",
      "src/shared/components/ui", "src/shared/components/layout",
      "src/shared/hooks", "src/shared/lib", "src/shared/types", "src/shared/utils",
      "public/assets",
    ],
  },
  layer: {
    label: "Layer-based",
    description_es: "Agrupa el código por capa técnica (components, hooks, services…)",
    description_en: "Groups code by technical layer (components, hooks, services…)",
    tree: `src/
├── app/
├── components/  (ui, layout, forms)
├── hooks/
├── services/
├── store/
├── types/
├── utils/
├── constants/
└── styles/`,
    folders: [
      "src/app", "src/components/ui", "src/components/layout", "src/components/forms",
      "src/hooks", "src/services", "src/store", "src/types",
      "src/utils", "src/constants", "src/styles",
      "public/assets",
    ],
  },
  ddd: {
    label: "Domain-Driven (DDD lite)",
    description_es: "Separa dominio, aplicación e infraestructura (apps complejas)",
    description_en: "Separates domain, application and infrastructure (complex apps)",
    tree: `src/
├── app/
├── domain/          (entities, repositories, value-objects)
├── application/     (use-cases)
├── infrastructure/  (api, storage, db)
├── presentation/    (components, hooks)
└── shared/`,
    folders: [
      "src/app",
      "src/domain/user/entities", "src/domain/user/repositories", "src/domain/user/value-objects",
      "src/domain/product/entities", "src/domain/product/repositories",
      "src/application/user/use-cases", "src/application/product/use-cases",
      "src/infrastructure/api", "src/infrastructure/storage", "src/infrastructure/db",
      "src/presentation/components", "src/presentation/hooks",
      "src/shared/types", "src/shared/utils",
      "public/assets",
    ],
  },
};

export async function injectArchitectureForTest(projectPath, architecture) {
  for (const folder of ARCHITECTURES[architecture].folders) {
    await fs.ensureDir(path.join(projectPath, folder));
    const contents = await fs.readdir(path.join(projectPath, folder));
    if (contents.length === 0) {
      await fs.writeFile(path.join(projectPath, folder, ".gitkeep"), "");
    }
  }
}

export async function patchTsConfigForTest(projectPath, architecture) {
  const tsp = path.join(projectPath, "tsconfig.json");
  const ts  = await fs.readJson(tsp);
  ts.compilerOptions = ts.compilerOptions ?? {};
  ts.compilerOptions.paths = {
    "@/*": ["./src/*"],
    ...ARCH_ALIASES[architecture],
  };
  await fs.writeJson(tsp, ts, { spaces: 2 });
}
