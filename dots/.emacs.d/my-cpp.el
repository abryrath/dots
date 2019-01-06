(require 'rtags)
(require 'company-rtags)

(setq rtags-completions-enabled t)
(eval-after-load 'company
  '(add-to-list
    'company-backends 'company-rtags))
(setq rtags-autostart-diagnostics t)
(rtags-enable-standard-keybindings)


(require 'helm-rtags)
(setq rtags-use-helm t)

(require 'cmake-ide)
(cmake-ide-setup)
;(if (file-exists-p "~/Code/cpp/project-euler")
;    ((nil . ((cmake-ide-build-dir . "~/Code/cpp/project-euler")))))
