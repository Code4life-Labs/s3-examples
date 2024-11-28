#!/bin/bash
# Note: please run this file with sudo command
# Note: this script is designed for Ubuntu

WORK_DIR=s3-examples
ROOT_TO_WORK_DIR=/opt/$WORK_DIR

## Move to /opt
cd /opt

## Get new version of application from github
git clone https://github.com/Code4life-Labs/s3-examples.git
cd $WORK_DIR

## Install dependencies
npm install

## Setup services
cp $ROOT_TO_WORK_DIR/setup/s3examples.service > /etc/systemd/system

## Start service
systemctl daemon-reload
systemctl start s3examples.service

## Enable service
systemctl enable s3examples.service

## Check status
systemctl status s3examples.service