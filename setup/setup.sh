#!/bin/bash
# Note: please run this file with sudo command or run as Root user
# Note: this script is designed for Ubuntu

WORK_DIR=s3-examples
ROOT_TO_WORK_DIR=/opt/$WORK_DIR
UBUNTU_USER_DIR=/home/ubuntu

## Change CD to WORK_DIR in ubuntu
cd $HOME/$WORK_DIR

## Install dependencies
npm install

## Remove old install on /opt
sudo rm -r $ROOT_TO_WORK_DIR

## Copy to /opt
cd ~
sudo cp -R $UBUNTU_USER_DIR/$WORK_DIR $WORK_DIR /opt
cd $ROOT_TO_WORK_DIR

## Setup services
sudo sed -i "s|NODE_PATH|$(which node)|g" $ROOT_TO_WORK_DIR/setup/s3examples.service
sudo cp $ROOT_TO_WORK_DIR/setup/s3examples.service /etc/systemd/system

## Start service
sudo systemctl daemon-reload
sudo systemctl start s3examples.service

## Enable service
sudo systemctl enable s3examples.service

## Check status
sudo systemctl status s3examples.service