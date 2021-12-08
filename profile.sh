#!/bin/bash

REPO_PATH="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

SCRIPT_PATH=$REPO_PATH/profile.sh

export PATH=$PATH:.:$REPO_PATH/bin:/usr/local/sbin

# export LC_ALL="en_US.UTF-8"

# History Control
export HISTSIZE=1000
export HISTCONTROL=ignoreboth:erasedups
export histdup='all'

# Aliases
source $REPO_PATH/includes/aliases.sh

# cd function "cd --"
source $REPO_PATH/includes/cd_function.sh

# Decent Prompt
export PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\h\[\033[01;34m\] \w \$\[\033[00m\] '

# Git aliases, if Git is present
if which git > /dev/null 2>&1; then
    source $REPO_PATH/includes/git_aliases.sh
fi 


