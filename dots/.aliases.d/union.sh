#!/usr/bin/env bash

# Apache + PHP configs
php56_root=$(brew info php@5.6 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')

if [[ -f "${php56_root}/bin/php" ]]; then
    alias php56="${php56_root}/bin/php"
fi

php70_root=$(brew info php@7.0 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')

if [[ -f "${php70_root}/bin/php" ]]; then
    alias php70="${php70_root}/bin/php"
fi

php71_root=$(brew info php@7.1 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')

if [[ -f "${php71_root}/bin/php" ]]; then
    alias php71="${php71_root}/bin/php"
fi

php72_root=$(brew info php@7.2 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')

if [[ -f "${php72_root}/bin/php" ]]; then
    alias php72="${php72_root}/bin/php"
fi


export VHOSTS_DIR="/usr/local/etc/httpd/extra/vhosts"
export APACHE_DIR="/usr/local/etc/httpd"
alias em.vhosts="emacsclient -c ${VHOSTS_DIR}"
alias em.apache="emacsclient -c ${APACHE_DIR}/httpd.conf"
alias em.ssh="emacsclient -c $HOME/.ssh/config"
alias sd="npm run syncdb"
alias cd.ur="cd $UNION_REPOS"

alias cd.aceyus="cd ${UNION_REPOS}/aceyus-com"
alias ssh.aceyus="ssh aceyus@aceyus.com"

alias cd.cooke="cd $UNION_REPOS/cooke-bieler-com"
alias ssh.cooke="ssh cookebieler@vps2.union.co"

alias cd.disc="cd ${UNION_REPOS}/discoveryplace-v3"
alias ssh.disc="ssh discoveryplace@vps1.discoveryplace.union.co"

alias cd.entec="cd ${UNION_REPOS}/entecpolymers-com"

alias ssh.root.vps2="ssh root@vps2.union.co"

alias ssh.afm="ssh americanforestma@americanforestmanagement.com"
alias ssh.afm.root="ssh root@americanforestmanagement.com"
alias cd.afm="cd ${UNION_REPOS}/american-forest-management"
