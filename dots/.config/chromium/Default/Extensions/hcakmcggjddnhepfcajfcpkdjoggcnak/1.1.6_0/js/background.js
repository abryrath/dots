// Keep track of which browser instance(s) currently have a media
// selector open.  Useful for debugging screen sharing with > 1
// window open.
var _ucMediaSelectorMap = {};

chrome.runtime.onInstalled.addListener(
  function(details){
    chrome.tabs.query({}, function(tabs){
      var scripts = chrome.app.getDetails().content_scripts[0].js;
      var totalTabs = tabs.length;
      for(var i=0; i<totalTabs; i++) {
        chrome.tabs.executeScript(tabs[i].id, {file: scripts[0]});
      }
    });});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    var guid, mediaRequestId;
    if (request['requestScreen']) {
      mediaRequestId = chrome.desktopCapture.chooseDesktopMedia(
        request['media'] || ["screen", "window"], 
        sender.tab, 
        sendResponse
      );
      guid = request['guid'];
      if (guid) {
        _ucMediaSelectorMap[guid] = mediaRequestId;
        console.log('Screen sharing extension showing media selector ' + 
          mediaRequestId + ' (' + guid + ')');
      } else {
        console.warn('Screen sharing extension showing media selector, but no GUID supplied.');
      }
    } else if (request['cancelRequestScreen']) {
      guid = request['guid'];
      if (guid) {
        mediaRequestId = _ucMediaSelectorMap[guid];
        console.log('Screen sharing extension is canceling media selector ' + 
          mediaRequestId + ' (' + guid + ')');
        chrome.desktopCapture.cancelChooseDesktopMedia(mediaRequestId);
      } else {
        console.warn('Screen sharing extension is canceling media selector - no GUID supplied.');
      }
    }
    return true;
  });