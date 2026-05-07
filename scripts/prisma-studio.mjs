import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const proxyKeys = new Set([
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
].map((key) => key.toLowerCase()));

const env = {};
const seenKeys = new Set();

for (const [key, value] of Object.entries(process.env)) {
  const normalizedKey = process.platform === "win32" ? key.toUpperCase() : key;

  if (
    key.startsWith("=") ||
    proxyKeys.has(key.toLowerCase()) ||
    seenKeys.has(normalizedKey)
  ) {
    continue;
  }

  seenKeys.add(normalizedKey);
  env[key] = value;
}

const prismaCli = fileURLToPath(
  new URL("../node_modules/prisma/build/index.js", import.meta.url),
);

const studio = spawn(process.execPath, [prismaCli, "studio", ...process.argv.slice(2)], {
  env,
  stdio: "inherit",
});

studio.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
