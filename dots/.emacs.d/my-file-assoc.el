;; File associations
(autoload 'php-mode "php-mode" "Major mode for editing PHP code." t)
(if (assoc "\\.php\\'" auto-mode-alist)
    (setq auto-mode-alist (delete "\\.php\\'" auto-mode-alist)))

                                        ; Open .php and .inc files in php-mode
(add-to-list 'auto-mode-alist '("\\.php$" . php-mode))
(add-to-list 'auto-mode-alist '("\\.inc$" . php-mode))


                                        ; Open TWIG template files in Web mode
(require 'web-mode)
(add-to-list 'auto-mode-alist '("\\.twig$" . web-mode))
(add-to-list 'auto-mode-alist '("\\.blade\.php$" . web-mode))
(add-to-list 'auto-mode-alist '("\\.html?\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.vue$" . web-mode))

; Open .js files in js2-mode
(add-to-list 'auto-mode-alist '("\\.js$" . js2-mode))

                                        ; disable smartparens for web mode
(add-hook 'web-mode-hook (lambda() (smartparens-mode -1)))
