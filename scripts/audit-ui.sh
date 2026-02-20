#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://127.0.0.1:3000/}"
OUTDIR="audit/out/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTDIR"

# Controllo raggiungibilita'
if ! curl -fsS -I "$URL" >/dev/null 2>&1; then
  echo "ERRORE: URL non raggiungibile da WSL: $URL"
  echo "Soluzioni tipiche:"
  echo "1) avviare il server dentro WSL (non in PowerShell Windows)"
  echo "2) usare scripts/avvia_dev.sh 3000"
  echo "3) verificare ascolto porta: ss -ltnp | grep :3000"
  exit 1
fi

# Assicura Playwright pronto
if ! npx playwright --version >/dev/null 2>&1; then
  echo "Playwright non pronto. Eseguo installazione..."
  "$(dirname "$0")/install_playwright.sh"
fi

node audit/audit-ui.mjs "$URL" "$OUTDIR"
echo "FATTO: rapporto in $OUTDIR"
