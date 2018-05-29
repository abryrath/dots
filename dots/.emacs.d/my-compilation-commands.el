;;; package --- Summary
;;; Commentary:
;;; Commands to compile various projects
;;; Code:
(require 'ansi-color)
(define-derived-mode ansi-compilation-mode compilation-mode "ansi compilation"
  "Compilation mode that understands ansi colors."
  (require 'ansi-color)
                                        ;(toggle-read-only 0)
  (read-only-mode 0)
  (ansi-color-apply-on-region (point-min) (point-max)))

(defun colorize-compilation (one two)
  "ANSI colorize the compilation buffer."
  (ansi-compilation-mode)
 )

(setq compilation-finish-function 'colorize-compilation)

(defun dr-react-build-dev ()
  "Run it on the current file."
  (interactive)
  (save-buffer)
  (shell-command "cd ~/Bitbucket/docker-disneyrewards/ && env PATH=/usr/local/bin:/usr/bin docker-compose run --rm react yarn build:dev &"))
(global-set-key "\C-ct" 'dr-react-build-dev)

(defun dr-docker-up ()
  "Bring the DisneyRewards docker project up."
  (interactive)
  (save-buffer)
  (shell-command "cd ~/Bitbucket/docker-disneyrewards/ && env PATH=/usr/local/bin:/usr/bin docker-compose up php &"))

(defun dr-docker-down ()
  "Bring the Disney Rewards docker project down."
  (interactive)
  (save-buffer)
  (shell-command "cd ~/Bitbucket/docker-disneyrewards/ && env PATH=/usr/local/bin:/usr/bin docker-compose down &"))

; (defun run-it ()
;  "Run it on the current file."
;  (interactive)
;  (save-buffer)
;  (shell-command
;   (format "my_command %s &"
;       (shell-quote-argument (buffer-name)))))
;(global-set-key "\C-ct" 'run-it)
(provide 'my-compilation-commands)
;;; my-compilation-commands.el ends here
