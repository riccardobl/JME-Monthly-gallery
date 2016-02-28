#!/bin/bash
source "uploadToOvh.settings.sh"
while IFS= read -d $'\0' -r file ; do
   ignored=`git check-ignore $file`
   if [ "$ignored" = "" ]; then
      echo "Upload"
      $SWIFT_BIN -V 2.0 upload $TARGET_CONTAINER $file
   fi
done < <(find * -type f -print0)

