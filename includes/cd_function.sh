# modified version of cd_function by petar marinov (http:/geocities.com/h2428)
# it saves the history in a file and restore it on login

cd_function()
{
  local x2 the_new_dir adir index
  local -i cnt

  if [[ $1 ==  "--" ]]; then
    dirs -v
    return 0
  fi

  the_new_dir=$1
  [[ -z $1 ]] && the_new_dir=$HOME

  if [[ ${the_new_dir:0:1} == '-' ]]; then
    #
    # Extract dir N from dirs
    index=${the_new_dir:1}
    [[ -z $index ]] && index=1
    adir=$(dirs +$index)
    [[ -z $adir ]] && return 1
    the_new_dir=$adir
  fi

  #
  # '~' has to be substituted by ${HOME}
  [[ ${the_new_dir:0:1} == '~' ]] && the_new_dir="${HOME}${the_new_dir:1}"

  #
  # Now change to the new dir and add to the top of the stack
  pushd "${the_new_dir}" > /dev/null
  [[ $? -ne 0 ]] && return 1
  the_new_dir=$(pwd)

  #
  # Trim down everything beyond 16th entry
  popd -n +16 2>/dev/null 1>/dev/null

  #
  # Remove any other occurence of this dir, skipping the top of the stack
  for ((cnt=1; cnt <= 15; cnt++)); do
    x2=$(dirs +${cnt} 2>/dev/null)
    [[ $? -ne 0 ]] && return 0
    [[ ${x2:0:1} == '~' ]] && x2="${HOME}${x2:1}"
    if [[ "${x2}" == "${the_new_dir}" ]]; then
      popd -n +$cnt 2>/dev/null 1>/dev/null
      cnt=cnt-1
    fi
  done

  return 0
}

alias cd=cd_function

if [[ $BASH_VERSION > "2.05a" ]]; then
  # ctrl+w shows the menu
  bind -x "\"\C-w\":cd_function -- ;"
fi


DIR_HIST_FILE=$HOME/.dir_history

# On Exit - Save to File
exit_function ()
{
    dirs > $DIR_HIST_FILE
    exit 0;
}
alias exit=exit_function
alias logout=exit_function

# On Startup - Read from File
append_path=0
if [ "$PWD" != "$HOME" ]; then
    append_path=1
    path_to_append="$PWD"
fi;

if [ -r $DIR_HIST_FILE ]; then
    reverse_dirs_list=""
    for d in `cat $DIR_HIST_FILE`; do
        reverse_dirs_list="$d $reverse_dirs_list";
    done;
    for d in $reverse_dirs_list; do
        cd $d;
    done;
    if [ $append_path -eq 1 ]; then
        cd $path_to_append;
    fi;
fi




