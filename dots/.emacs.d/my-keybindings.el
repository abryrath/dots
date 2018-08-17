(require 'smartparens-config)
(define-key global-map (kbd "C-c P") 'smartparens-mode)

(require 'projectile)
(define-key global-map (kbd "C-c p") 'projectile-mode)

(require 'treemacs)
(define-key global-map (kbd "C-c t") 'treemacs-projectile)


;; Window movement
(require 'buffer-move)
(define-key global-map (kbd "C-c <right>") 'buf-move-right)
(define-key global-map (kbd "C-c <left>") 'buf-move-left)
(define-key global-map (kbd "C-c <up>") 'buf-move-up)
(define-key global-map (kbd "C-c <down>") 'buf-move-down)

