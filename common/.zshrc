#!/usr/bin/env zsh
source <(antibody init)
autoload -U +X compinit && compinit

source ~/.local/share/env.sh
source ~/.aliases
antibody bundle < $HOME/.zsh_plugins

# Keys
# macOS
#if [$(uname -s) == "Darwin"]; then
  echo "Applying macOS key bindings" 
  bindkey "^[^[[D" emacs-forward-word
  bindkey "^[^[[C" emacs-backward-word
#else
#  echo "Applying linux keybindinds"
#fi
#
# source ~/.zsh_plugins.sh
