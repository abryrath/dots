
set fish_user_paths $HOME/.local/bin $PATH
if not functions -q fisher
    set -q XDG_CONFIG_HOME; or set XDG_CONFIG_HOME ~/.config
    curl https://git.io/fisher --create-dirs -sLo $XDG_CONFIG_HOME/fish/functions/fisher.fish
    fish -c fisher
end

if not type -q bass
    echo "bass not installed..., to install:"
    echo "  fisher add edc/bass"
    #fisher add edc/bass
    #echo "Finished"
end

bass source ~/.local/share/env.sh

#if type -q bass
#    bass source ~/.aliases
#end
for func in ~/.config/fish/user-functions/*
    # 	echo "Loading $func"
    source $func
end

# Set a clean path on init
set -e fish_user_paths
set -g fish_user_paths /usr/local/opt/php/bin /usr/local/opt/coreutils/libexec/gnubin /usr/local/bin /usr/local/sbin /usr/bin /bin

# if test -e ~/.ghcup/.env
#   bass source ~/.ghcup/.env
# end

if test -e ~/.cargo/env
    bass source ~/.cargo/env
end

# Aliases
#!/usr/bin/env bash

alias ga="git add"
alias gst="git status"
alias gcm="git commit -m"
alias gco="git checkout"
alias gr="git reset --hard"
alias gph="git push origin"
alias gpl="git pull origin"

# PHP Aliases
function composer74
    "(which php) (which composer)"
end
if test (uname) = "Darwin"
    function php73
        /usr/local/opt/php@7.3/bin/php $argv
    end
    function php72
        /usr/local/opt/php@7.2/bin/php $argv
    end
    function php71
        /usr/local/opt/php@7.1/bin/php $argv
    end
    function php70
        /usr/local/opt/php@7.3/bin/php $argv
    end
    function composer73
        php73 (which composer) $argv
    end
    function composer72
        php72 (which composer) $argv
    end
    function composer71
        php71 (which composer) $argv
    end
    function composer70
        php70 (which composer) $argv
    end
else
    # $argv
end
