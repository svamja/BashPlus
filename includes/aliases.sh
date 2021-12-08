
if [[ "$OSTYPE" == "darwin"* ]]; then
    export CLICOLOR=1
    export LSCOLORS=ExFxBxDxCxegedabagacad
else
    alias ls='ls --color=auto'
fi

alias rm='rm -i'
alias llh='ls -ltrh'
alias dusort='du -sm * | sort -n'
alias gg='git gui &'
alias node2='node --experimental-repl-await'
