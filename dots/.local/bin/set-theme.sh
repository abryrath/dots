#!/usr/bin/env bash

themes=( 'twilight.dark' 'dracula' '3024.light' )

for ((i=0; i < ${#themes[@]}; i++))
do
    printf "${i}.\t${themes[$i]}\n"
done

read -p "Select # from available themes: " theme
if (($theme<${#themes[@]}))
then
    theme_name=${themes[${theme}]}
else
    echo "Error"
    exit
fi

echo "Selected theme: ${theme_name}"

# Dunst
cd $XDG_CONFIG_HOME/dunst/themes \
    && cat base_config "${theme_name}" > $XDG_CONFIG_HOME/dunst/dunstrc \
    && killall dunst
exec dunst &
notify-send "Dunst Theme Updated" "${theme_name}" \
    && sleep 0.5

# Termite
cd $XDG_CONFIG_HOME/termite/themes \
    && cat base_config "${theme_name}" > ../config \
    && notify-send "Termite Theme Updated" "${theme_name}" \
    && sleep 0.5

# Rofi
cd $XDG_CONFIG_HOME/rofi/themes \
    && cat base_config "${theme_name}" > ../config.rasi \
    && notify-send "Rofi Theme Updated" "${theme_name}" \
    && sleep 0.5

# Xorg
cd $HOME/.Xresources-themes \
    && cat "${theme_name}" base_config > ../.Xresources \
    && xrdb $HOME/.Xresources \
    && notify-send "Xresources Theme Updated" "${theme_name}"
