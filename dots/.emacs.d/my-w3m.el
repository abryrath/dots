;;; Package --- summary:
;;; Commentary:
;;; Code:
(if (file-exists-p "/usr/local/bin/w3m") (setq w3m-command "/usr/local/bin/w3m"))
(require 'w3m)

(setq browse-url-browser-function 'w3m-browse-url)
(autoload 'w3m-browse-url "w3m" "Ask a WWW browser to show a URL." t)

;; Keyboard Shortcuts
(global-set-key "\C-xm" 'browse-url-at-point)

;; Enable cookies
(setq w3m-use-cookies t)

;; Homepage = DuckDuckGo
(setq w3m-home-page "https://duckduckgo.com/lite/")
;;(use-package w3m-search
;;             :config
(require 'w3m-search)
(add-to-list 'w3m-search-engine-alist '("DuckDuckGo" "https://duckduckgo.com/lite/?q=%s&kp=1"))
(setq w3m-search-default-engine "DuckDuckGo")
      


(provide 'my-w3m.el)
;;; my-w3m.el ends here
