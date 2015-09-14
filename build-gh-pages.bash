#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Install triggers build
npm install

dist="dist-$(date +"%s")"

rm -rf dist-*
cp -r dist/ "${dist}/"

git checkout gh-pages
cp -r "${dist}/" dist/
rm -rf "${dist}/"

git add dist/
git commit -m "Builb GH Pages"
