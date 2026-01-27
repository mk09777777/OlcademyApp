#!/usr/bin/env bash
set -euo pipefail

# Ensures EAS local Android builds use a supported JDK.
# On this machine, `JAVA_HOME` may be set to JDK 24+, which can break Gradle/AGP.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pick_java_home() {
  local candidate

  is_supported_java_home() {
    local java_bin="$1/bin/java"
    local javac_bin="$1/bin/javac"
    if [[ ! -x "$java_bin" ]]; then
      return 1
    fi

    # Gradle toolchains require a full JDK (JAVA_COMPILER capability).
    if [[ ! -x "$javac_bin" ]]; then
      return 1
    fi

    local version_output
    version_output="$($java_bin -version 2>&1 | head -n 1 || true)"

    if [[ "$version_output" =~ \"(17|21)(\.|\") ]]; then
      return 0
    fi

    return 1
  }

  for candidate in \
    "${EAS_JAVA_HOME:-}" \
    "${JDK_HOME:-}" \
    "${HOME}/.jdk"/jdk-21* \
    "${HOME}/.jdk"/jdk-17* \
    "/usr/lib/jvm/java-21-openjdk" \
    "/usr/lib/jvm/java-21-openjdk-amd64" \
    "/usr/lib/jvm/java-17-openjdk" \
    "/usr/lib/jvm/java-17-openjdk-amd64" \
    "${JAVA_HOME:-}"; do
    if [[ -n "$candidate" && $(is_supported_java_home "$candidate" && echo yes || echo no) == "yes" ]]; then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

PROFILE="${1:-development}"

if JAVA_HOME_SELECTED="$(pick_java_home)"; then
  export JAVA_HOME="$JAVA_HOME_SELECTED"
  export PATH="$JAVA_HOME/bin:$PATH"
else
  echo "ERROR: Could not find a usable JDK (expected 21 or 17, with javac available)." >&2
  echo "Hint: install a full JDK (not just a JRE) and re-run, or export EAS_JAVA_HOME/JAVA_HOME." >&2
  exit 1
fi

cd "$ROOT_DIR"

echo "Using JAVA_HOME=$JAVA_HOME" >&2

echo "Running: npx eas build --platform android --profile $PROFILE --local" >&2
npx eas build --platform android --profile "$PROFILE" --local
