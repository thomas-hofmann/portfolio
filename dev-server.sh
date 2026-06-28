#!/usr/bin/env sh
set -eu

PORT="${1:-8000}"
HOST="127.0.0.1"
PROJECT_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

if ! command -v php >/dev/null 2>&1; then
  echo "PHP wurde nicht gefunden. Installiere PHP oder fuege es zum PATH hinzu." >&2
  exit 1
fi

echo "Starte lokalen PHP-Server..."
echo "Projekt: $PROJECT_ROOT"
echo "URL:     http://$HOST:$PORT/"
echo "Stoppen mit Ctrl+C"
echo

cd "$PROJECT_ROOT"
exec php -S "$HOST:$PORT"
