import { execSync } from "child_process";

/**
 * Detects the fastest package manager available on the system.
 * Priority: bun > pnpm > yarn > npm.
 * @returns {string} - "bun" | "pnpm" | "yarn" | "npm"
 */
export function determineFastestPackageManager() {
  const managers = [
    { cmd: "bun --version", name: "bun" },
    { cmd: "pnpm --version", name: "pnpm" },
    { cmd: "yarn --version", name: "yarn" }
  ];

  for (const manager of managers) {
    try {
      execSync(manager.cmd, { stdio: "ignore" });
      return manager.name;
    } catch {
      // Ignore error and try the next one
    }
  }
  return "npm";
}
