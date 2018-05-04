var bsMessageHandler = {
  init: function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          switch(request.type) {
            case 'openIntegrationsAPI':
              BsTabManager.openIntegrationsApi(request);
              break;
            case 'openPage':
              BsTabManager.openExtensionURL(request.data, request.ga_params);
              break;
            case 'openLoginPage': 
              BsTabManager.openExtensionURL(request.data, request.ga_params);
              break;
            default:
              console.log("Unknown request type: " + request.type);
              break;
          }
          return true;
        }
    );

    chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        switch(request.type) {
          case 'installStatus':
            sendResponse({installed: true, version: chrome.runtime.getManifest().version});
            break;
          case 'burstCache':
            bsUICookies.refreshCookies(sendResponse);
            break;
          default:
            console.log('unknown request type: ' + request.type);
            return("unknown request type: " + request.type);
            break;
        }
      }
    );
  }
};

bsMessageHandler.init();
