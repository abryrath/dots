#!/usr/bin/env bash

if [[ $(uname -s) == "Darwin" ]]; then
    
    # Apache + PHP configs
    php56_root=$(brew info php@5.6 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')

    if [[ -f "${php56_root}/bin/php" ]]; then
        alias php56="${php56_root}/bin/php"
        alias pecl56="${php56_root}/bin/pecl"
    fi

    php70_root=$(brew info php@7.0 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')
    
    if [[ -f "${php70_root}/bin/php" ]]; then
        alias php70="${php70_root}/bin/php"
        alias pecl70="${php70_root}/bin/pecl"
    fi
    
    php71_root=$(brew info php@7.1 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')
    
    if [[ -f "${php71_root}/bin/php" ]]; then
        alias php71="${php71_root}/bin/php"
        alias pecl71="${php71_root}/bin/pecl"
    fi
    
    php72_root=$(brew info php@7.2 | grep -e '/usr/local/Cellar' | awk '{ print $1 }')
    
    if [[ -f "${php72_root}/bin/php" ]]; then
        alias php72="${php72_root}/bin/php"
        alias pecl72="${php72_root}/bin/pecl"
    fi
    export VHOSTS_DIR="/usr/local/etc/httpd/extra/vhosts"
    export APACHE_DIR="/usr/local/etc/httpd"
fi

alias em.vhosts="emacsclient -c ${VHOSTS_DIR}"
alias em.apache="emacsclient -c ${APACHE_DIR}/httpd.conf"

# Check apache error logs + access logs
alias tail.apache.error="tail -f /usr/local/var/log/httpd/error_log"
alias tail.apache.access="tail -f /usr/local/var/log/httpd/access_log"


alias em.ssh="emacsclient -c $HOME/.ssh/config"
alias sd="npm run syncdb"
alias cd.ur="cd $UNION_REPOS"

# Aceyus
alias cd.aceyus="cd ${UNION_REPOS}/aceyus-com"
alias ssh.aceyus="ssh aceyus@aceyus.com"

# Cooke & Bieler
alias cd.cooke="cd $UNION_REPOS/cooke-bieler-com"
alias ssh.cooke="ssh cookebieler@vps2.union.co"

# Discovery Place
alias cd.disc="cd ${UNION_REPOS}/discoveryplace-v3"
alias ssh.disc="ssh discoveryplace@vps1.discoveryplace.union.co"
alias ssh.root.disc="ssh root@vps1.discoveryplace.union.co"

# Entec
alias cd.entec="cd ${UNION_REPOS}/entecpolymers-com"
alias ssh.entec="ssh entec-prod"
alias ssh.entec.staging="ssh entec-staging"

# VPS2 Root Access
alias ssh.root.vps2="ssh root@vps2.union.co"

# American Forest Management
alias ssh.afm="ssh americanforestma@americanforestmanagement.com"
alias ssh.afm.root="ssh root@americanforestmanagement.com"
alias cd.afm="cd ${UNION_REPOS}/american-forest-management"

# SATO America
alias ssh.sato="ssh satoamerica@satoamerica.com"
alias cd.sato="cd ${UNION_REPOS}/satoamerica-com"

# Hendrick Motorsports
alias cd.hendrick="cd ${UNION_REPOS}/hendrick-motorsports-2015"
alias ssh.hendrick="ssh hendrick2017@hendrickmotorsports.com"
alias ssh.hendrick.root="ssh root@hendrickmotorsports.com"

# Highwoods
alias cd.highwoods="cd ${UNION_REPOS}/highwoods-com"
alias ssh.highwoods="ssh highwoods@highwoods.union.agency"
alias ssh.highwoods.vps1.root="ssh root@vps1.highwoods.union.co"
alias ssh.highwoods.vps2.root="ssh root@vps2.highwoods.union.co"
alias ssh.highwoods.vps3.root="ssh root@vps3.highwoods.union.co"

# Pamlico
alias cd.pamlico="cd ${UNION_REPOS}/craft-pamlicocapital-com"
alias ssh.pamlico="ssh pamlicocapital@vps2.union.co"

# Vanguard Cleaning
alias cd.vanguard="cd ${UNION_REPOS}/vanguard-cleaning"
alias ssh.vanguard.staging="ssh web@vanguardcleaning.union.agency"
