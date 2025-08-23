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
# - START_URL=...</url>        Open this URL when Firefox starts (defaults to Wikipedia)
# -------------------------------------------------------------

# Optional: set FIREFOX_BIN to a specific Firefox path (e.g., on Windows Git Bash)
# export FIREFOX_BIN="/c/Program Files/Mozilla Firefox/firefox.exe"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Resolve npm/npx via multiple strategies including npm-cli.js next to node
declare -a NPM_CMD
declare -a NPX_CMD
NPM_CMD=()
NPX_CMD=()

# Strategy 1: plain npm/npx
if command -v npm >/dev/null 2>&1; then NPM_CMD=(npm); fi
if command -v npx >/dev/null 2>&1; then NPX_CMD=(npx); fi

# Strategy 2: *.cmd
if [[ ${#NPM_CMD[@]} -eq 0 ]] && command -v npm.cmd >/dev/null 2>&1; then NPM_CMD=(npm.cmd); fi
if [[ ${#NPX_CMD[@]} -eq 0 ]] && command -v npx.cmd >/dev/null 2>&1; then NPX_CMD=(npx.cmd); fi

# Strategy 3: common Windows install locations
if [[ ${#NPM_CMD[@]} -eq 0 ]]; then
  for CAND in \
    "/c/Program Files/nodejs/npm.cmd" \
    "/c/Program Files (x86)/nodejs/npm.cmd" \
    "/c/Users/${USERNAME:-}/AppData/Roaming/npm/npm.cmd"; do
    [[ -f "$CAND" ]] && NPM_CMD=("$CAND") && break
  done
fi
if [[ ${#NPX_CMD[@]} -eq 0 ]]; then
  for CAND in \
    "/c/Program Files/nodejs/npx.cmd" \
    "/c/Program Files (x86)/nodejs/npx.cmd" \
    "/c/Users/${USERNAME:-}/AppData/Roaming/npm/npx.cmd"; do
    [[ -f "$CAND" ]] && NPX_CMD=("$CAND") && break
  done
fi

# Strategy 4: npm-cli.js/npx-cli.js alongside node.exe
NODE_BIN="$(command -v node 2>/dev/null || true)"
if [[ -n "$NODE_BIN" ]]; then
  NODE_DIR="$(dirname "$NODE_BIN")"
  if [[ ${#NPM_CMD[@]} -eq 0 ]]; then
    if [[ -f "$NODE_DIR/node_modules/npm/bin/npm-cli.js" ]]; then
      NPM_CMD=(node "$NODE_DIR/node_modules/npm/bin/npm-cli.js")
    fi
  fi
  if [[ ${#NPX_CMD[@]} -eq 0 ]]; then
    if [[ -f "$NODE_DIR/node_modules/npm/bin/npx-cli.js" ]]; then
      NPX_CMD=(node "$NODE_DIR/node_modules/npm/bin/npx-cli.js")
    fi
  fi
fi

# Strategy 5: resolve via Node module resolution (works with most Node installs)
if [[ ${#NPM_CMD[@]} -eq 0 && -n "$NODE_BIN" ]]; then
  NPM_JS_PATH="$(node -p "require.resolve('npm/bin/npm-cli.js')" 2>/dev/null || true)"
  if [[ -n "$NPM_JS_PATH" && -f "$NPM_JS_PATH" ]]; then
    NPM_CMD=(node "$NPM_JS_PATH")
  fi
fi
if [[ ${#NPX_CMD[@]} -eq 0 && -n "$NODE_BIN" ]]; then
  NPX_JS_PATH="$(node -p "require.resolve('npm/bin/npx-cli.js')" 2>/dev/null || true)"
  if [[ -n "$NPX_JS_PATH" && -f "$NPX_JS_PATH" ]]; then
    NPX_CMD=(node "$NPX_JS_PATH")
  fi
fi

# Final fallback guards
if [[ ${#NPM_CMD[@]} -eq 0 ]]; then
  echo "npm not found. Please ensure Node.js (with npm) is installed and available in PATH."
  exit 1
fi
if [[ ${#NPX_CMD[@]} -eq 0 ]]; then
  # We can continue without npx by skipping kill-port and web-ext
  NPX_CMD=(false)
fi

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
  # Proactively stop any previous backend on port 5123 to avoid file watch errors on Windows
  if [[ "${NPX_CMD[0]}" != "false" ]]; then
    "${NPX_CMD[@]}" --yes kill-port 5123 >/dev/null 2>&1 || true
  fi
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
      "${NPM_CMD[@]}" ci
    else
      "${NPM_CMD[@]}" install
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
"${NPM_CMD[@]}" run dev &
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
        "${NPM_CMD[@]}" install --legacy-peer-deps
      else
        # Attempt reproducible install first; if lock is out of sync, fall back to npm install
        "${NPM_CMD[@]}" ci --legacy-peer-deps || {
          echo "npm ci failed (likely lockfile out of sync). Falling back to 'npm install --legacy-peer-deps'."
          "${NPM_CMD[@]}" install --legacy-peer-deps
        }
      fi
    else
      "${NPM_CMD[@]}" install --legacy-peer-deps
    fi
  fi
fi
"${NPM_CMD[@]}" run build:firefox

# Launch Firefox via web-ext with the built extension in `out/`
# - Use FIREFOX_BIN to point to a custom Firefox executable
# - Uses npx --yes to avoid interactive prompts on first run
echo "==> Launching Firefox with temporary add-on (web-ext)..."
WEB_EXT_ARGS=(run --source-dir out)
if [[ -n "${FIREFOX_BIN:-}" ]]; then
  WEB_EXT_ARGS+=(--firefox "$FIREFOX_BIN")
fi

# Optionally open a URL on startup (defaults to Wikipedia)
if [[ -n "${START_URL:-}" ]]; then
  WEB_EXT_ARGS+=(--url "$START_URL")
else
  WEB_EXT_ARGS+=(--url "https://www.wikipedia.org/")
fi

# Use --yes to avoid npx prompt on first run
if [[ "${NPX_CMD[0]}" != "false" ]]; then
  "${NPX_CMD[@]}" --yes web-ext "${WEB_EXT_ARGS[@]}"
else
  echo "npx not available; skipping automatic web-ext run. You can manually run the extension from 'extension/out'."
fi

echo "Firefox exited. Cleaning up..."