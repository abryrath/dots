# fish completion for craft cms cli
# @author abry rath <abryrath@gmail.com>

function __craft_complete
    if not test "$__craft_complete"
        set -g __craft_complete (php craft | grep -Eo '^[[:space:]]{4}([[:alpha:]|/|\-]+)' | sed 's: ::g')
    end
    printf "%s\n" $__craft_complete
end

function __fish_craft_using_command
    set -l cmd (__fish_craft_needs_command)
    test -z "$cmd"
    and return 1
    contains -- $cmd $argv
    and return 0
end

function __fish_craft_needs_command
    set -l opts c-craft
    set cmd (commandline -opc)
    set -e cmd[1]
    argparse -s $opts -- $cmd 2>/dev/null
    or return 0
    if set -q argv[1]
        echo $argv[1]
        return 1
    end
    return 0
end

complete -f -c php -n '__fish_craft_using_command craft' -a '(__craft_complete)'