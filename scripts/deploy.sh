#!/bin/bash

cd build;

find . -type f -exec curl -u ${FTP_USERNAME}:${FTP_PASSWORD} --ftp-create-dirs -T {} ftp://${FTP_HOST}/{} \;