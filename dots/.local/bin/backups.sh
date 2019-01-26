#!/usr/bin/env bash

function sites() {
    options=("disc - discoveryplace.org" "hendrick - hendrickmotorsports.com")
    echo "Available sites:"
    for i in ${!options[*]}; do
        printf "\t$i: ${options[$i]}\n"
    done
}

function help() {
    echo "Usage: $0 -s SITE [ -d BACKUP_DATE ] [ -m DEST_DIR ] [ -v ]" 1>&2
    sites    
}

function exitOnFailure() {
    RETURN_CODE=$1
    if [ $RETURN_CODE -ne 0 ]; then
        echo "Error code $RETURN_CODE" 
        exit 1
    fi
}

function downloadBackup() {
    date=$1
    account=$2
    sqlPath=$3
    sqlFile=$4
    ssh=$5
    destDir=$6

    echo "Extracting SQL file from backup..."
    ssh $ssh tar -xf "/backup/${date}/accounts/$account" "${sqlPath}${sqlFile}" --strip-components=2
    exitOnFailure $?

    echo "Compressing SQL file..."
    ssh $ssh tar czvf ${sqlFile}.tar.gz ${sqlFile}
    exitOnFailure $?

    echo "Downloading SQL file..."
    scp $ssh:$sqlFile.tar.gz ${destDir}
    exitOnFailure $?

    echo "Removing file from remote server"
    ssh $ssh rm $sqlFile.tar.gz $sqlFile
    exitOnFailure $?
    echo "File is now available: ${destDir}/${sqlFile}.tar.gz"
}

SITE=""
BACKUP_DATE=""
DEST_DIR="./"

while getopts "s:d:vm:" options; do
    case "${options}" in
        s)
            SITE=${OPTARG}
            ;;
        d)
            BACKUP_DATE=${OPTARG}
            ;;
        m)
            DEST_DIR=${OPTARG}
            ;;
        v)
            set -x
            ;;
    esac
done

if [ $BACKUP_DATE = "" ]; then
    BACKUP_DATE=$(date "+%Y-%m-%d" -d "1 day ago")
fi

case ${SITE} in
    "disc")
        downloadBackup ${BACKUP_DATE} "discoveryplace.tar.gz" "discoveryplace/mysql/" "discovery_place.sql" "root@vps1.discoveryplace.union.co" ${DEST_DIR}
        ;;
    "hendrick")
        downloadBackup ${BACKUP_DATE} "hendrick2017.tar.gz" "hendrick2017/mysql/" "hendrick2017_prod.sql" "root@hendrickmotorsports.com" ${DEST_DIR}
        ;;
    *)
        help
        exit
    ;;
esac