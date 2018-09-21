;;; package --- Summary:
;;; Commentary:
;;; Code:

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(ansi-color-faces-vector
   [default bold shadow italic underline bold bold-italic bold])
 '(ansi-color-names-vector
   (vector "#ffffff" "#f36c60" "#8bc34a" "#fff59d" "#4dd0e1" "#b39ddb" "#81d4fa" "#263238"))
 '(column-number-mode t)
 '(custom-enabled-themes (quote (dracula)))
 '(custom-safe-themes
   (quote
    ("1263771faf6967879c3ab8b577c6c31020222ac6d3bac31f331a74275385a452" "d96587ec2c7bf278269b8ec2b800c7d9af9e22d816827639b332b0e613314dfd" "9be1d34d961a40d94ef94d0d08a364c3d27201f3c98c9d38e36f10588469ea57" "f2dd097452b79276ce522df2f8aeb37f6d90f504529616aa46122d549910e46d" "eae831de756bb480240479794e85f1da0789c6f2f7746e5cc999370bbc8d9c8a" "64ca5a1381fa96cb86fd6c6b4d75b66dc9c4e0fc1288ee7d914ab8d2638e23a9" "7559ac0083d1f08a46f65920303f970898a3d80f05905d01e81d49bb4c7f9e39" "44961a9303c92926740fc4121829c32abca38ba3a91897a4eab2aa3b7634bed4" "ef403aa0588ca64e05269a7a5df03a5259a00303ef6dfbd2519a9b81e4bce95c" "a62f0662e6aa7b05d0b4493a8e245ab31492765561b08192df61c9d1c7e1ddee" "45a8b89e995faa5c69aa79920acff5d7cb14978fbf140cdd53621b09d782edcf" "41eb3fe4c6b80c7ad156a8c52e9dd6093e8856c7bbf2b92cc3a4108ceb385087" "fc7fd2530b82a722ceb5b211f9e732d15ad41d5306c011253a0ba43aaf93dccc" "3e34e9bf818cf6301fcabae2005bba8e61b1caba97d95509c8da78cff5f2ec8e" "cabc32838ccceea97404f6fcb7ce791c6e38491fd19baa0fcfb336dcc5f6e23c" "1d079355c721b517fdc9891f0fda927fe3f87288f2e6cc3b8566655a64ca5453" "760ce657e710a77bcf6df51d97e51aae2ee7db1fba21bbad07aab0fa0f42f834" "34ed3e2fa4a1cb2ce7400c7f1a6c8f12931d8021435bad841fdc1192bd1cc7da" "b3bcf1b12ef2a7606c7697d71b934ca0bdd495d52f901e73ce008c4c9825a3aa" "aaffceb9b0f539b6ad6becb8e96a04f2140c8faa1de8039a343a4f1e009174fb" "a4df5d4a4c343b2712a8ed16bc1488807cd71b25e3108e648d4a26b02bc990b3" "b563a87aa29096e0b2e38889f7a5e3babde9982262181b65de9ce8b78e9324d5" "3eb93cd9a0da0f3e86b5d932ac0e3b5f0f50de7a0b805d4eb1f67782e9eb67a4" "256a381a0471ad344e1ed33470e4c28b35fb4489a67eb821181e35f080083c36" "b181ea0cc32303da7f9227361bb051bbb6c3105bb4f386ca22a06db319b08882" "66aea5b7326cf4117d63c6694822deeca10a03b98135aaaddb40af99430ea237" "003a9aa9e4acb50001a006cfde61a6c3012d373c4763b48ceb9d523ceba66829" "251348dcb797a6ea63bbfe3be4951728e085ac08eee83def071e4d2e3211acc3" "96998f6f11ef9f551b427b8853d947a7857ea5a578c75aa9c4e7c73fe04d10b4" "732b807b0543855541743429c9979ebfb363e27ec91e82f463c91e68c772f6e3" "da538070dddb68d64ef6743271a26efd47fbc17b52cc6526d932b9793f92b718" "a24c5b3c12d147da6cef80938dca1223b7c7f70f2f382b26308eba014dc4833a" "0cd56f8cd78d12fc6ead32915e1c4963ba2039890700458c13e12038ec40f6f5" "1b27e3b3fce73b72725f3f7f040fd03081b576b1ce8bbdfcb0212920aec190ad" "e11569fd7e31321a33358ee4b232c2d3cf05caccd90f896e1df6cab228191109" "c616e584f7268aa3b63d08045a912b50863a34e7ea83e35fcab8537b75741956" "b571f92c9bfaf4a28cb64ae4b4cdbda95241cd62cf07d942be44dc8f46c491f4" "9b1c580339183a8661a84f5864a6c363260c80136bd20ac9f00d7e1d662e936a" "b59d7adea7873d58160d368d42828e7ac670340f11f36f67fa8071dbf957236a" "938d8c186c4cb9ec4a8d8bc159285e0d0f07bad46edf20aa469a89d0d2a586ea" "e9776d12e4ccb722a2a732c6e80423331bcb93f02e089ba2a4b02e85de1cf00e" "e0c66085db350558f90f676e5a51c825cb1e0622020eeda6c573b07cb8d44be5" "3cd28471e80be3bd2657ca3f03fbb2884ab669662271794360866ab60b6cb6e6" "ed317c0a3387be628a48c4bbdb316b4fa645a414838149069210b66dd521733f" "c48551a5fb7b9fc019bf3f61ebf14cf7c9cdca79bcb2a4219195371c02268f11" "b3775ba758e7d31f3bb849e7c9e48ff60929a792961a2d536edec8f68c671ca5" "9b59e147dbbde5e638ea1cde5ec0a358d5f269d27bd2b893a0947c4a867e14c1" "72a81c54c97b9e5efcc3ea214382615649ebb539cb4f2fe3a46cd12af72c7607" "b9e9ba5aeedcc5ba8be99f1cc9301f6679912910ff92fdf7980929c2fc83ab4d" "c74e83f8aa4c78a121b52146eadb792c9facc5b1f02c917e3dbb454fca931223" "84d2f9eeb3f82d619ca4bfffe5f157282f4779732f48a5ac1484d94d5ff5b279" "3c83b3676d796422704082049fc38b6966bcad960f896669dfc21a7a37a748fa" "721bb3cb432bb6be7c58be27d583814e9c56806c06b4077797074b009f322509" "946e871c780b159c4bb9f580537e5d2f7dba1411143194447604ecbaf01bd90c" "ff7625ad8aa2615eae96d6b4469fcc7d3d20b2e1ebc63b761a349bebbb9d23cb" "4259044d43659fe0f7a89aec142728a1f53eeaf24bbec673346d9592ef4e7b1b" "73a13a70fd111a6cd47f3d4be2260b1e4b717dbf635a9caee6442c949fad41cd" "1db337246ebc9c083be0d728f8d20913a0f46edc0a00277746ba411c149d7fe5" default)))
 '(default nil)
 '(ecb-options-version "2.50")
 '(ecb-source-path (quote (("/" "/"))))
 '(ede-project-directories (quote ("/Users/abrrath/Code/c-socket-server")))
 '(fci-rule-color "#37474f")
 '(global-linum-mode t)
 '(hl-sexp-background-color "#1c1f26")
 '(package-selected-packages
   (quote
    (base16-theme cmake-mode company-php js2-mode geben treemacs-projectile smartparens php-mode flymake-phpcs coffee-mode pkgbuild-mode diffview ecb vue-mode material-theme markdown-mode+ flymd apache-mode zenburn-theme buffer-move matlab-mode sublime-themes systemd csv-mode w3m fish-mode ini-mode smart-mode-line-powerline-theme smart-mode-line dracula-theme auctex rjsx-mode flymake-jshint treemacs gulp-task-runner multi-term vcl-mode json-mode docker-compose-mode dockerfile-mode flymake-php editorconfig ample-zen-theme python-pylint web-mode s rust-mode robe python-mode python-django projectile php+-mode paredit magit lua-mode helm elixir-mode company cider ample-theme airline-themes)))
 '(vc-annotate-background nil)
 '(vc-annotate-color-map
   (quote
    ((20 . "#f36c60")
     (40 . "#ff9800")
     (60 . "#fff59d")
     (80 . "#8bc34a")
     (100 . "#81d4fa")
     (120 . "#4dd0e1")
     (140 . "#b39ddb")
     (160 . "#f36c60")
     (180 . "#ff9800")
     (200 . "#fff59d")
     (220 . "#8bc34a")
     (240 . "#81d4fa")
     (260 . "#4dd0e1")
     (280 . "#b39ddb")
     (300 . "#f36c60")
     (320 . "#ff9800")
     (340 . "#fff59d")
     (360 . "#8bc34a"))))
 '(vc-annotate-very-old-color nil))

(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:background nil)))))

;; Load packages/repos

;; Added by Package.el.  This must come before configurations of
;; installed packages.  Don't delete this line.  If you don't want it,
;; just comment it out by adding a semicolon to the start of the line.
;; You may delete these explanatory comments.

(package-initialize)
; Load some options like font, window style, themes, etc.
(load "~/.emacs.d/my-packages.el")
(load "~/.emacs.d/my-load-packages.el")
(load "~/.emacs.d/my-file-assoc.el")
(load "~/.emacs.d/my-options.el")
(load "~/.emacs.d/my-keybindings.el")

;; Window movement
(load "~/.emacs.d/my-windmove.el")
;; Sunrise Commander
;; (load "~/.emacs.d/sunrise-commander.el")

;; PHP
(load "~/.emacs.d/my-php.el")
;; Ruby
;(load "~/.emacs.d/my-ruby.el")
;; Rust
;(load "~/.emacs.d/my-rust.el")

;; Helm
(load "~/.emacs.d/my-helm.el")

;; w3m
;(load "~/.emacs.d/my-w3m.el")

;; Semantic/CEDET
(load "~/.emacs.d/my-semantic.el")

;; ECB - Emacs Code Browser
;;(load "~/.emacs.d/my-ecb.el")

;; Custom compilation commands
(load "~/.emacs.d/my-compilation-commands.el")

;; macOS Path correction
;(when (memq window-system '(mac ns x))
;  (exec-path-from-shell-initialize))

(load "~/.emacs.d/my-treemacs.el")

(setq exec-path
      '(
        "/usr/local/bin"
        "/usr/bin"
        "/usr/sbin"
        "/usr/local/sbin"
        "/bin"
        "/sbin"
        "~/.composer/vendor/bin"
        ))
(setenv "PATH"
        (concat
         "/usr/local/bin" ":"
         "/bin" ":"
         "/sbin" ":"
         "/usr/local/sbin" ":"
         "~/.cargo/bin" ":"
         "~/.composer/vendor/bin" ":"
         (getenv "PATH")))

(provide '.emacs)
;;; .emacs ends here
