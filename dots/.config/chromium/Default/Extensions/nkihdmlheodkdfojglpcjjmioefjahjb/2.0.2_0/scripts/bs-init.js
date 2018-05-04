$(function() {
  function isIncognito() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // This is frigging async!!
      bsUICookies.prepareForIncognito(tabs[0].incognito)
    });
  }
  bsUICookies.init(isIncognito());
  CommonBrowserListBindings.init();
});
