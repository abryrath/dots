var bsUICookies = {

  sessionId: '',

  init: function() {
    bsUICookies.populateQuickStart();
    //bsUICookies.refreshCookies();
  },

  populateQuickStart: function() {
    if(localStorage['quick_start']) {
      BrowserStack.quick_start = JSON.parse(localStorage['quick_start']);
      quickLaunch.appendQuickLaunch();
      if(localStorage['logged_in'] && localStorage['logged_in'] == 'true') {
        $(".extension-footer .footer-links").find("ul:first-child").addClass('hide').end().
            find("ul:last-child").removeClass('hide');

      } else {
        $(".extension-footer .footer-links").find("ul:first-child").removeClass('hide').end().
            find("ul:last-child").addClass('hide');
      }
    } else {
      bsUICookies.refreshCookies();
    }

  },

  prepareForIncognito: function(is_incognito) {
    if((is_incognito && localStorage['isIncognito'] != 'true') || (localStorage['isIncognito'] == 'true' && !is_incognito)) {
      delete localStorage['quick_start'];
      localStorage['isIncognito'] = is_incognito;
      // burst the cache, and re-render
      bsUICookies.populateQuickStart();
    }
    localStorage['isIncognito'] = is_incognito;
  },

  refreshCookies: function() {
    chrome.cookies.get({
      url: bsURLs.popupURL(),
      name: '_session_id'
    }, function(cookie) {
      if(typeof cookie !== 'undefined' && cookie !== null) {
        bsUICookies.sessionId = cookie.value;
      } else {
        bsUICookies.sessionId = '';
      }
      // need to cache and handle cases around this:
      $.ajax({
        url: bsURLs.popupURL(),
        success: function(data) {
          localStorage['quick_start'] = JSON.stringify(data.quick_start);
          localStorage['logged_in'] = data.logged_in;
          BrowserStack.quick_start = data.quick_start;
          bsUICookies.populateQuickStart();
        }
      });
    });
  }

};
