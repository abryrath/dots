;;; package --- Summary:
;;; Commentary:
;; Set browser and other things for flymd
;;; Code:
(defun my-flymd-browser-function (url)
  (let ((process-environment (browse-url-process-environment)))
    (apply 'start-process
           (concat "firefox " url)
           nil
           "/usr/bin/open"
           (list "-a" "firefox" url))))
(setq flymd-browser-open-function 'my-flymd-browser-function)
(provide 'my-flymd)
;;; my-flymd.el ends here
