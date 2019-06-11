function alacritty-colorschemes
	set arg1 $argv[1]
	if test "$arg1" = "day"
		set theme pencil_light
	else if test "$arg1" = "night"
		set theme snazzy
	else
		set theme $arg1
	end

	_alacritty-colorscheme -C $HOME/.config/alacritty/colors/themes -a $theme.yaml
end
