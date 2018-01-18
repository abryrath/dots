;;; Package --- summary:
;;; Commentary:
;; Settings for Rust projects
;;; Code:
;; system dependencies:
(require 'cargo)
;; First, install racer and download the source code of Rust:
;; $ rustup component add rust-src
;; $ cargo install racer

(add-hook 'rust-mode-hook #'racer-mode)
(add-hook 'racer-mode-hook #'eldoc-mode)
(add-hook 'racer-mode-hook #'company-mode)
(require 'rust-mode)
(define-key rust-mode-map (kbd "TAB") #'company-indent-or-complete-common)
(setq company-tooltip-align-annotations t)
;;(setq racer-rust-src-path (getenv "RUST_SRC_PATH"))
(setq racer-rust-src-path "/Users/abrrath/.rustup/toolchains/nightly-x86_64-apple-darwin/lib/rustlib/src/rust/src")
;;(Setq racer-rust-src-path ns/nightly-x86_64-apple-darwin/lib/rustlib/src/rust/src)
(provide 'my-rust)
;;; my-rust.el ends here
