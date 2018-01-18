#!/bin/sh

[ -f "${HOME}/.config/lemonbar/env/$(hostname)" ] && {
	. "${HOME}/.config/lemonbar/env/$(hostname)"
}

color_active="%{F#50FA7B}"
color_inactive="%{F#F8F8F2}"
fa_dot_circle_o="\uf192"
fa_circle="\uf111"
fa_circle_o="\uf10c"

# Formatting functions
focused_occupied_desktop() {
    color="${color_active}"
    icon="${fa_circle}"
    echo -e "${color}${icon} %{F-}"
}
focused_free_desktop() {
    color="${color_active}"
    icon="${fa_circle_o}"
    echo -e "${color}${icon} %{F-}" #echo "%{F#8be9fd}%{F-}"
}
focused_urgent_desktop() {
    color="${color_active}"
    icon="!"
    echo -e "${color}${icon} %{F-}"
}
occupied_desktop() {
    color="${color_inactive}"
    icon="${fa_dot_circle_o}"
    echo -e "${color}${icon} %{F-}"
}
free_desktop() {
    color="${color_inactive}"
    icon="${fa_circle_o}"
    echo -e "${color}${icon} %{F-}"
}

host() {
    hostname
}

clock() {
    date +%H:%M:%S
}

battery() {
    cat /sys/class/power_supply/BAT0/capacity
}

music() {
    icon="[M]"
    color="${F#FFFFFF}"
    echo "${color}${icon}$(/usr/bin/ncmpcpp -c $HOME/.config/ncmpcpp/config --current-song) ${F-}"
}

hlwm() {
    wm_info=""
    tags=($(herbstclient tag_status $monitor))
    for i in "${tags[@]}"; do
	case ${i:0:1} in
	    '#')
		# focused occupied desktop
		wm_info="${wm_info}$(focused_occupied_desktop)"
		;;
	    '+')
		# focused free desktop
		wm_info="${wm_info}$(focused_free_desktop)"
		;;
	    '!')
		# focused urgent desktop
		wm_info="${wm_info}$(focused_urgent_desktop)"
		;;
	    ':')
		# occupied desktop
		wm_info="${wm_info}$(occupied_desktop)"
		;;
	    *)
		# free desktop
		wm_info="${wm_info}$(free_desktop)"
		;;
	esac
	shift
    done
    echo "$wm_info"
}

window_title() {
    xtitle
}

while true; do
    sep="|"
    bar_left="hlwm: $(hlwm) $(window_title)"
    bar_center="$(music)"
    bar_right="TIME: $(clock)"
    bar_input="%{l}${bar_left}%{c}${bar_center}%{r}${bar_right}"
    echo $bar_input
    sleep 1
done
