set fish_user_paths $HOME/.local/bin $PATH
if not type -q fisher
    echo "Fisher not found, installing..."
    curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
    echo "Finished"
end
if not type -q bass
    echo "bass not installed..., to install:"
    echo "  fisher add edc/bass"
    #fisher add edc/bass
    #echo "Finished"
end

# prompts
# fisher add matchai/spacefish
# fisher add fishpkg/fish-prompt-metro

if type -q bass
    bass source ~/.aliases
end

set -U EDITOR vim
set -U VISUAL code