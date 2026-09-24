#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

[ -f .env ] || cp .env.example .env

uid="$(grep -E '^UID=' .env | cut -d= -f2 || true)"
gid="$(grep -E '^GID=' .env | cut -d= -f2 || true)"
uid="${uid:-1000}"
gid="${gid:-1000}"

mkdir -p config downloads/fetchmedia downloads/tmp

if [ "$(id -u)" -eq 0 ]; then
  chown -R "${uid}:${gid}" config downloads
fi

echo "Done. Check .env and run: docker compose up -d --build"