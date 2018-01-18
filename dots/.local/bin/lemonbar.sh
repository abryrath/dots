#!/bin/sh

# Fonts
font="mononoki Nerd Font"
font_icons="Font Awesome"

#Colors
foreground="#CAA9FA"
background="#000000"
underline="#000000"

#Misc
underline_px="5"
width=""
height="20"
x=""
y=""
geometry="${width}x${height}+${x}+${y}"
${HOME}/.local/bin/lemonbar-output.sh \
    | lemonbar \
          -p  -b -g "${geometry}" \
          -n "herbstluftwm" \
          -f "${font}" -f "${font_icons}" \
          -F "${foreground}" \
          -B "${background}" \
          -U "${underline}" -u "${underline_px}"
