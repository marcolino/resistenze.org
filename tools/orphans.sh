#!/usr/bin/env bash
#
# Find orphaned resources in a web site, and remove them

RESOURCES_BASEPATH="${1:-.}"
REALLY_REMOVE=1 # 0: dry run; 1: really remove orphaned resources
RESOURCE_FILES="/tmp/orphaned-$$"

# trap ctrl-c interrupt
trap signalInt INT

function signalInt() {
  echo "INT signal received"
  rm -f "$RESOURCE_FILES"
  exit -1
}

echo "`date +"%H:%M:%S"` listing resource files in \"$RESOURCES_BASEPATH\"..."
> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.jpg >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.png >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.gif >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.ico >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.webp >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.css >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.js >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.htm >> "$RESOURCE_FILES"
find "$RESOURCES_BASEPATH" -name \*.html >> "$RESOURCE_FILES"
n=`wc -l --total=never "$RESOURCE_FILES" | cut -f 1 -d "/"`
#echo "`date +"%H:%M:%S"` ${n}resource files found"

tot=`find "$RESOURCES_BASEPATH" -type f | wc -l`
echo "`date +"%H:%M:%S"` looking for orphaned resource files in \"$RESOURCES_BASEPATH\" (total files are $tot)..."
if [ $REALLY_REMOVE -eq 1 ]; then
  echo "'REALLY REMOVE' MODE !"
else
  echo "'DRY RUN' MODE"
fi
i=0
for res in $(cat "$RESOURCE_FILES"); do
  i=$(($i+1))
  [[ "$res" =~ ^./index.html ]] && continue # skip index.html file
  [[ "$res" =~ ^./css/ ]]  && continue # skip css folder
  [[ "$res" =~ ^./js/ ]] && continue # skip js folder
  printf "\r`date +"%H:%M:%S"` [%6d/%6s]" "$i" "$n"; 
  grep -R `basename "$res"` "$RESOURCES_BASEPATH" > /dev/null || {
    if [ $REALLY_REMOVE -eq 1 ]; then
      echo " removing unused resource file ${res}..."
      rm "$res"
    fi
  }
done

echo "`date +"%H:%M:%S"` done."

rm -f "$RESOURCE_FILES"
exit 0

