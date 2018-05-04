chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if(!msg['recover']) {
        localStorage['search'] = msg['search'];
        localStorage['replace'] = msg['replace'];
        localStorage['case'] = msg['case'];
        localStorage['type'] = msg['type'];
        localStorage['regex'] = msg['regex'];
        port.postMessage("Terms stored");
    } else {
        port.postMessage({
            search:localStorage['search'],
            replace:localStorage['replace'],
            'case':localStorage['case'],
            type:localStorage['type'],
            regex:localStorage['regex']
            });
    }
  });
});

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        alert('Thanks for installing. Remember to REFRESH the page you wish to replace text on before using!');
    }
});