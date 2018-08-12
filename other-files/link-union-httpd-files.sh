#!/usr/bin/env bash

if [[ -f "${APACHE_DIR}/httpd.conf" ]]; then
    mv "${APACHE_DIR}/httpd.conf" "${APACHE_DIR}/httpd.conf.bak"
fi

ln -s "${PWD}/httpd.conf.union" "${APACHE_DIR}/httpd.conf"

if [[ -d "${VHOSTS_DIR}" ]]; then
    mv $"${VHOSTS_DIR}" "${VHOSTS_DIR}.bak"
fi

ln -s "${PWD}/vhosts" "${VHOSTS_DIR}"
