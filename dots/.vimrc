set runtimepath+=~/.vim_runtime
set modelines=1

source ~/.vim/autoload/plug.vim
call plug#begin('~/.vim/plugged')
Plug 'tpope/vim-sensible'
Plug 'connorholyday/vim-snazzy'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'dag/vim-fish'
Plug 'StanAngeloff/php.vim'
Plug 'arnaud-lb/vim-php-namespace'
call plug#end()


" source ~/.vim_runtime/vimrcs/basic.vim
" source ~/.vim_runtime/vimrcs/filetypes.vim
" source ~/.vim_runtime/vimrcs/plugins_config.vim
" source ~/.vim_runtime/vimrcs/extended.vim

" try
" source ~/.vim_runtime/my_configs.vim
" catch
" endtry
