;;; package --- Summary
;;; Commentary:
;;; Code:
					; for python, need `pip install pylint`
					; for js, need `npm install eslint`
					; for ruby, need `gem install rubocop ruby-lint reek
					; for SQL, need `gem install sqlint`
(require 'flycheck)
(add-hook 'after-init-hook #'global-flycheck-mode)

(if (file-exists-p (concat (getenv "HOME") "/.composer/vendor/bin/phpcs"))
    (setq flycheck-php-phpcs-executable (concat (getenv "HOME") "/.composer/vendor/bin/phpcs")))

(if (file-exists-p (concat (getenv "HOME") "/.composer/vendor/bin/phpmd"))
    (setq flycheck-php-phpmd-executable (concat (getenv "HOME") "/.composer/vendor/bin/phpmd")))


;;(if (file-exists-p "/home/abry/.composer/vendor/bin/phpmd")
;;    (setq flycheck-php-phpmd-executable "/home/abry/.composer/vendor/bin/phpmd"))

;;(if (file-exists-p "/Users/abrrath/.composer/vendor/bin/phpmd")
;;    (setq flycheck-php-phpmd-executable "/Users/abrrath/.composer/vendor/bin/phpmd"))


(provide 'my-flycheck)
;;; my-flycheck.el ends here
