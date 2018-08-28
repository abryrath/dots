;;; Package --- summary
;;; Commentary:
;;; Code:

;; company (complete anything)
(add-hook 'after-init-hook 'global-company-mode)


;; flycheck file may get large, so keep it external
(load-file "~/.emacs.d/my-flycheck.el")

;; flymd
(require 'flymd)
(load-file "~/.emacs.d/my-flymd.el")

;; same with projectile
(load-file "~/.emacs.d/my-projectile.el")

;; load tramp settings
(load-file "~/.emacs.d/my-tramp.el")
;;; my-load-packages.el ends here

;; load w3m browser
;;; DEBUG (load-file "~/.emacs.d/my-w3m.el")
