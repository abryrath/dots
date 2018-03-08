#!/usr/bin/env sh
#
# Defines runtime environment
#
export LD_LIBRARY_PATH=/usr/lib/
export PATH=/usr/local/bin:/usr/bin:/bin:/sbin:/usr/bin/core_perl

if [[ -d /usr/bin/core_perl ]]
then
  export PATH=$PATH:/usr/bin/core_perl
fi

export LOCAL_ETC="${HOME}/.local/etc"
export LOCAL_BIN="${HOME}/.local/bin"
export LOCAL_LIB="${HOME}/.local/lib"
export LOCAL_SRC="${HOME}/.local/src"
export LOCAL_VAR="${HOME}/.local/var"

export XDG_DATA_HOME="${HOME}/.local/share"
export XDG_RUNTIME_DIR=/run/user/1000
#export XDG_RUNTIME_DIR="${HOME}/.local/run"
export XDG_CACHE_HOME="${HOME}/.cache"
export XDG_CONFIG_HOME="${HOME}/.config"
export DOTS="${HOME}/.dots"

export POLYBAR_HOME="${XDG_CONFIG_HOME}/polybar"

export BSPWMRC="${LOCAL_ETC}/bspwm/bspwmrc"
export BSPWM_STATE="${XDG_CACHE_HOME}/bspwm/state.json"
export BSPWM_FIFO="${XDG_CACHE_HOME}/bspwm/wm_state"

export SXHKD_SHELL="$(which zsh)"

export ARCH="x86_64"
export ARCHFLAGS="-arch x86_64"

export LANG="en_US.UTF-8"
export BROWSER="firefox"

if [ -x "$(command -v emacsclient)" ]; then
    export EDITOR="emacsclient -nw"
    export VISUAL="emacsclient -c"
elif [ -x "(command -v nvim)" ]; then
    export EDITOR="nvim"
    export VISUAL="nvim"
else
    export EDITOR="nano"
    export VISUAL="nano"
fi

export GREP_COLORS="mt=30;43"


[ "$TERM" = "xterm" ] && {
  export TERM="xterm-256color"
}

# Update PATH
path_prepend() {
  case ":$PATH:" in
    *":$1:"*) return ;; # already added
    *) PATH="$1:$PATH";;
  esac
}

[ -d "$LOCAL_LIB" ] && {
  for dir in "$LOCAL_LIB"/* "$LOCAL_LIB"; do
    [ -d "$dir" ] && path_prepend "$dir"
    [ -d "$dir/contrib" ] && path_prepend "$dir/contrib"
  done
}

[ -d "$LOCAL_BIN" ] && {
  for dir in "$LOCAL_BIN"/* "$LOCAL_BIN"; do
    [ -d "$dir" ] && path_prepend "$dir"
  done
}

unset dir
unset -f path_prepend

# Cargo/Rust
[ -d "$HOME/.cargo/bin" ] && {
  export PATH="$PATH:$HOME/.cargo/bin"
}

# RUST_SRC_PATH
type rustc >/dev/null 2>&1 && {
  export RUST_SRC_PATH="$(rustc --print sysroot)/lib/rustlib/src/rust/src"
}

# Yarn/NPM
[ -d "$HOME/.yarn/bin" ] && {
  export PATH="$PATH:$HOME/.yarn/bin"
}

export PATH="$PATH:/usr/local/sbin"
export MANPATH="$MANPATH:/usr/local/share/man:/usr/share/man"
