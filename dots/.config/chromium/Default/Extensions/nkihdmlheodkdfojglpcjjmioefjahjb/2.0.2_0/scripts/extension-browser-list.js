var BrowserList = (function() {

  var backgroundFade; //Private Data Properties
  var currentBackground;
  var ffMessengerApi;

  return {
    init: init,
    currentBackground: currentBackground,
    triggerEventsOnOSChange: triggerEventsOnOSChange,
    validateAndStartSession: validateAndStartSession
  };

  function init() {
    ffMessengerApi = new FirefoxMessengerApi();
    uiBindings();
  }

  function uiBindings() {
    $('#extension-home-link, #extension-start-link, .extension-popup-link').click(function(e) {
      var type;
      if($(this).is('.sign-in')) {
        type = 'openLoginPage';
      } else type = 'openPage';
      sendMessage({type: type, data: { url: $(this).attr('href'), urlParams: $(this).attr('data-url-params') } }, null);
      e.preventDefault();
    });
  }

  function validateAndStartSession($item) {
    // nothing to validate here
    startLiveSession($item);
  }

  function startLiveSession(item) {

    var $item = item;
    var os = $item.data('os'),
      browser = $item.data('browser'),
      browser_version = $item.data('browser-version'),
      device = $item.data('device');

    if(browser_version) browser_version = String(browser_version);
    $('#browser-list').find('.item.sel').removeClass('sel');
    $item.addClass('sel');

    //check if mobile
    if(CommonBrowserListBindings.getDeviceType(os) === 'mobile') {
      browser = (browser === 'mobile' || browser === 'tablet') ? "Mobile" : browser;
    }

    var sessionParams = {
      'browser': browser,
      'os': os,
      'device': device || '',
      'version': browser_version || ''
    };

    startIntegrationsAPI(sessionParams);
  }

  function getAPIOSVersion(input) {
    var output = {};
    output.os = {'winxp' : 'Windows', 'win7': 'Windows', 'win8': 'Windows', 'win8.1': 'Windows', 'win10': 'Windows', 'macsl': 'OS X', 'maclion': 'OS X', 'macml': 'OS X', 'macmav': 'OS X', 'macyos': 'OS X', 'macelc': 'OS X', 'macsie': 'OS X', 'realdroid' : 'android'}[input.os] || input.os;
    // OS Version
    if (input.os == 'macsl') {output.os_version = 'Snow Leopard';}
    else if (input.os == 'maclion') {output.os_version = 'Lion';}
    else if (input.os == 'macml') {output.os_version = 'Mountain Lion';}
    else if (input.os == 'macmav') {output.os_version = 'Mavericks';}
    else if (input.os == 'macyos') {output.os_version = 'Yosemite';}
    else if (input.os == 'macelc') {output.os_version = 'El Capitan';}
    else if (input.os == 'macsie') {output.os_version = 'Sierra';}
    else if (input.os == 'android' || input.os == 'ios' || input.os == 'realdroid') {output.os_version = input.device.split("-")[1];}
    else if (input.os == 'winxp') {output.os_version = 'XP';}
    else if (input.os == 'win7') {output.os_version = '7';}
    else if (input.os == 'win8') {output.os_version = '8';}
    else if (input.os == 'win8.1') {output.os_version = '8.1';}
    else if (input.os == 'win10') {output.os_version = '10';}
    return output;
  }

  function startIntegrationsAPI(sessionParams) {
    var osParams = getAPIOSVersion(sessionParams);
    sessionParams.os = osParams.os;
    if(typeof(osParams.os_version !== 'undefined')) {
      sessionParams.os_version = osParams.os_version;
    }
    if(typeof(sessionParams.device)) {
      sessionParams.device = sessionParams.device.split('-')[0];
    }
    if(typeof(sessionParams.version) !== 'undefined') {
      sessionParams.browser_version = sessionParams.version;
      delete sessionParams.version;
    }
    sessionParams.start = 'true';
    sessionParams.autofit = 'true';
    sessionParams.start_element = $.browser.name + '_extension';


    //sendMessage({type: 'openIntegrationsAPI', data: sessionParams}, function() {
    //  console.log("Response from openIntegrationsAPI");
    //});
    sendMessage({type: 'openIntegrationsAPI', data: sessionParams})

  }

  function sendMessage(message, callback, extensionId) {
    var utmCampaign = 'quick-launch';
    var utm_source = message['type'] == 'openLoginPage' ? 'chrome-login' : $.browser.name;

    var gaParams = { 'utm_source': utm_source, 'utm_medium': 'extension', 'utm_campaign': utmCampaign };
    message['ga_params'] = gaParams;

    if($.browser.name !== 'firefox') {
      chrome.runtime.sendMessage(message, callback);
    }
    else {
      ffMessengerApi.sendMessage(message, callback);
    }
  }

  function triggerEventsOnOSChange(dataOS, currentOS) {}

})();
