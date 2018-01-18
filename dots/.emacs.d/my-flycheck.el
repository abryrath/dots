					; for python, need `pip install pylint`
					; for js, need `npm install eslint`
					; for ruby, need `gem install rubocop ruby-lint reek
					; for SQL, need `gem install sqlint`
(require 'flycheck)
(add-hook 'after-init-hook #'global-flycheck-mode)
