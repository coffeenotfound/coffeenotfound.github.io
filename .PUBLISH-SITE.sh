#!/bin/bash

#echo "Enter confirm code: z61cm8"
#read SECTEST
#if [[ SECTEST != "z61cm8" ]]; then
#	echo "error: Invalid confirm code"
#	exit
#fi


if [[ -z "$1" ]]; then
	echo "error: Please enter a git commit message"
	sleep 2
	exit
fi

jekyll build && \
	cd _site && \
	git add . && \
	git commit -m "$1" && \
	git push origin master && \
	cd .. && \
	echo "Successfully built site and pushed to origin/master"

sleep 2