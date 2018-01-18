#!/usr/bin/env bash

echo "$DOTS"

stow --dir="${DOTS}"  --target="${HOME}" -S dots
