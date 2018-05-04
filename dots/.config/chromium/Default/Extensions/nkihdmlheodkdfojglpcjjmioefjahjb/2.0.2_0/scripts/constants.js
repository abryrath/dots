var Constants = {
	onPingTime: 10*1000, // 10 seconds
	messageTimeoutTime: 1, // in mins
	debug_mode: false,
        behind_the_scenes: false,
        is_async: false,
	defaultSettings: {
	  'winxp': {'browser': 'IE', 'version': '7.0', 'os': 'winxp', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'win7': {'browser': 'IE', 'version': '8.0', 'os': 'win7', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'win8': {'browser': 'IE', 'version': '10.0', 'os': 'win8', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'win8.1': {'browser': 'IE', 'version': '11.0', 'os': 'win8.1', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'win10': {'browser': 'IE', 'version': '11.0', 'os': 'win10', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'macsl': {'browser': 'Safari', 'version': '5.1', 'os': 'macsl', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'maclion': {'browser': 'Safari', 'version': '6.0', 'os': 'maclion', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'macml': {'browser': 'Safari', 'version': '6.2', 'os': 'macml', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'macmav': {'browser': 'Safari', 'version': '7.1', 'os': 'macmav', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'macyos': {'browser': 'Safari', 'version': '8.0', 'os': 'macmav', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'macelc': {'browser': 'Safari', 'version': '8.0', 'os': 'macmav', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'macsie': {'browser': 'Safari', 'version': '10.0', 'os': 'macsie', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'ios': {'browser': 'Mobile', 'version': (window.location.pathname.match(/automate/) ? 'iPhone 5-6.0' : 'iPhone 6 Plus-8.3'), 'os': 'ios', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'android': {'browser': 'Mobile', 'version': 'Samsung Galaxy S5-4.4-1080x1920', 'os': 'android', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'realdroid': {'browser': 'Mobile', 'version': 'Samsung Galaxy S5-4.4-1080x1920', 'os': 'realdroid', 'speed': '1', 'resw': '1920', 'resh': '1080'},
    'realios': {'browser': 'Mobile', 'version': 'iPhone 6 Plus-8.0', 'os': 'realios', 'speed': 1, 'resw': '1920', 'resh': '1080'},
    'opera': {'browser': 'Tablet', 'version': 'Samsung Galaxy Tab-1024x600', 'os': 'opera', 'speed': '1', 'resw': '1024', 'resh': '768'},
    'winphone': { 'browser': 'Mobile', 'version': 'Nokia Lumia 520-8.1-480x800', 'os': 'winphone', 'speed': '1', 'resw': '1024', 'resh': '768' }
  },
  highResolutionAndroids: [
    "Amazon Kindle Fire HDX 7-4.3-1200x1920", "Samsung Galaxy Tab 4 10.1-4.4-1280x800",
    "Samsung Galaxy S5-4.4-1080x1920", "Samsung Galaxy S4-4.3-1080x1920",
    "Samsung Galaxy Note 3-4.3-1080x1920", "Samsung Galaxy Tab 2 10.1-4.0-1280x800",
    "Google Nexus 6-5.0-1440x2560", "Google Nexus 5-5.0-1080x1920", "HTC One M8-4.4-1080x1920", "Samsung Galaxy S5 Mini-4.4-720x1280",
    "Google Nexus 9-5.0-1536x2048", "Google Nexus 7-4.1-1280x800", "Samsung Galaxy Note 10.1-4.0-800x1280",
    "Samsung Galaxy Tab-1024x600", "Samsung Galaxy Tab 10.1-1280x800", "Motorola Droid X-480x854",
    "Motorola Atrix 4G-540x960", "Samsung Galaxy S II-480x800"
  ],
  highResolutionOperas: [
    "Motorola Droid X-480x854", "Samsung Galaxy S II-480x800", "Motorola Atrix 4G-540x960", "Samsung Galaxy Tab-1024x600", "Samsung Galaxy Tab 10.1-1280x800"
  ],
  lowResolutionios: [
    "iPhone 3GS-3.0", "iPhone 4-4.0", "iPhone 4S-5.0"
  ],
  allBrowsers: ['firefox', 'safari', 'chrome', 'ie', 'opera', 'mobile', 'tablet'],
  nonStableBrowserTypes: ['aurora', 'beta', 'dev'],
  autofitResolutions: {
    'winxp': '2048x1536', 'win8': '2048x1536', 'win7': '2048x1536', 'win8.1': '2048x1536', 'macsl': '1920x1080', 'maclion': '1920x1080', 'macml': '1920x1080', 'macmav': '1920x1080', 'macyos': '1920x1080', 'macelc': '1920x1080', 'macsie': '1920x1080', 'win10': '2048x1536'
  },
  desktopOS: ['maclion', 'macsl', 'macml', 'macmav', 'macyos', 'macelc', 'winxp', 'win7', 'win8', 'win8.1', 'win10'],
	platformNames: {
	  'winxp': 'Windows XP', 'win8': 'Windows 8', 'win7': 'Windows 7', 'win8.1': 'Windows 8.1', 'win10' : 'Windows 10', 'ios': 'iOS', 'macsl': 'OS X Snow Leopard', 'maclion': 'OS X Lion', 'macml': 'OS X Mountain Lion', 'macmav': 'OS X Mavericks', 'macyos': 'OS X Yosemite', 'macelc': 'OS X El Capitan', 'macsie': 'macOS Sierra', 'android': 'Android', 'opera': 'Opera Mobile', 'winphone': 'Windows Phone', 'realdroid': 'Android', 'realios': 'iOS'
	},
	mobileHelpText: {
	  'android': {
	    'kb': ["Cmd+F11 from OS X and Ctrl+F11 from Windows to switch orientation (<a id='role-tooltip-right' rel='tooltip' data-original-title='In Android v2.3 orientation of device can be changed only once, a known Android bug.' href='javascript:void(0);' class='blue_link'>note</a>)", 'F5 to open search/URL box', 'F6 to toggle trackball mode'],
	    'usage': ['Press the left button and move a little, the zoom controls will appear']
	  },
		'ios': {
		  'kb' : ['Alt+Left/Right Arrow to rotate the device'],
		  'usage' : ['<strong>Start debugger:</strong> From top menubar Hardware > Home for home screen, then Settings > Safari > Advanced > Debug Console ON', 'Double click any part of a webpage to zoom in on that section']
		},
		'opera': {
		  'usage': ['Double click any part of a webpage to zoom in on that section']
		}
	},
  useFlash: 3,
  backwardCompatibleBrowsers: {
    "os x": {
      "mavericks": {
        "safari": {
          "7.0": "7.1",
        },
      },
      "mountain lion": {
        "safari": {
          "6.1": "6.2",
        },
      },
    },
    "windows": {
      "10": {
        "edge": {
          "0.11": "12.0",
          "20.0": "12.0"
        }
      }
    }
  },
  realMobileSkins: {
    "Samsung Galaxy S3" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-S3",
      'cssName': "samsung-galaxy-s3",
      "menu" : "86,815,113,815,111,832,86,832",
      "home" : "179,814,277,818,279,843,180,845",
      "back" : "340,813,367,813,368,832,338,837",
      "realHeight": 5.38,
      "realWidth": 2.78,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S3.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S3@2x.png")
    },
    "Samsung Galaxy S4" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-S4",
      'cssName': "samsung-galaxy-s4",
      "menu" : "99,808,130,808,130,830,99,830",
      "home" : "188,804,291,804,291,835,188,835",
      "back" : "351,808,380,808,380,829,351,829",
      "realHeight": 5.38,
      "realWidth": 2.75,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S4.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S4@2x.png")
    },
    "Samsung Galaxy S4 mini" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-S4-mini",
      'cssName': "samsung-galaxy-s4-mini",
      "menu" : "75,821,108,823,110,840,78,842",
      "home" : "170,813,266,815,277,834,269,848,173,850,164,831",
      "back" : "330,821,358,821,359,844,335,845",
      "realHeight": 6.27,
      "realWidth": 3.27,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S4-mini.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S4-mini@2x.png")
    },
    "Samsung Galaxy S5" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-S5",
      'cssName': "samsung-galaxy-s5",
      "menu" : "110,813,137,813,137,834,110,834",
      "home" : "190,808,290,808,290,842,190,842",
      "back" : "346,816,370,816,370,835,346,835",
      "realHeight": 4.91,
      "realWidth": 2.41,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S5.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S5@2x.png")
    },
    "Samsung Galaxy Note 3" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-Note-3",
      'cssName': "samsung-galaxy-note-3",
      "menu" : "127,810,157,810,157,839,127,839",
      "home" : "207,811,301,811,301,845,207,845",
      "back" : "359,819,383,819,383,838,359,838",
      "realHeight": 5.95,
      "realWidth": 3.12,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-Note-3.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-Note-3@2x.png")
    },
    "Samsung Galaxy S6" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-S6",
      'cssName': "samsung-galaxy-s6",
      "menu" : "107,815,134,815,134,834,106,834",
      "home" : "189,806,287,806,287,858,189,858",
      "back" : "344,816,370,816,370,836,344,836",
      "realHeight": 5.65,
      "realWidth": 2.78,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S6.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-S6@2x.png")
    },
    "Samsung Galaxy Note 4" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-Note-4",
      'cssName': "samsung-galaxy-note-4",
      "menu" : "94,799,124,799,124,819,94,819",
      "home" : "193,794,283,794,283,825,193,825",
      "back" : "354,801,379,801,379,820,354,820",
      "realHeight": 6.04,
      "realWidth": 3.09,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-Note-4.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-Note-4@2x.png")
    },
    "Samsung Galaxy Tab 4" : {
      'skin': true,
      'folderName': "Samsung-Galaxy-Tab-4",
      'cssName': "samsung-galaxy-tab-4",
      "menu" : "269,479,284,479,284,493,269,493",
      "home" : "337,474,386,474,386,497,337,497",
      "back" : "437,478,451,478,451,494,437,494",
      "realHeight": 6.94,
      "realWidth": 9.58,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-Tab-4.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Samsung-Galaxy-Tab-4@2x.png")
    },
    "Motorola Moto X 2nd Gen" : {
      'skin': true,
      'folderName': "Moto-X-2nd-Gen",
      'cssName': "moto-x-2",
      "menu" : "",
      "home" : "",
      "back" : "",
      "realHeight": 5.54,
      "realWidth": 2.85,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Moto-X-2nd-Gen.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Moto-X-2nd-Gen@2x.png")
    },
    "Motorola Moto G 2nd Gen" : {
      'skin': true,
      'folderName': "Moto-G-2nd-Gen",
      'cssName': "moto-g-2",
      "menu" : "",
      "home" : "",
      "back" : "",
      "realHeight": 5.57,
      "realWidth": 2.78,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Moto-G-2nd-Gen.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Moto-G-2nd-Gen@2x.png")
    },
    "Google Nexus 5" : {
      'skin': true,
      'folderName': "Google-Nexus-5",
      'cssName': "google-nexus-5",
      "menu" : "",
      "home" : "",
      "back" : "",
      "realHeight": 5.43,
      "realWidth": 2.72,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-5.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-5@2x.png")
    },
    "Google Nexus 6" : {
      'skin': true,
      'folderName': "Google-Nexus-6",
      'cssName': "google-nexus-6",
      "menu" : "",
      "home" : "",
      "back" : "",
      "realHeight": 6.27,
      "realWidth": 3.27,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-6.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-6@2x.png")
    },
    "Google Nexus 7" : {
      'skin': true,
      'folderName': "Google-Nexus-7",
      'cssName': "google-nexus-7",
      "menu" : "75,769,103,772,102,784,74,782",
      "home" : "168,763,255,764,256,787,169,789",
      "back" : "325,769,347,769,347,782,327,785",
      "realHeight": 7.87,
      "realWidth": 4.49,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-7.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-7@2x.png")
    },
    "Google Nexus 9" : {
      'skin': true,
      'folderName': "Google-Nexus-9",
      'cssName': "google-nexus-9",
      "menu" : "",
      "home" : "",
      "back" : "",
      "realHeight": 8.98,
      "realWidth": 6.05,
      "loaderVideo1": cdnURL("/videos/nexus-loader-1.webm"),
      "loaderVideo2": cdnURL("/videos/nexus-loader-2.webm"),
      "normalSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-9.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/Google-Nexus-9@2x.png")
    },
    "iPad Air 2" : {
      'skin': true,
      'folderName': "iPad-Air-2",
      'cssName': "ipad-air-2",
      "menu" : "",
      "home" : "464,1207,533,1207,533,1277,464,1277",
      "back" : "",
      "realHeight": 9.45,
      "realWidth": 6.67,
      "loaderImage": 2,
      "normalSkin": cdnURL("/images/common-skins/live-skins/iPad-Air-2.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/iPad-Air-2@2x.png")
    },
    "iPhone 6 Plus" : {
      'skin': true,
      'folderName': "iPhone-6plus",
      'cssName': "iphone-6plus",
      "menu" : "",
      "home" : "200,785,263,785,263,845,200,845",
      "back" : "",
      "realHeight": 6.22,
      "realWidth": 3.06,
      "loaderImage": 1,
      "normalSkin": cdnURL("/images/common-skins/live-skins/iPhone-6plus.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/iPhone-6plus@2x.png")
    },
    "iPad Mini 3" : {
      'skin': true,
      'folderName': "iPad-Mini-3",
      'cssName': "ipad-mini-3",
      "menu" : "",
      "home" : "406,1196,479,1196,479,1265,406,1265",
      "back" : "",
      "realHeight": 7.87,
      "realWidth": 5.30,
      "loaderImage": 2,
      "normalSkin": cdnURL("/images/common-skins/live-skins/iPad-Mini-3.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/iPad-Mini-3@2x.png")
    },
    "iPhone 6" : {
      'skin': true,
      'folderName': "iPhone-6",
      'cssName': "iphone-6",
      "menu" : "",
      "home" : "234,832,299,832,299,895,234,895",
      "back" : "",
      "realHeight": 5.44,
      "realWidth": 2.64,
      "loaderImage": 2,
      "normalSkin": cdnURL("/images/common-skins/live-skins/iPhone-6.png"),
      "retinaSkin": cdnURL("/images/common-skins/live-skins/iPhone-6@2x.png")
    }
  },
};

var Log = {
  debug: function(mesg) {
    if (Constants.debug_mode) {
      console.log(mesg);
    }
  }
};

function toHash(path) {
  var hash = 0, i, chr, len;
  if (path.length === 0) return hash;
  for (i = 0, len = path.length; i < len; i++) {
    chr   = path.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function cdnURL(path) {
  if (typeof BrowserStack === 'undefined' || typeof BrowserStack.cloudfrontCdnUrlKeys === 'undefined') {
    return 'https://d2ogrdw2mh0rsl.cloudfront.net/production' + path;
  }
  var url = "https://" + BrowserStack.cloudfrontCdnUrlKeys[toHash(path)%4] + ".cloudfront.net/" + BrowserStack.cdnBucketName + path;
  return url;
}
