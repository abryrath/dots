
$(document).ready(function() {

  chrome.cookies.get({
    url: bsURLs.popupURL(),
    name: '_session_id'
  }, function(cookie) {
    if(typeof cookie !== 'undefined' && cookie !== null) {
      bsUICookies.sessionId = cookie.value;
      // need to cache and handle cases around this:
      $.ajax({
        url: bsURLs.popupURL(),
        success: function(data) {
          localStorage['quick_start'] = JSON.stringify(data.quick_start);
          localStorage['logged_in'] = data.logged_in;
        }
      })
    }
  });

});
