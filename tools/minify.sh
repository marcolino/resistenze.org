#!/usr/bin/env bash
#
# Minify css an js resources

RESOURCES_BASEPATH="${1:-.}"

cd "$RESOURCES_BASEPATH" || { echo "Folder $RESOURCES_BASEPATH not found"; exit -1; }

echo "minifying css..."
for file in css/*.css; do npx uglifycss "$file" --output "${file%%.*}.min.css" ; done

echo "minifying js..."
for file in js/*.js; do npx uglify-js "$file" --compress --mangle toplevel --output "${file%%.*}.min.js" ; done
for file in js/*.js; do npx uglify-js "$file" --compress --mangle toplevel -m "reserved=['toggleSidebar','loadNumber']" --output "${file%%.*}.min.js" ; done
#echo "minifying html..."
#for file in index.html; do sed -e "s/^[ \t]*//g" -e "/^$/d" $file > "${file%%.*}.min.html"

echo "done."

exit 0