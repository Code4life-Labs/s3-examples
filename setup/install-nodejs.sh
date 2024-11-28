#!/bin/bash
# Note: please run this file with sudo command
# Note: this script is designed for Ubuntu

## Get install script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

## Env for nvm, node and npm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

## Install NodeJS
nvm install 22

## Check result
node -v
npm -v