#!/usr/bin/env bash
# release.sh — Build and publish a GitHub release with DMG + EXE assets
# Usage: ./scripts/release.sh [version]
# If version is omitted, reads from package.json
set -euo pipefail

VERSION="${1:-$(node -p "require('./package.json').version")}"
TAG="v${VERSION}"
DIST="dist"

echo "==> Releasing ${TAG}"

# Ensure working tree is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: Uncommitted changes. Commit or stash before releasing."
  exit 1
fi

# Ensure tag exists
if ! git rev-parse "${TAG}" >/dev/null 2>&1; then
  echo "ERROR: Tag ${TAG} does not exist. Create it first (git tag ${TAG})."
  exit 1
fi

# Clean previous build output
rm -rf "${DIST}"

# Build macOS (DMG) and Windows (EXE)
echo "==> Building macOS + Windows..."
npm run build

# Collect assets
DMG_ARM=$(find "${DIST}" -name "*.dmg" | grep "arm64" | head -1)
# electron-builder names the x64 DMG without an arch suffix
DMG_X64=$(find "${DIST}" -name "*.dmg" | grep -v "arm64" | head -1)
EXE=$(find "${DIST}" -maxdepth 1 -name "*Setup*.exe" | head -1)

# Fail if any required artifact is missing
MISSING=0
[ -z "${DMG_ARM}" ] && echo "ERROR: arm64 DMG not found in ${DIST}/" && MISSING=1
[ -z "${DMG_X64}" ] && echo "ERROR: x64 (Intel) DMG not found in ${DIST}/" && MISSING=1
[ -z "${EXE}" ]     && echo "ERROR: Windows EXE not found in ${DIST}/" && MISSING=1
[ "${MISSING}" -eq 1 ] && exit 1

ASSETS=("${DMG_ARM}" "${DMG_X64}" "${EXE}")

echo "==> Assets to upload:"
for f in "${ASSETS[@]}"; do echo "    $f"; done

# Upload assets to the existing GitHub release
echo "==> Uploading to GitHub release ${TAG}..."
gh release upload "${TAG}" "${ASSETS[@]}" --clobber

echo ""
echo "==> Done: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/${TAG}"
