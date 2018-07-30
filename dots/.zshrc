export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

[ -f $HOME/.profile ] && {
    source $HOME/.profile
}
[ -f $HOME/.aliases ] && {
    source $HOME/.aliases
}

[ -f $HOME/.zsh/get-plugins.sh ] && {
    source $HOME/.zsh/get-plugins.sh
}

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
#ZSH_THEME="refined"
#ZSH_THEME="agnoster"
#ZSH_THEME="clean"
ZSH_THEME="gozilla"
# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.

# Note: For external plugins, be sure to add them to $HOME/.zsh/get-plugins.sh (abry)
plugins=(
  git
  cargo
  emacs
  command-not-found
  docker
  docker-compose
  rust
  vim-interaction
  zsh-syntax-highlighting
)

ext_plugins=(
  elixir-oh-my-zsh
  zsh-autosuggestions
  warhol
  zsh-you-should-use
  zsh-256color
  zsh-colored-man-pages
)

for p in "${ext_plugins[@]}"; do
  . $(find "${HOME}/.oh-my-zsh/plugins/${p}/" -iname "*.plugin.zsh")
done
source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
