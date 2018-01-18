;;; Package --- summary
;;; Commentary:
;;; Code:

;; company (complete anything)
(add-hook 'after-init-hook 'global-company-mode)
(require 'company)
(global-set-key (kbd "C-c c") 'company-complete)

;; magit (git porcelain)
(global-set-key (kbd "C-x g s") 'magit-status)

;; flycheck file may get large, so keep it external
(load-file "~/.emacs.d/my-flycheck.el")

;; same with projectile
(load-file "~/.emacs.d/my-projectile.el")

;; load tramp settings
(load-file "~/.emacs.d/my-tramp.el")
;;; my-load-packages.el ends here

;; load w3m browser
;;; DEBUG (load-file "~/.emacs.d/my-w3m.el")


(require 'web-mode)
(add-to-list 'auto-mode-alist '("\\.html?\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.php\\'" . web-mode))
