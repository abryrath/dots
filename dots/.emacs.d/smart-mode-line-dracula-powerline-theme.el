;;; smart-mode-line-powerline-theme.el --- smart-mode-line theme that mimics the powerline appearance.
;;; Commentary:
;; In progress

;; Adapted to Dracula Theme colors by Abry Rath abryrath@gmail.com
;; Copyright (C) 2014 Artur Malabarba <bruce.connor.am@gmail.com>

;; Author: Artur Malabarba <bruce.connor.am@gmail.com>
;; URL: http://github.com/Bruce-Connor/smart-mode-line
;; Version: 0.1a
;; Package-Requires: ((Emacs "24.3") (powerline "2.2") (smart-mode-line "2.5"))
;; Keywords: mode-line faces themes
;; Separator: -

;;; License:
;;
;; This file is NOT part of GNU Emacs.
;;
;; This program is free software; you can redistribute it and/or
;; modify it under the terms of the GNU General Public License
;; as published by the Free Software Foundation; either version 2
;; of the License, or (at your option) any later version.
;;
;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.
;;

;;; Change Log:
;; 0.1a - 2014/05/15 - powerline-theme essentially finished.
;; 0.1a - 2014/05/14 - Created File.
;;; Code:

(deftheme smart-mode-line-dracula-powerline
  "Dracula Powerline theme for smart-mode-line.
Mimics the appearance of powerline with Dracula theme colors.")

(require 'powerline)
(defvar dracula-colors-alist
  '(("drac-background" . "#282a36")
    ("drac-current-line" . "#44475a")
    ("drac-selection" . "#44475a")
    ("drac-foreground" . "#f8f8f2")
    ("drac-comment" . "#6272a4")
    ("drac-cyan" . "#8be9fd")
    ("drac-green" . "#50fa7b")
    ("drac-orange" . "#ffb86c")
    ("drac-pink" . "#ff79c6")
    ("drac-purple" . "#bd93f9")
    ("drac-red" . "#ff5555")
    ("drac-yellow" . "#f1fa8c"))
  "List of Dracula colors.
Each element has the form (NAME . HEX)")

(defmacro dracula-with-color-variables (&rest body)
  "`let' bind all colors defined in `dracula-colors-alist' around BODY.
Also bind `class' to ((class color) (min-colors 89))."
  (declare (indent 0))
  `(let ((class '((class color) (min-colors 89)))
         ,@(mapcar (lambda (cons)
                     (list (intern (car cons)) (cdr cons)))
                   dracula-colors-alist))
     ,@body))


(set-face-attribute 'powerline-active2 nil :inherit 'sml/global)
(set-face-attribute 'powerline-active1 nil :inherit 'sml/global :foreground "#ff79c6")

(let ((l0 "#44475a") ; drac-current-line
      (l3 "#282a36") ; drac-pink;; drac-background
      (l8 "bd93f9") ; drac-comment
      (separator-left
       '(intern (format "powerline-%s-%s"
                        (powerline-current-separator)
                        (car powerline-default-separator-dir))))
      (separator-right
       '(intern (format "powerline-%s-%s"
                        (powerline-current-separator)
                        (cdr powerline-default-separator-dir)))))
  (dracula-with-color-variables
    (custom-theme-set-faces
     'smart-mode-line-dracula-powerline
     `(mode-line-buffer-id ((t :inherit sml/filename :foreground nil :background nil)))
     `(mode-line-inactive ((((background dark)) :foreground ,drac-foreground :background ,drac-background
                            :slant italic :box (:line-width -3 :color ,drac-current-line))
                           (((background light)) :foreground ,drac-foreground :background ,drac-purple
                            :slant italic :box (:line-width -2 :color "white"))))
     `(mode-line     ((t :foreground ,drac-foreground :background ,l0 :box (:line-width -1 :color ,drac-comment))))
     `(sml/global    ((t :foreground ,drac-foreground :background ,l0 :inverse-video nil)))
     
     ;; Layer 0
     ;;`(sml/line-number ((t :foreground drac-foreground :inherit sml/global :weight bold :background ,l0)))
     `(sml/line-number         ((t :foreground ,drac-foreground :inherit sml/global :weight bold :background ,l0)))
     `(sml/remote              ((t :inherit sml/global :background ,l0)))
     `(sml/col-number          ((t :inherit sml/global :background ,l0)))
     `(sml/numbers-separator   ((t :inherit sml/col-number :background ,l0)))
     `(sml/client              ((t :inherit sml/prefix :background ,l0)))
     `(sml/mule-info           ((t :inherit sml/global :background ,l0)))
     `(sml/not-modified        ((t :inherit sml/global :background ,l0)))
     `(sml/read-only ((t :inherit sml/not-modified :foreground ,drac-cyan)))
     ;;'(sml/read-only           ((t :inherit sml/not-modified :foreground "Cyan")))
     
     ;; 3
     ;; File prefix
     `(sml/prefix ((t :background ,l3 :inherit sml/global :foreground ,drac-green)))
     ;; `(sml/prefix    ((t :background ,l3 :inherit sml/global :foreground "#bf6000")))
     `(sml/filename ((t :background ,l3 :inherit sml/global :foreground ,drac-pink)))
     ;;`(sml/filename  ((t :background ,l3 :inherit sml/global :foreground "gold")))
     `(sml/sudo      ((t :background ,l3 :inherit sml/outside-modified)))
     `(sml/git       ((t :background ,l3 :inherit (sml/read-only sml/prefix))))
     `(sml/folder    ((t :background ,l3 :inherit sml/global :weight normal :foreground ,drac-foreground)))
     
     ;; 8
     `(sml/name-filling        ((t :background ,l8 :inherit sml/prefix :weight normal)))
     `(sml/position-percentage ((t :background ,l8 :inherit sml/prefix :weight normal :foreground "#330000")))
     `(sml/modes               ((t :background ,l8 :inherit sml/global :foreground ,drac-cyan)))
     `(sml/process             ((t :background ,l8 :inherit sml/prefix)))
     `(sml/vc                  ((t :background ,l8 :inherit sml/git :foreground "#0000aa")))
     `(sml/vc-edited           ((t :background ,l8 :inherit sml/prefix :foreground "#330000")))
     
     ;; 3
     ;; minor modes
     `(sml/minor-modes         ((t :inherit sml/folder)))
     
     ;; 0
     `(sml/discharging         ((t :background ,l0 :inherit sml/global :foreground "Red")))
     `(sml/time                ((t :background ,l0 :inherit sml/global)))
     
     `(persp-selected-face ((t :foreground "ForestGreen" :inherit sml/filename)))
     `(helm-candidate-number ((t :foreground nil :background nil :inherit sml/filename))))
    (custom-theme-set-variables
     'smart-mode-line-dracula-powerline
     '(sml/mode-width (if (eq (powerline-current-separator) 'arrow) 'right 'full))
     `(sml/pre-id-separator
       '(""
         (:propertize " " face sml/global)
         (:eval (propertize " " 'display (funcall ,separator-left 'sml/global 'powerline-active1)))
         (:propertize " " face powerline-active1)))
     `(sml/pos-id-separator
       '(""
         (:propertize " " face powerline-active1)
         (:eval (propertize " " 'display (funcall ,separator-left 'powerline-active1 'powerline-active2)))
         (:propertize " " face powerline-active2)))
     `(sml/pre-minor-modes-separator
       '("" (:propertize " " face powerline-active2)
         (:eval (propertize " " 'display (funcall ,separator-right 'powerline-active2 'powerline-active1)))
         (:propertize " " face powerline-active1)))
     `(sml/pos-minor-modes-separator
       '("" (:propertize " " face powerline-active1)
         (:eval (propertize " " 'display (funcall ,separator-right 'powerline-active1 'sml/global)))
         (:propertize " " face sml/global)))
     '(sml/pre-modes-separator
       (propertize " " 'face 'sml/modes))))
  )
;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))

(provide-theme 'smart-mode-line-dracula-powerline)
;;; smart-mode-line-dracula-powerline-theme.el ends here.
