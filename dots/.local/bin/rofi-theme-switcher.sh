#!/usr/bin/env bash

notify() {
    notify-send --icon=/usr/share/icons/Adwaita/16x16/categories/applications-system-symbolic.symbolic.png "${1}" "${2}"
}

apply() {
    theme_name=${1}
    dunst_theme_file=$XDG_CONFIG_HOME/dunst/themes/${1}
    termite_theme_file=$XDG_CONFIG_HOME/termite/themes/${1}
    rofi_theme_file=$XDG_CONFIG_HOME/rofi/themes/${1}
    xorg_theme_file=$HOME/.Xresources-themes/${1}
    
    # Dunst
    if [[ -f $dunst_theme_file ]]
    then
       
        cd $XDG_CONFIG_HOME/dunst/themes \
            && cat base_config "${theme_name}" > $XDG_CONFIG_HOME/dunst/dunstrc \
            && systemctl --user restart dunst \
            && notify "Dunst Theme Updated" "${theme_name}" \
            && sleep 0.5
    else
        notify-send -u critical "Error" "Dunst: No such theme: ${dunst_theme_file}"
    fi
    
    # Termite
    if [[ -f $termite_theme_file ]]
    then
        cd $XDG_CONFIG_HOME/termite/themes \
            && cat base_config "${theme_name}" > ../config \
            && notify "Termite Theme Updated" "${theme_name}" \
            && sleep 0.5
    else
        notify-send -u critical "Error" "Termite: No such theme: ${termite_theme_file}"
    fi
    
    # Rofi
    if [[ -f $rofi_theme_file ]]
    then
        cd $XDG_CONFIG_HOME/rofi/themes \
            && cat base_config "${theme_name}" > ../config.rasi \
            && notify "Rofi Theme Updated" "${theme_name}" \
            && sleep 0.5
    else
        notify-send -u critical "Error" "Rofi: No such theme: ${rofi_theme_file}"
    fi
    
    # Xorg
    if [[ -f $xorg_theme_file ]]
    then
        cd $HOME/.Xresources-themes \
            && cat "${theme_name}" base_config > ../.Xresources \
            && xrdb $HOME/.Xresources \
            && notify "Xresources Theme Updated" "${theme_name}" \
            && sleep 0.5
    else
        notify-send -u critical "Error" "Xorg: No such theme: ${rofi_theme_file}"
    fi

    # i3 (Uses Xresources, so just restart it)
    i3 reload \
        && notify "i3-gaps" "Configuration reloaded"
}

rofi_print() {
    available_themes=( 'twilight.dark' 'dracula' '3024.light' )

    for ((i=0; i < ${#available_themes[@]}; i++))
    do
        printf "${available_themes[$i]}\n"
    done
}


main() {
    if [ -n "${@}" ]; then
        notify-send "Selected theme: ${1}"
        theme=$1
        apply "${theme}"
        exit
    else
        rofi_print
    fi
}

main "${1}"
