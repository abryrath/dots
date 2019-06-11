set fish_user_paths $HOME/.local/bin $PATH
if not type -q fisher
    echo "Fisher not found, installing..."
    curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
    # source $HOME/.config/fish/config.fish
    echo "Finished"
end
if not type -q bass
    echo "bass not installed..., to install:"
    echo "  fisher add edc/bass"
    #fisher add edc/bass
    #echo "Finished"
end

#if type -q bass
#    bass source ~/.aliases
#end
for func in ~/.config/fish/user-functions/*
# 	echo "Loading $func"
	source $func
end

