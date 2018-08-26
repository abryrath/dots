# Found on the ZshWiki
#  http://zshwiki.org/home/config/prompt
#

ZSH_THEME_GIT_PROMPT_PREFIX="%{$reset_color%}%{$fg[cyan]%}["
ZSH_THEME_GIT_PROMPT_SUFFIX="]%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[red]%}*%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=""

# Customized git status, oh-my-zsh currently does not allow render dirty status before branch
git_custom_status() {
  local cb=$(git_current_branch)
  if [ -n "$cb" ]; then
    echo "$(parse_git_dirty)$ZSH_THEME_GIT_PROMPT_PREFIX$(git_current_branch)$ZSH_THEME_GIT_PROMPT_SUFFIX"
  fi
}


PROMPT="%{$fg[blue]%}%n%{$reset_color%} %{$fg[green]%}%~ %{$reset_color%}% $(git_custom_status) "
#unset RPROMPT
#RPROMPT='$(git_custom_status)'
