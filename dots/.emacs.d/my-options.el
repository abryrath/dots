;;; package --- Summary
;;; Commentary:
;;; Code:
(tool-bar-mode -1)
;;(set-face-attribute 'default t :font "Inconsolata for Powerline-10")
;;(set-face-attribute 'default nil :family "Envy Code R")
(set-face-attribute 'default t :family "Iosevka")
;;(set-frame-font "Envy Code R 10" nil t)
(set-frame-font "Iosevka 12" nil t)

;; disable lockfiles
;; see http://www.gnu.org/software/emacs/manual/html_node/emacs/Interlocking.html
(setq create-lockfiles nil)

;; store all backup files in the tmp dir
;; http://www.gnu.org/software/emacs/manual/html_node/emacs/Backup-Names.html
(setq backup-directory-alist
      `((".*" . ,temporary-file-directory)))

;; No tabs
(setq-default indent-tabs-mode nil)
;; Indentation rules for CSS + JS
(require 'css-mode)
(setq css-indent-offset 2)
(require 'js2-mode)
(setq js-indent-level 2)

;; store all autosave files in the tmp dir
;; http://www.gnu.org/software/emacs/manual/html_node/emacs/Auto-Save-Files.html
(setq auto-save-file-name-transforms
      `((".*" ,temporary-file-directory t)))

;; autosave the undo-tree history
(setq undo-tree-history-directory-alist
      `((".*" . ,temporary-file-directory)))
(setq undo-tree-auto-save-history t)


(if window-system (tool-bar-mode -1))
(require 'linum)
(global-linum-mode 1)
(column-number-mode 1)
;; (server-start)



;; terminal settings
(require 'multi-term)
(if 0 ; (file-exists-p "/usr/bin/zsh")
    (setq multi-term-program "/usr/bin/zsh")
  (if 0;(file-exists-p "/bin/zsh")
      (setq multi-term-program "/bin/zsh")
    (if (file-exists-p "/bin/bash") (setq multi-term-program "/bin/bash"))))

(add-to-list 'custom-theme-load-path ".emacs.d/")
;; (require 'material-theme)
;; (load-theme 'material)
;(require 'dracula-theme)
                                        ;(load-theme 'dracula)
(require 'base16-theme)
(load-theme 'base16-dracula)
(require 'airline-themes)
(load-theme 'airline-simple)


;;(when (string-equal system-type "darwin")
(setenv "RUST_SRC_PATH" (concat (getenv "HOME") "/.rustup/toolchains/stable-x86_64-apple-darwin/lib/rustlib/src/rust/src"))
;)
;(when (string-equal system-type "linux")
;  (setenv "RUST_SRC_PATH" (concat (get-env "HOME") "/.rustup/toolchains/stable-x86_64-unknown-linux/lib/rustlib/src/rust/src")))

;; Add firefox binary for macOS
(when (string-equal system-type "darwin")
  (setq browse-url-firefox-program "/Applications/Firefox.app/Contents/MacOS/firefox"))
;; Add chrome binary for macOS
(when (string-equal system-type "darwin")
  (setq browse-url-chrome-program "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"))

(provide 'my-options)
;;; my-options.el ends here
