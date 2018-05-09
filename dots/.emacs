;;; package --- Summary:
;;; Commentary:
;;; Code:

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(column-number-mode t)
 '(custom-enabled-themes '(dracula))
 '(custom-safe-themes
   (quote
    ("3eb93cd9a0da0f3e86b5d932ac0e3b5f0f50de7a0b805d4eb1f67782e9eb67a4" "256a381a0471ad344e1ed33470e4c28b35fb4489a67eb821181e35f080083c36" "b181ea0cc32303da7f9227361bb051bbb6c3105bb4f386ca22a06db319b08882" "66aea5b7326cf4117d63c6694822deeca10a03b98135aaaddb40af99430ea237" "003a9aa9e4acb50001a006cfde61a6c3012d373c4763b48ceb9d523ceba66829" "251348dcb797a6ea63bbfe3be4951728e085ac08eee83def071e4d2e3211acc3" "96998f6f11ef9f551b427b8853d947a7857ea5a578c75aa9c4e7c73fe04d10b4" "732b807b0543855541743429c9979ebfb363e27ec91e82f463c91e68c772f6e3" "da538070dddb68d64ef6743271a26efd47fbc17b52cc6526d932b9793f92b718" "a24c5b3c12d147da6cef80938dca1223b7c7f70f2f382b26308eba014dc4833a" "0cd56f8cd78d12fc6ead32915e1c4963ba2039890700458c13e12038ec40f6f5" "1b27e3b3fce73b72725f3f7f040fd03081b576b1ce8bbdfcb0212920aec190ad" "e11569fd7e31321a33358ee4b232c2d3cf05caccd90f896e1df6cab228191109" "c616e584f7268aa3b63d08045a912b50863a34e7ea83e35fcab8537b75741956" "b571f92c9bfaf4a28cb64ae4b4cdbda95241cd62cf07d942be44dc8f46c491f4" "9b1c580339183a8661a84f5864a6c363260c80136bd20ac9f00d7e1d662e936a" "b59d7adea7873d58160d368d42828e7ac670340f11f36f67fa8071dbf957236a" "938d8c186c4cb9ec4a8d8bc159285e0d0f07bad46edf20aa469a89d0d2a586ea" "e9776d12e4ccb722a2a732c6e80423331bcb93f02e089ba2a4b02e85de1cf00e" "e0c66085db350558f90f676e5a51c825cb1e0622020eeda6c573b07cb8d44be5" "3cd28471e80be3bd2657ca3f03fbb2884ab669662271794360866ab60b6cb6e6" "ed317c0a3387be628a48c4bbdb316b4fa645a414838149069210b66dd521733f" "c48551a5fb7b9fc019bf3f61ebf14cf7c9cdca79bcb2a4219195371c02268f11" "b3775ba758e7d31f3bb849e7c9e48ff60929a792961a2d536edec8f68c671ca5" "9b59e147dbbde5e638ea1cde5ec0a358d5f269d27bd2b893a0947c4a867e14c1" "72a81c54c97b9e5efcc3ea214382615649ebb539cb4f2fe3a46cd12af72c7607" "b9e9ba5aeedcc5ba8be99f1cc9301f6679912910ff92fdf7980929c2fc83ab4d" "c74e83f8aa4c78a121b52146eadb792c9facc5b1f02c917e3dbb454fca931223" "84d2f9eeb3f82d619ca4bfffe5f157282f4779732f48a5ac1484d94d5ff5b279" "3c83b3676d796422704082049fc38b6966bcad960f896669dfc21a7a37a748fa" "721bb3cb432bb6be7c58be27d583814e9c56806c06b4077797074b009f322509" "946e871c780b159c4bb9f580537e5d2f7dba1411143194447604ecbaf01bd90c" "ff7625ad8aa2615eae96d6b4469fcc7d3d20b2e1ebc63b761a349bebbb9d23cb" "4259044d43659fe0f7a89aec142728a1f53eeaf24bbec673346d9592ef4e7b1b" "73a13a70fd111a6cd47f3d4be2260b1e4b717dbf635a9caee6442c949fad41cd" "1db337246ebc9c083be0d728f8d20913a0f46edc0a00277746ba411c149d7fe5" default)))
 '(default nil)
 '(package-selected-packages
   (quote
    (vue-mode material-theme markdown-mode+ flymd apache-mode zenburn-theme buffer-move matlab-mode sublime-themes systemd csv-mode w3m fish-mode ini-mode smart-mode-line-powerline-theme smart-mode-line dracula-theme auctex rjsx-mode flymake-jshint treemacs gulp-task-runner multi-term vcl-mode json-mode docker-compose-mode dockerfile-mode flymake-php editorconfig ample-zen-theme python-pylint web-mode s rust-mode robe python-mode python-django projectile php+-mode paredit magit lua-mode helm flycheck elixir-mode company cider ample-theme airline-themes))))

(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:background nil)))))
(tool-bar-mode -1)
;;(set-face-attribute 'default t :font "Inconsolata for Powerline-10")

;; disable lockfiles
;; see http://www.gnu.org/software/emacs/manual/html_node/emacs/Interlocking.html
(setq create-lockfiles nil)

;; store all backup files in the tmp dir
;; http://www.gnu.org/software/emacs/manual/html_node/emacs/Backup-Names.html
(setq backup-directory-alist
      `((".*" . ,temporary-file-directory)))

;; No tabs
(setq-default indent-tabs-mode nil)

;; store all autosave files in the tmp dir
;; http://www.gnu.org/software/emacs/manual/html_node/emacs/Auto-Save-Files.html
(setq auto-save-file-name-transforms
      `((".*" ,temporary-file-directory t)))

;; autosave the undo-tree history
(setq undo-tree-history-directory-alist
      `((".*" . ,temporary-file-directory)))
(setq undo-tree-auto-save-history t)


(if window-system (tool-bar-mode -1))
;;(global-linum-mode t)
(column-number-mode 1)
;; (server-start)

;; Load packages/repos

;; Added by Package.el.  This must come before configurations of
;; installed packages.  Don't delete this line.  If you don't want it,
;; just comment it out by adding a semicolon to the start of the line.
;; You may delete these explanatory comments.
;;(package-initialize)

(load "~/.emacs.d/my-packages.el")
(load "~/.emacs.d/my-load-packages.el")

;; terminal settings
(require 'multi-term)
(if
    (file-exists-p "/usr/bin/zsh")
    (setq multi-term-program "/usr/bin/zsh")
  (setq multi-term-program "/bin/zsh"))

(add-to-list 'custom-theme-load-path ".emacs.d/")
(require 'material-theme)
(load-theme 'material)
(require 'airline-themes)
(load-theme 'airline-powerlineish)

;; Window movement
(load "~/.emacs.d/my-windmove.el")

;; Ruby
(load "~/.emacs.d/my-ruby.el")
;; Rust
(load "~/.emacs.d/my-rust.el")

;; Helm
(load "~/.emacs.d/my-helm.el")

;; w3m
(load "~/.emacs.d/my-w3m.el")

;; macOS Path correction
(when (memq window-system '(mac ns x))
  (exec-path-from-shell-initialize))
;; Add firefox binary for macOS
(when (string-equal system-type "darwin")
  (setq browse-url-firefox-program "/Applications/Firefox.app/Contents/MacOS/firefox"))

(when (eq system-type 'darwin)
  (set-face-attribute 'default nil :family "Iosevka Nerd Font Mono")
  )

(provide '.emacs)
;;; .emacs ends here
