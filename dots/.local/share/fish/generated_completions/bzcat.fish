# bzcat
# Autogenerated from man page /Library/Developer/CommandLineTools/SDKs/MacOSX10.14.sdk/usr/share/man/man1/bzcat.1
complete -c bzcat -s c -l stdout --description 'Compress or decompress to standard output.'
complete -c bzcat -s d -l decompress --description 'Force decompression.'
complete -c bzcat -s z -l compress --description 'The complement to -d: forces compression, regardless of the invocation name.'
complete -c bzcat -s t -l test --description 'Check integrity of the specified file(s), but don\'t decompress them.'
complete -c bzcat -s f -l force --description 'Force overwrite of output files.'
complete -c bzcat -s k -l keep --description 'Keep (don\'t delete) input files during compression or decompression.'
complete -c bzcat -s s -l small --description 'Reduce memory usage, for compression, decompression and testing.'
complete -c bzcat -s q -l quiet --description 'Suppress non-essential warning messages.'
complete -c bzcat -s v -l verbose --description 'Verbose mode -- show the compression ratio for each file processed.'
complete -c bzcat -s L -l license -s V -l version --description 'Display the software version, license terms and conditions.'
complete -c bzcat -s 1 -l fast -s 9 -l best --description 'Set the block size to 100 k, 200 k .   900 k when compressing.'
complete -c bzcat -l repetitive-fast -l repetitive-best --description 'These flags are redundant in versions 0. 9. 5 and above.'
complete -c bzcat -o vvvv --description '.'
