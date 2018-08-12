(require 'smartparens-config)
(define-key global-map (kbd "C-c P") 'smartparens-mode)

(require 'projectile)
(define-key global-map (kbd "C-c p") 'projectile-mode)

(require 'treemacs)
(define-key global-map (kbd "C-c t") 'treemacs-projectile)
