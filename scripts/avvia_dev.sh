#!/usr/bin/env bash
set -euo pipefail
PORT="${1:-3000}"

# Se è Vite, l'opzione --host/--port esiste (utile per accesso da strumenti interni). :contentReference[oaicite:2]{index=2}
if jq -e '.devDependencies.vite or .dependencies.vite' package.json >/dev/null 2>&1; then
  echo "Avvio (Vite) su porta ${PORT}..."
  npm run dev -- --host 127.0.0.1 --port "${PORT}"
else
  echo "Avvio generico: npm run dev"
  npm run dev
fi
