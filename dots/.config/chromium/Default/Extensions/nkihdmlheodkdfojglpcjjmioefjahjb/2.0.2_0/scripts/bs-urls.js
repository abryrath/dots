var bsURLs = {
  protocol: 'https',
  baseDomain: 'www.browserstack.com',
  popupEndpoint: 'extension-popup',
  startEndpoint: 'start',
  loginEndpoint: 'users/sign_in',
  baseURL: function() {
    return bsURLs.protocol + '://' + bsURLs.baseDomain;
  },
  popupURL: function() {
    sessionId = bsUICookies.sessionId;
    return bsURLs.baseURL() + '/' + bsURLs.popupEndpoint + (typeof sessionId != 'undefined' && sessionId !== '' ? '/' + sessionId : '') + ".json";
  },
  startURL: function() {
    return bsURLs.baseURL() + '/' + bsURLs.startEndpoint + '?';
  },
  loginURL: function() {
    return bsURLs.baseURL() + '/' + bsURLs.loginEndpoint + '?';
  }
};
