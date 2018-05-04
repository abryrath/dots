var BsTabManager = {

  browserStackTab: null,
  currentTab: null,


  init: function() {
    BsTabManager.getCurrentTab();
    BsTabManager.getBrowserStackTab();
  },

  getCurrentTab: function() {
    chrome.tabs.query({
      active: true, currentWindow: true
    }, function(tabs) {
      if(typeof tabs !== 'undefined' && tabs.length > 0) {
        BsTabManager.currentTab = tabs[0];
      }
    });
  },

  getCurrentUrl: function() {
    if(typeof BsTabManager.currentTab !== 'undefined' && BsTabManager.currentTab) {
      return BsTabManager.currentTab.url;
    }
    return false;
  },

  openURLinNewTab: function(url) {
    chrome.tabs.create({ url: url });
  },

  getBrowserStackTab: function() {
    chrome.tabs.query({
      currentWindow: true
    }, function(tabs){
      tabs.every(function(tab) {
        if(new URL(tab.url).hostname.indexOf((new URL(bsURLs.baseURL())).hostname) > -1) {
          BsTabManager.browserStackTab = tab;
          //break loop
          return false;
        }
        return true;
      });
    });
  },

  openURLinTab: function(url) {
    if(BsTabManager.browserStackTab) {
      chrome.tabs.update(BsTabManager.browserStackTab.id, {url: url, selected: true});
      //close popup
      window.close();
    }
    else {
      BsTabManager.openURLinNewTab(url);
    }
  },

  //verified

  openIntegrationsApi: function(request) {
    var api_params = request.data,
        ga_params = request.ga_params,
        url = bsURLs.startURL();

    url += BsTabManager.stringifiedGaParams(request.ga_params) + '&timestamp=' + Date.now() + "#";

    for (var property in api_params) {
      if (api_params.hasOwnProperty(property)) {
        if(api_params[property].length > 0) {
          url += url.indexOf('=') > -1 ? '&': '';
          url += property + '=' + api_params[property];
        }
      }
    }

    if(BsTabManager.currentTab.url.indexOf(bsURLs.baseDomain) === -1) {
      url += '&url=' + encodeURIComponent(BsTabManager.getCurrentUrl());
    }
    BsTabManager.openURLinTab(url);
  },

  openExtensionURL: function(data, ga_params) {
    var url = data.url + '?' + BsTabManager.stringifiedGaParams(ga_params);
    if(typeof data.urlParams !== 'undefined') {
      url += data.urlParams;
    }
    BsTabManager.openURLinTab(url);
  },

  stringifiedGaParams: function (ga_params) {

    //handle undefined ga_params
    if(typeof ga_params === 'undefined' || ga_params === '') {
      return  '';
    }

    var ga_params_array = [];

    for (var property in ga_params) {
      if (ga_params.hasOwnProperty(property)) {
        ga_params_array.push(property + '=' + ga_params[property]);
      }
    }

    return ga_params_array.join('&');
  }
};

BsTabManager.init();
