(setq load-prefer-newer t)
(require 'package)
(add-to-list 'package-archives
	     '("melpa" . "http://melpa.milkbox.net/packages/") t)
(add-to-list 'package-archives
             '("marmalade" . "http://marmalade-repo.org/packages/") t)
(add-to-list 'package-archives
             '("melpa-stable" . "http://melpa-stable.milkbox.net/packages/") t)
(package-initialize)


(defvar required-packages
  '(
    ;; general
    web-mode
    company
    org
    magit
    gitignore-mode
    flymd
    projectile ;needs config
    paredit    ;needs config
    flycheck   ;needs config
    tramp
    ;; apache2-mode
    nginx-mode
    exec-path-from-shell
    windmove
    w3m
    ini-mode
    dockerfile-mode
    docker-compose-mode
    
    ;; terminal
    multi-term
    
    ;; interface/custom
    powerline
    airline-themes
    sublime-themes
    ample-theme
    ample-zen-theme
    dracula-theme
    smart-mode-line
    smart-mode-line-powerline-theme
    
    ;; elixir
    elixir-mode
    alchemist
    ;; ruby
    robe
    ;; rust
    rust-mode
    cargo
    toml-mode
    racer
    
    ;; clojure
    clojure-mode
    cider
    ;; helm
    helm
    ) "A list of packages to ensure are installed at launch.")


;; method to check if all packages are installed
(defun packages-installed-p ()
  (cl-loop for p in required-packages
	when (not (package-installed-p p)) do (cl-return nil)
	finally (cl-return t)))

;; if not all packages are installed, check one by one and install the missing ones.
(unless (packages-installed-p)
					; check for new packages (package versions)
  (message "%s" "Emacs is now refreshing the package database...")
  (package-refresh-contents)
  (message "%s" " done.")
					; install the missing packages
  (dolist (p required-packages)
    (when (not (package-installed-p p))
      (package-install p))))
(provide 'my-packages)
;;; my-packages.el ends here
