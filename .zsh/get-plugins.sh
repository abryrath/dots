#!/bin/zsh

PLUGIN_DIR="$HOME/.oh-my-zsh/plugins"

typeset -A plugs
plugs=(
    "zsh-autosuggestions" "https://github.com/zsh-users/zsh-autosuggestions"
    "elixir-oh-my-zsh" "https://github.com/gusaiani/elixir-oh-my-zsh.git"
    "warhol" "https://github.com/unixorn/warhol.plugin.zsh.git"
    "zsh-you-should-use" "https://github.com/MichaelAquilina/zsh-you-should-use"
    "zsh-256color" "https://github.com/chrissicool/zsh-256color"
    "zsh-colored-man-pages" "https://github.com/ael-code/zsh-colored-man-pages"
)

for i  in "${(@k)plugs}"; do
    plugin="$i"
    url="$plugs[$i]"
    
    if [[ ! -d "${PLUGIN_DIR}/${plugin}" ]]; then
        echo "${plugin} is not installed, pulling it now..."
        clone_cmd="git clone ${url} ${PLUGIN_DIR}/${plugin}"
        printf "\t${clone_cmd}\n"
        eval $clone_cmd
        #    else
        # printf "\tFound ${plugin} (skipping)\n"
    fi
        
done
