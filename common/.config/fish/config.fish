set fish_greeting ''

# Set a clean path on init
set -e fish_user_paths
set -Ux fish_user_paths $HOME/.local/bin /usr/local/opt/php/bin /usr/local/opt/coreutils/libexec/gnubin /usr/local/bin /usr/local/sbin /usr/bin /bin

#set -x LC_ALL en_US.UTF-8
set -x LANG en_US.UTF-8
set -x LANGUAGE en_US.UTF-8

set -x ALACRITTY_CS $HOME/.alacritty-colorschemes

alias sshc="code ~/.ssh/config"

alias ga="git add"
alias gst="git status"
alias gcm="git commit -m"
alias gco="git checkout"
alias gr="git reset --hard"
alias gph="git push origin"
alias gpl="git pull origin"

alias vu="vagrant up"
alias vh="vagrant halt"
alias vr="vagrant reload --provision"
alias vs="vagrant ssh"

# PHP Aliases
if test (uname) = "Darwin"
    function php74
        /usr/local/opt/php@7.3/bin/php $argv
    end
else
    # $argv
end
function homestead
    cd ~/Union/unionco-homestead && vagrant $argv
end
function ph
    cd ~/Code/personal-homestead && vagrant $argv
end

if command -v bass > /dev/null
	bass source ~/.cargo/env > /dev/null
end
