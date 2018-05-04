

function onclicked_setup(){
  chrome.browserAction.onClicked.addListener(function(activeTab) {
      start_up_iplayer()
      var beebsprem = "https://kt.beebs.host"
      chrome.tabs.create({
          url: beebsprem
      });
      mixpanel.track('Icon Press',{
        "version": "7.0.7"
      })
  });
}

function delete_cookies(e){
  chrome.cookies.getAll({
      domain: e
  }, function(e) {
      for (var t = 0; t < e.length; t++) chrome.cookies.remove({
          url: "http" + (e[t].secure ? "s" : "") + "://" + e[t].domain + e[t].path,
          name: e[t].name
      });
  });
}


function start_up_iplayer() {
    chrome.tabs.query({
        url: ["*://www.bbc.co.uk/iplayer*"]
    }, function(e) {
        e.length >= 1 ? (chrome.tabs.update(e[0].id, {
            active: !0
        }), chrome.windows.update(e[0].windowId, {
            focused: !0
        }), chrome.tabs.reload(e[0].id, {
            bypassCache: !0
        })) : mixpanel.track()
    });
   chrome.tabs.create({
        url: "https://kt.beebs.host/free_firstrun"
    });
}


function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

function event_mp_date (){
  var dom = new Date().getDate();
  if(window.localStorage.getItem('daycheck') !== dom) {
      mixpanel.track('bg_active', {
          "version": "7.0.7"
      })
      window.localStorage.setItem('daycheck', dom)
  }
}



function proxy_run(){
    var config = {
        mode: "pac_script",
        pacScript: {
            data: localStorage.pacScript
        }
    }
    chrome.proxy.settings.set({
            value: config,
            scope: 'regular'
        },
        function() {})
  }




var promise = new Promise(function(resolve, reject) {
  proxy_run()
  delete_cookies("bbc.co.uk")
  delete_cookies("channel4.com")
  if (1 == 1) {
    resolve('All good')
  }
  else {
    mixpanel.track('Promise was rejected.')
    reject();
  }
});



function first_run(){
  if (!window.localStorage.getItem('userid')) {
      promise.then(function(){
        start_up_iplayer()
      })
      window.localStorage.setItem('userid', getRandomToken());
      var userid = window.localStorage.getItem('userid')
      mixpanel.track("Install", {
          "version": "7.0.7"
      }
    )
  }
}

first_run()
onclicked_setup()
proxy_run()
event_mp_date()
