
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CLI = path.resolve(__dirname, "../src/index.js");
const TEMPLATES = path.resolve(__dirname, "../templates");

/** Creates a fake already-bootstrapped Next.js project (avoids npx create-next-app) */
async function scaffoldFakeNextProject(dir: string, architecture: string, lang = "es") {
  await fs.ensureDir(dir);

  // Minimal package.json (simulates what create-next-app produces)
  await fs.writeJson(path.join(dir, "package.json"), {
    name: path.basename(dir),
    version: "0.1.0",
    private: true,
    scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
    dependencies: { next: "15.0.0", react: "18.0.0", "react-dom": "18.0.0" },
    devDependencies: { typescript: "5.0.0" },
  }, { spaces: 2 });

  // Minimal tsconfig.json
  await fs.writeJson(path.join(dir, "tsconfig.json"), {
    compilerOptions: { target: "es5", paths: { "@/*": ["./src/*"] } },
  }, { spaces: 2 });

  // Boilerplate files that cleanBoilerplate would overwrite
  await fs.ensureDir(path.join(dir, "src/app"));
  await fs.writeFile(path.join(dir, "src/app/page.tsx"), "// boilerplate");
  await fs.writeFile(path.join(dir, "src/app/globals.css"), "/* boilerplate */");
  await fs.writeFile(path.join(dir, "src/app/layout.tsx"), "// boilerplate layout");

  // .next-arch.json (simulates what injectConfigFiles writes)
  await fs.writeJson(path.join(dir, ".next-arch.json"), {
    architecture, lang, packageManager: "npm", version: "5.0.0",
  }, { spaces: 2 });
}

/** Run a CLI command non-interactively by injecting .next-arch.json */
function runCLI(args: string[], cwd: string) {
  return spawnSync("node", [CLI, ...args], {
    cwd, shell: false, encoding: "utf-8",
    env: { ...process.env, FORCE_COLOR: "0" },
  });
}

// ─── Test fixtures ────────────────────────────────────────────────────────────

let tmpRoot: string;

beforeAll(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "cna-test-"));
});

afterAll(async () => {
  await fs.remove(tmpRoot);
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1 — Template files exist
// ─────────────────────────────────────────────────────────────────────────────

describe("Templates integrity", () => {
  const required = [
    "gitignore.txt",
    "CONTRIBUTING.es.md",
    "CONTRIBUTING.en.md",
    "README.md",
    "globals.css",
    "globals-dark.css",
    "page.tsx",
    "page-simple.tsx",
    "page-demo.tsx",
    "layout-dark.tsx",
    "ThemeProvider.tsx",
    "ReactQueryProvider.tsx",
    "components.json",
    "ci.yml",
    "commitlint.config.js",
    "eslintrc.json",
    "prettierrc.json",
    "env.example",
    "generate/component.tsx",
    "generate/component-client.tsx",
    "generate/component.test.tsx",
    "generate/hook.ts",
    "generate/service.ts",
    "generate/base-service.ts",
    "generate/feature-index.ts",
  ];

  for (const file of required) {
    it(`templates/${file} exists`, async () => {
      expect(await fs.pathExists(path.join(TEMPLATES, file))).toBe(true);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2 — Architecture folder generation
// ─────────────────────────────────────────────────────────────────────────────

describe("Architecture: feature-based", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-feature");
    await scaffoldFakeNextProject(projectDir, "feature", "es");

    // Manually run the folder injection logic
    const { injectArchitectureForTest } = await import("../src/architecture.js");
    await injectArchitectureForTest(projectDir, "feature");
  });

  it("creates src/features/auth/components", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/features/auth/components"))).toBe(true);
  });
  it("creates src/shared/components/ui", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/shared/components/ui"))).toBe(true);
  });
  it("creates src/features/dashboard/services", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/features/dashboard/services"))).toBe(true);
  });
});

describe("Architecture: layer-based", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-layer");
    await scaffoldFakeNextProject(projectDir, "layer");
    const { injectArchitectureForTest } = await import("../src/architecture.js");
    await injectArchitectureForTest(projectDir, "layer");
  });

  it("creates src/components/ui", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/components/ui"))).toBe(true);
  });
  it("creates src/hooks", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/hooks"))).toBe(true);
  });
  it("creates src/services", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/services"))).toBe(true);
  });
});

describe("Architecture: ddd", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-ddd");
    await scaffoldFakeNextProject(projectDir, "ddd");
    const { injectArchitectureForTest } = await import("../src/architecture.js");
    await injectArchitectureForTest(projectDir, "ddd");
  });

  it("creates src/domain/user/entities", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/domain/user/entities"))).toBe(true);
  });
  it("creates src/infrastructure/db", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/infrastructure/db"))).toBe(true);
  });
  it("creates src/application/user/use-cases", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/application/user/use-cases"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — tsconfig patching
// ─────────────────────────────────────────────────────────────────────────────

describe("tsconfig aliases patching", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-tsconfig");
    await scaffoldFakeNextProject(projectDir, "ddd");
    const { patchTsConfigForTest } = await import("../src/architecture.js");
    await patchTsConfigForTest(projectDir, "ddd");
  });

  it("preserves the base @/* alias", async () => {
    const ts = await fs.readJson(path.join(projectDir, "tsconfig.json"));
    expect(ts.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
  });

  it("adds @domain/* alias", async () => {
    const ts = await fs.readJson(path.join(projectDir, "tsconfig.json"));
    expect(ts.compilerOptions.paths["@domain/*"]).toEqual(["./src/domain/*"]);
  });

  it("adds @application/* alias", async () => {
    const ts = await fs.readJson(path.join(projectDir, "tsconfig.json"));
    expect(ts.compilerOptions.paths["@application/*"]).toEqual(["./src/application/*"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4 — generate command
// ─────────────────────────────────────────────────────────────────────────────

describe("generate component (feature-based, EN)", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-gen-component");
    await scaffoldFakeNextProject(projectDir, "feature", "en");
    runCLI(["g", "component", "MyButton"], projectDir);
  });

  it("creates MyButton.tsx in the correct path", async () => {
    const f = path.join(projectDir, "src/features/common/components/MyButton.tsx");
    expect(await fs.pathExists(f)).toBe(true);
  });

  it("generated component uses correct name", async () => {
    const f = path.join(projectDir, "src/features/common/components/MyButton.tsx");
    const content = await fs.readFile(f, "utf-8");
    expect(content).toContain("MyButton");
  });
});

describe("generate hook (layer-based)", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-gen-hook");
    await scaffoldFakeNextProject(projectDir, "layer", "en");
    runCLI(["g", "hook", "Auth"], projectDir);
  });

  it("creates useAuth.ts in src/hooks", async () => {
    const f = path.join(projectDir, "src/hooks/useAuth.ts");
    expect(await fs.pathExists(f)).toBe(true);
  });

  it("hook file contains useAuth function", async () => {
    const content = await fs.readFile(path.join(projectDir, "src/hooks/useAuth.ts"), "utf-8");
    expect(content).toContain("useAuth");
  });
});

describe("generate service (ddd)", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-gen-service");
    await scaffoldFakeNextProject(projectDir, "ddd", "en");
    runCLI(["g", "service", "Payment"], projectDir);
  });

  it("creates PaymentService.ts in correct DDD path", async () => {
    const f = path.join(projectDir, "src/application/common/use-cases/PaymentService.ts");
    expect(await fs.pathExists(f)).toBe(true);
  });
});

describe("generate feature (feature-based)", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-gen-feature");
    await scaffoldFakeNextProject(projectDir, "feature", "en");
    runCLI(["g", "feature", "Checkout"], projectDir);
  });

  it("creates feature folder structure", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/features/checkout/components"))).toBe(true);
    expect(await fs.pathExists(path.join(projectDir, "src/features/checkout/hooks"))).toBe(true);
    expect(await fs.pathExists(path.join(projectDir, "src/features/checkout/services"))).toBe(true);
    expect(await fs.pathExists(path.join(projectDir, "src/features/checkout/types"))).toBe(true);
  });

  it("creates public API index.ts", async () => {
    const f = path.join(projectDir, "src/features/checkout/index.ts");
    expect(await fs.pathExists(f)).toBe(true);
  });

  it("public API mentions feature name", async () => {
    const content = await fs.readFile(
      path.join(projectDir, "src/features/checkout/index.ts"), "utf-8"
    );
    expect(content).toContain("Checkout");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5 — Config files
// ─────────────────────────────────────────────────────────────────────────────

describe("Config file generation", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-config");
    await scaffoldFakeNextProject(projectDir, "feature");
    const { injectConfigFilesForTest } = await import("../src/config-files.js");
    await injectConfigFilesForTest(projectDir, {
      extras: ["lint", "commitlint", "ghactions", "envexample"],
      projectName: "proj-config",
      architecture: "feature",
      packageManager: "npm",
      lang: "es",
      darkMode: false,
      starter: "guided",
    });
  });

  it("creates .gitignore",         async () => expect(await fs.pathExists(path.join(projectDir, ".gitignore"))).toBe(true));
  it("creates CONTRIBUTING.md",    async () => expect(await fs.pathExists(path.join(projectDir, "CONTRIBUTING.md"))).toBe(true));
  it("creates README.md",          async () => expect(await fs.pathExists(path.join(projectDir, "README.md"))).toBe(true));
  it("creates .eslintrc.json",     async () => expect(await fs.pathExists(path.join(projectDir, ".eslintrc.json"))).toBe(true));
  it("creates .prettierrc",        async () => expect(await fs.pathExists(path.join(projectDir, ".prettierrc"))).toBe(true));
  it("creates commitlint.config",  async () => expect(await fs.pathExists(path.join(projectDir, "commitlint.config.js"))).toBe(true));
  it("creates .husky/commit-msg",  async () => expect(await fs.pathExists(path.join(projectDir, ".husky/commit-msg"))).toBe(true));
  it("creates .github/workflows",  async () => expect(await fs.pathExists(path.join(projectDir, ".github/workflows/ci.yml"))).toBe(true));
  it("creates .env.example",       async () => expect(await fs.pathExists(path.join(projectDir, ".env.example"))).toBe(true));
  it("creates .next-arch.json",    async () => expect(await fs.pathExists(path.join(projectDir, ".next-arch.json"))).toBe(true));

  it("README contains project name", async () => {
    const content = await fs.readFile(path.join(projectDir, "README.md"), "utf-8");
    expect(content).toContain("proj-config");
  });

  it("README contains starter mode", async () => {
    const content = await fs.readFile(path.join(projectDir, "README.md"), "utf-8");
    expect(content).toContain("Modo de home elegido: **guided**");
  });

  it(".next-arch.json has correct architecture", async () => {
    const config = await fs.readJson(path.join(projectDir, ".next-arch.json"));
    expect(config.architecture).toBe("feature");
  });

  it(".next-arch.json stores starter mode", async () => {
    const config = await fs.readJson(path.join(projectDir, ".next-arch.json"));
    expect(config.starter).toBe("guided");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 6 — Dark mode
// ─────────────────────────────────────────────────────────────────────────────

describe("Dark mode injection", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-dark");
    await scaffoldFakeNextProject(projectDir, "feature");
    const { cleanBoilerplateForTest } = await import("../src/boilerplate.js");
    await cleanBoilerplateForTest(projectDir, "proj-dark", true);
  });

  it("globals.css contains CSS variables", async () => {
    const css = await fs.readFile(path.join(projectDir, "src/app/globals.css"), "utf-8");
    expect(css).toContain("--background");
    expect(css).toContain(".dark");
  });

  it("layout.tsx includes ThemeProvider", async () => {
    const layout = await fs.readFile(path.join(projectDir, "src/app/layout.tsx"), "utf-8");
    expect(layout).toContain("ThemeProvider");
  });

  it("ThemeProvider.tsx is created", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/shared/components/ui/ThemeProvider.tsx"))).toBe(true);
  });
});

describe("Starter page enrichment", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = path.join(tmpRoot, "proj-starter-page");
    await scaffoldFakeNextProject(projectDir, "layer", "es");
    const { cleanBoilerplateForTest } = await import("../src/boilerplate.js");
    await cleanBoilerplateForTest(projectDir, {
      projectName: "proj-starter-page",
      architecture: "layer",
      libs: ["lucide-react", "shadcn"],
      lang: "es",
      darkMode: false,
      starter: "guided",
    });
  });

  it("page.tsx shows architecture metadata", async () => {
    const page = await fs.readFile(path.join(projectDir, "src/app/page.tsx"), "utf-8");
    expect(page).toContain("Layer-based");
    expect(page).toContain("Shadcn/ui");
    expect(page).toContain("create-next-arch generate component HeroBanner");
    expect(page).toContain("UI en components, lógica en hooks, acceso remoto en services");
  });
});

describe("Starter page per architecture", () => {
  it("feature-based highlights Public API usage", async () => {
    const projectDir = path.join(tmpRoot, "proj-starter-feature");
    await scaffoldFakeNextProject(projectDir, "feature", "en");
    const { cleanBoilerplateForTest } = await import("../src/boilerplate.js");
    await cleanBoilerplateForTest(projectDir, {
      projectName: "proj-starter-feature",
      architecture: "feature",
      libs: ["zod"],
      lang: "en",
      darkMode: false,
      starter: "guided",
    });

    const page = await fs.readFile(path.join(projectDir, "src/app/page.tsx"), "utf-8");
    expect(page).toContain("Public API");
    expect(page).toContain("@features/<slug>");
    expect(page).toContain("create-next-arch g feature Checkout");
  });

  it("ddd highlights use cases and infrastructure separation", async () => {
    const projectDir = path.join(tmpRoot, "proj-starter-ddd");
    await scaffoldFakeNextProject(projectDir, "ddd", "en");
    const { cleanBoilerplateForTest } = await import("../src/boilerplate.js");
    await cleanBoilerplateForTest(projectDir, {
      projectName: "proj-starter-ddd",
      architecture: "ddd",
      libs: ["@tanstack/react-query"],
      lang: "en",
      darkMode: false,
      starter: "guided",
    });

    const page = await fs.readFile(path.join(projectDir, "src/app/page.tsx"), "utf-8");
    expect(page).toContain("Use cases orchestrate business flows");
    expect(page).toContain("API, storage and persistence stay outside the core");
    expect(page).toContain("src/application/common/use-cases");
  });
});

describe("Simple starter mode", () => {
  it("writes a minimal page when starter is simple", async () => {
    const projectDir = path.join(tmpRoot, "proj-starter-simple");
    await scaffoldFakeNextProject(projectDir, "layer", "en");
    const { cleanBoilerplateForTest } = await import("../src/boilerplate.js");
    await cleanBoilerplateForTest(projectDir, {
      projectName: "proj-starter-simple",
      architecture: "layer",
      libs: ["lucide-react"],
      lang: "en",
      darkMode: false,
      starter: "simple",
    });

    const page = await fs.readFile(path.join(projectDir, "src/app/page.tsx"), "utf-8");
    expect(page).toContain("proj-starter-simple");
    expect(page).toContain("Start by editing src/app/page.tsx or generate your first artifact.");
    expect(page).not.toContain("How to start with this architecture");
  });
});

describe("Demo starter mode", () => {
  it("writes a richer landing page when starter is demo", async () => {
    const projectDir = path.join(tmpRoot, "proj-starter-demo");
    await scaffoldFakeNextProject(projectDir, "feature", "en");
    const { cleanBoilerplateForTest } = await import("../src/boilerplate.js");
    await cleanBoilerplateForTest(projectDir, {
      projectName: "proj-starter-demo",
      architecture: "feature",
      libs: ["zod", "shadcn"],
      lang: "en",
      darkMode: false,
      starter: "demo",
    });

    const page = await fs.readFile(path.join(projectDir, "src/app/page.tsx"), "utf-8");
    expect(page).toContain("A starter that already feels like a product");
    expect(page).toContain("Ready commands");
    expect(page).toContain("How to start with this architecture");
    expect(page).toContain("create-next-arch g feature Checkout");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 7 — Dependency resolver
// ─────────────────────────────────────────────────────────────────────────────

describe("Dependency resolver", () => {
  it("detects missing TanStack Query when generating service", async () => {
    const { checkMissingDeps } = await import("../src/dep-resolver.js");
    const fakePkg = { dependencies: {}, devDependencies: {} };
    const missing = checkMissingDeps("service", fakePkg);
    expect(missing).toContain("@tanstack/react-query");
  });

  it("does not flag TanStack Query if already installed", async () => {
    const { checkMissingDeps } = await import("../src/dep-resolver.js");
    const fakePkg = { dependencies: { "@tanstack/react-query": "^5.0.0" }, devDependencies: {} };
    const missing = checkMissingDeps("service", fakePkg);
    expect(missing).not.toContain("@tanstack/react-query");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 8 — Shadcn components.json
// ─────────────────────────────────────────────────────────────────────────────

describe("Shadcn components.json", () => {
  it("feature-based uses @/shared/components/ui alias for UI components", async () => {
    const { buildShadcnConfig } = await import("../src/shadcn.js");
    const config = buildShadcnConfig("feature");
    expect(config.aliases.ui).toBe("@/shared/components/ui");
  });

  it("ddd uses @/presentation/components alias for components", async () => {
    const { buildShadcnConfig } = await import("../src/shadcn.js");
    const config = buildShadcnConfig("ddd");
    expect(config.aliases.components).toBe("@/presentation/components");
  });
});
