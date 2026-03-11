export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Tipos permitidos
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build", "revert"],
    ],
    // Título máximo 72 chars
    "header-max-length": [2, "always", 72],
    // No uppercase en el tipo
    "type-case": [2, "always", "lower-case"],
    // No terminar con punto
    "header-full-stop": [2, "never", "."],
  },
};
