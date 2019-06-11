# spctl
# Autogenerated from man page /Library/Developer/CommandLineTools/SDKs/MacOSX10.14.sdk/usr/share/man/man8/spctl.8
complete -c spctl -l add --description 'Add rule(s) to the system-wide assessment rule database.'
complete -c spctl -s a --description 'Requests that spctl perform an assessment on the files given.'
complete -c spctl -l disable --description 'Disable one or more rules in the assessment rule database.'
complete -c spctl -l enable --description 'Enable rule(s) in the assessment rule database, counteracting earlier disabli…'
complete -c spctl -l master-disable --description 'Disable the assessment subsystem altogether.'
complete -c spctl -l master-enable --description 'Enable the assessment subsystem.'
complete -c spctl -l remove --description 'Remove rule(s) from the assessment rule database.'
complete -c spctl -l status --description 'Query whether the assessment subsystem is enabled or disabled.'
complete -c spctl -l anchor --description 'In rule update operations, indicates that the arguments are hashes of anchor …'
complete -c spctl -l continue --description 'If the assessment of a file fails, continue assessing additional file argumen…'
complete -c spctl -l hash --description 'In rule update operations, indicates that the arguments are code directory ha…'
complete -c spctl -l ignore-cache --description 'Do not query or use the assessment object cache.'
complete -c spctl -l label --description 'Specifies a string label to attach to new rules, or find in existing rules.'
complete -c spctl -l no-cache --description 'Do not place the outcome of any assessments into the assessment object cache.'
complete -c spctl -l path --description 'In rule update operations, indicates that the argument(s) denote paths to fil…'
complete -c spctl -l priority --description 'In rule update operations, specifies the priority of the rule(s) created or c…'
complete -c spctl -l raw --description 'When displaying the outcome of an assessment, write it as a \\&"raw\\&" XML pli…'
complete -c spctl -l requirement --description 'In rule update operations, indicates that the argument(s) are code requiremen…'
complete -c spctl -l reset-default --description 'Unconditionally reset the system policy database to its default value.'
complete -c spctl -l rule --description 'In rule update operations, indicates that the argument(s) are the index numbe…'
complete -c spctl -s t --description 'Specify which type of assessment is desired: execute to assess code execution…'
complete -c spctl -s v --description 'Requests more verbose output.'
