#!/usr/bin/env bash

echo "$DOTS"

stow -n --dir="${DOTS}"  --target="${HOME}" -S dots
