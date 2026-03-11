#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";

console.log("=== PATH DEBUG ===");
console.log("import.meta.url:    ", import.meta.url);
console.log("new URL('.'):       ", new URL(".", import.meta.url).href);
console.log("fileURLToPath:      ", fileURLToPath(new URL(".", import.meta.url)));
console.log("TEMPLATES resolves to:", path.join(fileURLToPath(new URL(".", import.meta.url)), "../templates"));