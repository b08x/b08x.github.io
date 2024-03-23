#!/usr/bin/env bash
(
  set -e
  export TEXTDOMAIN='thunar-custom-actions'
  export TEXTDOMAINDIR='/usr/share/locale'
  . /usr/bin/gettext.sh

  SCALE=$(/usr/bin/zenity --text="$(eval_gettext 'Scale to what percentage?')" --scale --value=50 --min-value=1 --max-value=99) || exit

  (
    AMOUNT=$(for file in %F; do echo "$file"; done | wc -l)
    NR=0

    for file in %F; do
      NR="$(echo "$NR+1" | /usr/bin/bc)"
      PERCENTAGE="$(echo "$NR*100/$AMOUNT" | /usr/bin/bc)"
      filebase=$(basename "$file")
      echo '#'$(eval_gettext 'Scale to $SCALE percent') ... "$filebase"

      (
        fileinput="$(echo "$file")"
        filefinalout="$(echo "$file")"

        if test "$fileinput" = "$filefinalout"; then
          fileout=$(f=$(echo "$filefinalout"); while test -e "$f"; do f=$(dirname "$f")/.$(basename "$f").tmp; done; echo "$f")
        else
          fileout="$filefinalout"
        fi

        OVERWRITE=yes

        if test -e "$filefinalout" -a ! "$fileinput" = "$filefinalout"; then
          base=$(basename "$filefinalout")
          if ! (/usr/bin/zenity --question --text="$(echo $(eval_gettext 'overwrite $base?'))"); then
            OVERWRITE=no
          fi
        fi

        if test "$OVERWRITE" = "yes"; then
          (/usr/bin/convert "$fileinput" -resize ${SCALE}%% "$fileout")
        fi

        if ! test "$fileout" = "$filefinalout"; then
          if cp "$fileout" "$filefinalout"; then
            rm "$fileout"
          else
            /usr/bin/zenity --error --text="$(echo $(eval_gettext 'something went wrong copying the file $fileout over to $filefinalout.'))"
          fi
        fi
      )
      echo $PERCENTAGE
    done
  ) | /usr/bin/zenity --progress --auto-kill --auto-close
)

