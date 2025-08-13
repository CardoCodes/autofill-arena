#!/usr/bin/env bash
set -Eeuo pipefail

# -------------------------------------------------------------
# Firefox launch helper for local development
# - Starts the backend API
# - Ensures dependencies are installed (with Windows/Node guards)
# - Builds the Firefox extension bundle
# - Launches Firefox via web-ext with the built add-on
#
# Environment flags:
# - FORCE_CLEAN_INSTALL=1     Remove node_modules before installing (backend and extension)
# - SKIP_BACKEND_INSTALL=1    Do not install backend deps (use existing node_modules)
# - SKIP_EXTENSION_INSTALL=1  Do not install extension deps (use existing node_modules)
# - FIREFOX_BIN=...</path>    Use a specific Firefox executable (useful on Windows Git Bash)
# -------------------------------------------------------------

# Optional: set FIREFOX_BIN to a specific Firefox path (e.g., on Windows Git Bash)
# export FIREFOX_BIN="/c/Program Files/Mozilla Firefox/firefox.exe"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure backend gets stopped when this script exits

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && ps -p "$BACKEND_PID" >/dev/null 2>&1; then
    echo "Stopping backend (PID $BACKEND_PID)..."
    kill "$BACKEND_PID" || true
  fi
}
trap cleanup EXIT

echo "==> Starting backend..."
cd "$ROOT/backend"
# Optional clean install for backend
if [[ "${FORCE_CLEAN_INSTALL:-0}" -eq 1 ]]; then
  echo "FORCE_CLEAN_INSTALL=1 set: removing existing node_modules..."
  rm -rf node_modules
fi

# Install backend dependencies with Windows/Node guard
if [[ "${SKIP_BACKEND_INSTALL:-0}" -ne 1 ]]; then
  install_backend_deps() {
    echo "Installing backend deps..."
    if [[ "${OS:-}" == "Windows_NT" ]]; then
      NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
      if [[ "$NODE_MAJOR" =~ ^[0-9]+$ ]] && (( NODE_MAJOR >= 22 )); then
        echo "Error: Detected Node $NODE_MAJOR on Windows. No prebuilt binaries exist for 'better-sqlite3' on Node $NODE_MAJOR yet."
        echo "Please switch to Node 20 LTS (recommended) or install VS Build Tools + Windows SDK to build from source, then re-run."
        return 1
      fi
    fi
    if [[ -f package-lock.json ]]; then
      npm ci
    else
      npm install
    fi
  }
  if [[ ! -d node_modules ]]; then
    install_backend_deps || {
      echo "Backend dependency installation failed."
      if [[ "${OS:-}" == "Windows_NT" ]]; then
        echo "Fix options:"
        echo "  - Install Node 20 LTS and re-run (preferred); or"
        echo "  - Install Visual Studio Build Tools (Desktop C++ workload) and Windows 10/11 SDK, then re-run."
        echo "To skip install on subsequent runs, set SKIP_BACKEND_INSTALL=1."
      fi
      exit 1
    }
  fi
fi

# Verify native dependency loads for current Node runtime
# - 'better-sqlite3' must be loadable; if not, provide next steps
if ! node -e "require('better-sqlite3')" >/dev/null 2>&1; then
  echo "Native module 'better-sqlite3' failed to load for your current Node runtime."
  if [[ "${OS:-}" == "Windows_NT" ]]; then
    echo "If you recently switched Node versions, run with FORCE_CLEAN_INSTALL=1 to reinstall, e.g.:"
    echo "  FORCE_CLEAN_INSTALL=1 ./firefox_launch.sh"
    echo "Or switch to Node 20 LTS and re-run."
  fi
  exit 1
fi
# Uncomment to seed DB on first run
# npm run init

# Start backend (watch mode)
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "==> Waiting for backend to be ready at http://localhost:5123/health ..."
READY=0
for i in {1..60}; do
  if curl -sf "http://localhost:5123/health" >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 1
done
if [[ "$READY" -ne 1 ]]; then
  echo "Backend did not become ready in time."
  exit 1
fi
echo "Backend is ready."

echo "==> Building Firefox extension..."
cd "$ROOT/extension"
# Optional clean install for extension
if [[ "${FORCE_CLEAN_INSTALL:-0}" -eq 1 ]]; then
  rm -rf node_modules
fi
# Install extension deps (respecting legacy peer deps)
if [[ "${SKIP_EXTENSION_INSTALL:-0}" -ne 1 ]]; then
  if [[ ! -d node_modules ]]; then
    echo "Installing extension deps..."
    if [[ -f package-lock.json ]]; then
      if [[ "${FORCE_CLEAN_INSTALL:-0}" -eq 1 ]]; then
        # Clean install may include dependency changes; prefer npm install to update lockfile
        npm install --legacy-peer-deps
      else
        # Attempt reproducible install first; if lock is out of sync, fall back to npm install
        npm ci --legacy-peer-deps || {
          echo "npm ci failed (likely lockfile out of sync). Falling back to 'npm install --legacy-peer-deps'."
          npm install --legacy-peer-deps
        }
      fi
    else
      npm install --legacy-peer-deps
    fi
  fi
fi
npm run build:firefox

# Launch Firefox via web-ext with the built extension in `out/`
# - Use FIREFOX_BIN to point to a custom Firefox executable
# - Uses npx --yes to avoid interactive prompts on first run
echo "==> Launching Firefox with temporary add-on (web-ext)..."
WEB_EXT_ARGS=(run --source-dir out)
if [[ -n "${FIREFOX_BIN:-}" ]]; then
  WEB_EXT_ARGS+=(--firefox "$FIREFOX_BIN")
fi

# Use --yes to avoid npx prompt on first run
npx --yes web-ext "${WEB_EXT_ARGS[@]}"

echo "Firefox exited. Cleaning up..."