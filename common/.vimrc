set runtimepath+=~/.vim_runtime
set modelines=1

source ~/.vim/autoload/plug.vim
call plug#begin('~/.vim/plugged')
Plug 'tpope/vim-sensible'
Plug 'connorholyday/vim-snazzy'
" Plug 'vim-airline/vim-airline'
" Plug 'vim-airline/vim-airline-themes'
Plug 'dag/vim-fish'
Plug 'StanAngeloff/php.vim'
Plug 'arnaud-lb/vim-php-namespace'
Plug 'kjssad/quantum.vim'
call plug#end()

set termguicolors
set background=dark
colorscheme quantum
