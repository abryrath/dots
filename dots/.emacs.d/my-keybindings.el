;;; package --- Summary
;;; Commentary:
;;; Code:
(require 'smartparens-config)
(define-key global-map (kbd "C-c P") 'smartparens-mode)

(require 'projectile)
(define-key global-map (kbd "C-c p") 'projectile-mode)

(require 'treemacs)
;; Start treemacs-projectile
(define-key global-map (kbd "C-c t") 'treemacs-projectile)
(define-key global-map (kbd "C-c c") 'treemacs-select-window)
(define-key global-map (kbd "C-c d") 'treemacs-delete-other-windows)

(require 'flycheck)
(define-key global-map (kbd "C-c f") 'flycheck-list-errors)

;; Window movement
(require 'buffer-move)
(define-key global-map (kbd "C-c <right>") 'buf-move-right)
(define-key global-map (kbd "C-c <left>") 'buf-move-left)
(define-key global-map (kbd "C-c <up>") 'buf-move-up)
(define-key global-map (kbd "C-c <down>") 'buf-move-down)

(provide 'my-keybindings)
;;; my-keybindings.el ends here
