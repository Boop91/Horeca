#!/usr/bin/env bash
set -euo pipefail

echo "== Stato progetto =="
git status --porcelain || true

echo "== Installazione dipendenze (se serve) =="
npm ci || npm install

if jq -e '.scripts.lint' package.json >/dev/null 2>&1; then
  echo "== Lint =="
  npm run lint
fi

if jq -e '.scripts.test' package.json >/dev/null 2>&1; then
  echo "== Test =="
  npm test
fi

if jq -e '.scripts.build' package.json >/dev/null 2>&1; then
  echo "== Build =="
  npm run build
fi

echo "== Fine verifiche =="
