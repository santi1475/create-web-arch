/**
 * dep-resolver.js — Intelligent dependency checker
 *
 * For each generate type, defines which packages are recommended.
 * Called before generating to detect gaps and offer to install them.
 */

/** What packages are recommended per artifact type */
const TYPE_DEPS = {
  service: {
    recommended: ["@tanstack/react-query"],
    reason_es: "TanStack Query es recomendado para servicios de data fetching",
    reason_en: "TanStack Query is recommended for data fetching services",
  },
  hook: {
    recommended: [],
  },
  component: {
    recommended: [],
  },
  feature: {
    recommended: [],
  },
};

/**
 * Returns a list of recommended packages that are NOT installed.
 * @param {string} type - artifact type (service, hook, component, feature)
 * @param {object} pkg  - parsed package.json object
 * @returns {string[]}  - array of missing package names
 */
export function checkMissingDeps(type, pkg) {
  const typeDef = TYPE_DEPS[type];
  if (!typeDef?.recommended?.length) return [];

  const installed = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  return typeDef.recommended.filter((dep) => !installed[dep]);
}

/**
 * Returns the human-readable reason for a type's recommended deps.
 * @param {string} type
 * @param {string} lang - "es" | "en"
 */
export function getDepReason(type, lang = "es") {
  const typeDef = TYPE_DEPS[type];
  return typeDef?.[`reason_${lang}`] ?? "";
}
