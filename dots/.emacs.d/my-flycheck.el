					; for python, need `pip install pylint`
					; for js, need `npm install eslint`
					; for ruby, need `gem install rubocop ruby-lint reek
					; for SQL, need `gem install sqlint`
(require 'flycheck)
(add-hook 'after-init-hook #'global-flycheck-mode)

;; disable jshint since we prefer eslint checking
(setq-default flycheck-disabled-checkers
  (append flycheck-disabled-checkers
    '(javascript-jshint)))

;; use eslint with web-mode for jsx files
(flycheck-add-mode 'javascript-eslint 'js2-mode)

(if (file-exists-p "/home/abry/.composer/vendor/bin/phpcs")
    (setq flycheck-php-phpcs-executable "/home/abry/.composer/vendor/bin/phpcs"))

(if (file-exists-p "/Users/abrrath/.composer/vendor/bin/phpcs")
    (setq flycheck-php-phpcs-executable "/Users/abrrath/.composer/vendor/bin/phpcs"))


(if (file-exists-p "/home/abry/.composer/vendor/bin/phpmd")
    (setq flycheck-php-phpmd-executable "/home/abry/.composer/vendor/bin/phpmd"))

(if (file-exists-p "/Users/abrrath/.composer/vendor/bin/phpmd")
    (setq flycheck-php-phpmd-executable "/Users/abrrath/.composer/vendor/bin/phpmd"))


(provide 'my-flycheck)
;;; my-flycheck.el ends here
