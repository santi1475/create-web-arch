const SHADCN_ALIASES = {
  feature: {
    components: "@/shared/components",
    utils:      "@/shared/utils/cn",
    hooks:      "@/shared/hooks",
    lib:        "@/shared/lib",
    ui:         "@/shared/components/ui",
  },
  layer: {
    components: "@/components",
    utils:      "@/utils/cn",
    hooks:      "@/hooks",
    lib:        "@/utils",
    ui:         "@/components/ui",
  },
  ddd: {
    components: "@/presentation/components",
    utils:      "@/shared/utils/cn",
    hooks:      "@/presentation/hooks",
    lib:        "@/shared/lib",
    ui:         "@/presentation/components",
  },
};

/**
 * Build a shadcn components.json config object for a given architecture.
 * @param {string} architecture - "feature" | "layer" | "ddd"
 * @returns {object}
 */
export function buildShadcnConfig(architecture) {
  const aliases = SHADCN_ALIASES[architecture];

  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "default",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: "src/app/globals.css",
      baseColor: "slate",
      cssVariables: true,
      prefix: "",
    },
    aliases,
    iconLibrary: "lucide",
  };
}
