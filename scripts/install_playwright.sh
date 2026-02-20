#!/usr/bin/env bash
set -euo pipefail
if ! jq -e '.devDependencies.playwright or .dependencies.playwright' package.json >/dev/null 2>&1; then
  echo "Installo Playwright nel progetto..."
  npm i -D playwright
fi
echo "Installo browser Playwright + dipendenze..."
npx playwright install --with-deps
