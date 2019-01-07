# Found on the ZshWiki
#  http://zshwiki.org/home/config/prompt
#

#ZSH_THEME_GIT_PROMPT_PREFIX="%{$reset_color%}%{$fg[cyan]%}["
#ZSH_THEME_GIT_PROMPT_SUFFIX="]%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[red]%}*%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=""

hostname() {
  if [ -f /bin/hostname ]; then echo $(/bin/hostname);
  else; echo $(/usr/bin/hostname);fi
}	
# Customized git status, oh-my-zsh currently does not allow render dirty status before branch
git_custom_status() {
  local cb=$(git_current_branch)
  if [ -n "$cb" ]; then
    echo "%{$reset_color%} $(parse_git_dirty) %{$fg[cyan]%}% $(git_current_branch) %{$reset_color%}"
  fi
}

PROMPT="%{$reset_color%} %{$fg[green]%}% [$(hostname)] %{$reset_color%} %{$fg[blue]%}%~ %{$reset_color%} %{$fg[white]%}%"
#unset RPROMPT
echo $TERM | grep -ie 'xterm' > /dev/null
if [ $? -eq 0 ]; then
  RPROMPT='%{$reset_color%}$(git_custom_status)'
else
  unset RPROMPT
fi
