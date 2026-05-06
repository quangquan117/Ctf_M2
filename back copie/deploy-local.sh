#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="/Users/homosapiens/Desktop/School - M2/Ctf_M2/back"

echo ">> Starting backend from: $PROJECT_DIR"

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Error: project directory not found: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

if [[ ! -x "./gradlew" ]]; then
  chmod +x "./gradlew"
fi

PORT="${PORT:-8080}"
DEFAULT_IF="$(route get default 2>/dev/null | awk '/interface:/{print $2; exit}')"
HOST_IP=""
MAX_PORT_SEARCH="${MAX_PORT_SEARCH:-20}"

is_port_in_use() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

find_available_port() {
  local start_port="$1"
  local limit="$2"
  local candidate="$start_port"
  local i=0

  while [[ "$i" -lt "$limit" ]]; do
    if ! is_port_in_use "$candidate"; then
      echo "$candidate"
      return 0
    fi
    candidate=$((candidate + 1))
    i=$((i + 1))
  done

  return 1
}

detect_lan_ip() {
  local detected=""
  local iface=""

  if [[ -n "${DEFAULT_IF:-}" ]]; then
    detected="$(ipconfig getifaddr "$DEFAULT_IF" 2>/dev/null || true)"
    if [[ -n "$detected" ]]; then
      echo "$detected"
      return 0
    fi
  fi

  # Fallback: scan active network interfaces commonly used on macOS.
  for iface in $(ifconfig -l); do
    if [[ "$iface" =~ ^en[0-9]+$ ]]; then
      detected="$(ipconfig getifaddr "$iface" 2>/dev/null || true)"
      if [[ -n "$detected" ]]; then
        DEFAULT_IF="$iface"
        echo "$detected"
        return 0
      fi
    fi
  done

  return 1
}

HOST_IP="$(detect_lan_ip || true)"

FINAL_PORT="$(find_available_port "$PORT" "$MAX_PORT_SEARCH" || true)"
if [[ -z "$FINAL_PORT" ]]; then
  echo "Error: no available port found from $PORT to $((PORT + MAX_PORT_SEARCH - 1))."
  echo "Hint: set a custom port, e.g. PORT=9000 ./deploy-local.sh"
  exit 1
fi

if [[ "$FINAL_PORT" != "$PORT" ]]; then
  echo ">> Port $PORT is already used, switching to available port $FINAL_PORT"
fi

echo ">> Launching Spring Boot for LAN access on 0.0.0.0:$FINAL_PORT"
if [[ -n "$HOST_IP" ]]; then
  echo ">> Network interface: ${DEFAULT_IF:-unknown}"
  echo ">> Accessible from Wi-Fi devices at: http://$HOST_IP:$FINAL_PORT"
else
  echo ">> Could not detect Wi-Fi IP automatically."
fi

./gradlew bootRun --args="--server.address=0.0.0.0 --server.port=$FINAL_PORT"
