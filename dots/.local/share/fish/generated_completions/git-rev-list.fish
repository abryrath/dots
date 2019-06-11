# git-rev-list
# Autogenerated from man page /Library/Developer/CommandLineTools/usr/share/man/man1/git-rev-list.1
complete -c git-rev-list -o '<number>' -s n -l max-count --description 'Limit the number of commits to output.'
complete -c git-rev-list -l skip --description 'Skip number commits before starting to show the commit output.'
complete -c git-rev-list -l since -l after --description 'Show commits more recent than a specific date.'
complete -c git-rev-list -l until -l before --description 'Show commits older than a specific date.'
complete -c git-rev-list -l max-age -l min-age --description 'Limit the commits output to specified time range.'
complete -c git-rev-list -l author -l committer --description 'Limit the commits output to ones with author/committer header lines that matc…'
complete -c git-rev-list -l grep-reflog --description 'Limit the commits output to ones with reflog entries that match the specified…'
complete -c git-rev-list -l grep --description 'Limit the commits output to ones with log message that matches the specified …'
complete -c git-rev-list -l all-match --description 'Limit the commits output to ones that match all given --grep, instead of ones…'
complete -c git-rev-list -l invert-grep --description 'Limit the commits output to ones with log message that do not match the patte…'
complete -c git-rev-list -s i -l regexp-ignore-case --description 'Match the regular expression limiting patterns without regard to letter case.'
complete -c git-rev-list -l basic-regexp --description 'Consider the limiting patterns to be basic regular expressions; this is the d…'
complete -c git-rev-list -s E -l extended-regexp --description 'Consider the limiting patterns to be extended regular expressions instead of …'
complete -c git-rev-list -s F -l fixed-strings --description 'Consider the limiting patterns to be fixed strings (don\\(cqt interpret patter…'
complete -c git-rev-list -s P -l perl-regexp --description 'Consider the limiting patterns to be Perl-compatible regular expressions.'
complete -c git-rev-list -l remove-empty --description 'Stop when a given path disappears from the tree.'
complete -c git-rev-list -l merges --description 'Print only merge commits.  This is exactly the same as --min-parents=2.'
complete -c git-rev-list -l no-merges --description 'Do not print commits with more than one parent.'
complete -c git-rev-list -l min-parents -l max-parents -l no-min-parents -l no-max-parents --description 'Show only commits which have at least (or at most) that many parent commits.'
complete -c git-rev-list -l first-parent --description 'Follow only the first parent commit upon seeing a merge commit.'
complete -c git-rev-list -l not --description 'Reverses the meaning of the ^ prefix (or lack thereof) for all following revi…'
complete -c git-rev-list -l all --description 'Pretend as if all the refs in refs/, along with HEAD, are listed on the comma…'
complete -c git-rev-list -l branches --description 'Pretend as if all the refs in refs/heads are listed on the command line as <c…'
complete -c git-rev-list -l tags --description 'Pretend as if all the refs in refs/tags are listed on the command line as <co…'
complete -c git-rev-list -l remotes --description 'Pretend as if all the refs in refs/remotes are listed on the command line as …'
complete -c git-rev-list -l glob --description 'Pretend as if all the refs matching shell glob <glob-pattern> are listed on t…'
complete -c git-rev-list -l exclude --description 'Do not include refs matching <glob-pattern> that the next --all, --branches, …'
complete -c git-rev-list -l reflog --description 'Pretend as if all objects mentioned by reflogs are listed on the command line…'
complete -c git-rev-list -l single-worktree --description 'By default, all working trees will be examined by the following options when …'
complete -c git-rev-list -l ignore-missing --description 'Upon seeing an invalid object name in the input, pretend as if the bad input …'
complete -c git-rev-list -l stdin --description 'In addition to the <commit> listed on the command line, read them from the st…'
complete -c git-rev-list -l quiet --description 'Don\\(cqt print anything to standard output.'
complete -c git-rev-list -l cherry-mark --description 'Like --cherry-pick (see below) but mark equivalent commits with = rather than…'
complete -c git-rev-list -l cherry-pick --description 'Omit any commit that introduces the same change as another commit on the \\(lq…'
complete -c git-rev-list -l left-only -l right-only --description 'List only commits on the respective side of a symmetric difference, i. e.'
complete -c git-rev-list -l cherry --description 'A synonym for --right-only --cherry-mark --no-merges; useful to limit the out…'
complete -c git-rev-list -s g -l walk-reflogs --description 'Instead of walking the commit ancestry chain, walk reflog entries from the mo…'
complete -c git-rev-list -l merge --description 'After a failed merge, show refs that touch files having a conflict and don\\(c…'
complete -c git-rev-list -l boundary --description 'Output excluded boundary commits.  Boundary commits are prefixed with -.'
complete -c git-rev-list -l use-bitmap-index --description 'Try to speed up the traversal using the pack bitmap index (if one is availabl…'
complete -c git-rev-list -l progress --description 'Show progress reports on stderr as objects are considered.'
complete -c git-rev-list -l simplify-by-decoration --description 'Commits that are referred by some branch or tag are selected.'
complete -c git-rev-list -l full-history --description 'Same as the default mode, but does not prune some history.'
complete -c git-rev-list -l dense --description 'Only the selected commits are shown, plus some to have a meaningful history.'
complete -c git-rev-list -l sparse --description 'All commits in the simplified history are shown.'
complete -c git-rev-list -l simplify-merges --description 'Additional option to --full-history to remove some needless merges from the r…'
complete -c git-rev-list -l ancestry-path --description 'When given a range of commits to display (e. g.  commit1.'
complete -c git-rev-list -l bisect --description 'Limit output to the one commit object which is roughly halfway between includ…'
complete -c git-rev-list -l bisect-vars --description 'This calculates the same as --bisect, except that refs in refs/bisect/ are no…'
complete -c git-rev-list -l bisect-all --description 'This outputs all the commit objects between the included and excluded commits…'
complete -c git-rev-list -l date-order --description 'Show no parents before all of its children are shown, but otherwise show comm…'
complete -c git-rev-list -l author-date-order --description 'Show no parents before all of its children are shown, but otherwise show comm…'
complete -c git-rev-list -l topo-order --description 'Show no parents before all of its children are shown, and avoid showing commi…'
complete -c git-rev-list -l reverse --description 'Output the commits chosen to be shown (see Commit Limiting section above) in …'
complete -c git-rev-list -l objects --description 'Print the object IDs of any object referenced by the listed commits.'
complete -c git-rev-list -l in-commit-order --description 'Print tree and blob ids in order of the commits.'
complete -c git-rev-list -l objects-edge --description 'Similar to --objects, but also print the IDs of excluded commits prefixed wit…'
complete -c git-rev-list -l objects-edge-aggressive --description 'Similar to --objects-edge, but it tries harder to find excluded commits at th…'
complete -c git-rev-list -l indexed-objects --description 'Pretend as if all trees and blobs used by the index are listed on the command…'
complete -c git-rev-list -l unpacked --description 'Only useful with --objects; print the object IDs that are not in packs.'
complete -c git-rev-list -l filter --description 'Only useful with one of the --objects*; omits objects (usually blobs) from th…'
complete -c git-rev-list -l no-filter --description 'Turn off any previous --filter= argument.'
complete -c git-rev-list -l filter-print-omitted --description 'Only useful with --filter=; prints a list of the objects omitted by the filte…'
complete -c git-rev-list -l missing --description 'A debug option to help with future "partial clone" development.'
complete -c git-rev-list -l exclude-promisor-objects --description '(For internal use only. ) Prefilter object traversal at promisor boundary.'
complete -c git-rev-list -l no-walk --description 'Only show the given commits, but do not traverse their ancestors.'
complete -c git-rev-list -l do-walk --description 'Overrides a previous --no-walk.'
complete -c git-rev-list -l pretty -l format --description 'Pretty-print the contents of the commit logs in a given format, where <format…'
complete -c git-rev-list -l abbrev-commit --description 'Instead of showing the full 40-byte hexadecimal commit object name, show only…'
complete -c git-rev-list -l no-abbrev-commit --description 'Show the full 40-byte hexadecimal commit object name.'
complete -c git-rev-list -l oneline --description 'This is a shorthand for "--pretty=oneline --abbrev-commit" used together.'
complete -c git-rev-list -l encoding --description 'The commit objects record the encoding used for the log message in their enco…'
complete -c git-rev-list -l expand-tabs -l expand-tabs -l no-expand-tabs --description 'Perform a tab expansion (replace each tab with enough spaces to fill to the n…'
complete -c git-rev-list -l show-signature --description 'Check the validity of a signed commit object by passing the signature to gpg …'
complete -c git-rev-list -l relative-date --description 'Synonym for --date=relative.'
complete -c git-rev-list -l date --description 'Only takes effect for dates shown in human-readable format, such as when usin…'
complete -c git-rev-list -l header --description 'Print the contents of the commit in raw-format; each record is separated with…'
complete -c git-rev-list -l parents --description 'Print also the parents of the commit (in the form "commit parent. ").'
complete -c git-rev-list -l children --description 'Print also the children of the commit (in the form "commit child. ").'
complete -c git-rev-list -l timestamp --description 'Print the raw commit timestamp.'
complete -c git-rev-list -l left-right --description 'Mark which side of a symmetric difference a commit is reachable from.'
complete -c git-rev-list -l graph --description 'Draw a text-based graphical representation of the commit history on the left …'
complete -c git-rev-list -l show-linear-break --description 'When --graph is not used, all history branches are flattened which can make i…'
complete -c git-rev-list -l count --description 'Print a number stating how many commits would have been listed, and suppress …'
complete -c git-rev-list -s 1 --description '(negative numbers denote no upper limit).'
complete -c git-rev-list -l 'no-merges;' --description 'git log --cherry upstream. mybranch, similar to git cherry upstream mybranch.'
complete -c git-rev-list -l 'objects;' --description '.'
complete -c git-rev-list -l 'objects*;' --description '<filter-spec> may be one of the following:.'
complete -c git-rev-list -o local --description 'is appended to the format (e. g.'
complete -c git-rev-list -l raw --description '.'
complete -c git-rev-list -l no-abbrev --description 'oc o 2. 3.'
complete -c git-rev-list -l color --description 'auto settings of the former if we are going to a terminal).  %C(auto,.'
complete -c git-rev-list -l unfold --description 'option was given.  E. g. , %(trailers:only,unfold) to do both.'
