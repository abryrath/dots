#!/usr/bin/env bash

# Low Urgency
printf "Testing low urgency...\n"
notify-send -u low "dunst-preview.sh" "Low Urgency"

# Normal Urgency
printf "Testing normal urgency...\n"
notify-send -u normal "dunst-preview.sh" "Normal Urgency"

# Critcal Urgency
printf "Testing critical urgency...\n"
notify-send -u critical "dunst-preview.sh" "Critical Urgency"
