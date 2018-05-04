if(window.console&&console.log){var oldConsoleLog=console.log;console.log=function(){arguments[0]=_cbf665abe47aee4f445d18e9e1990a23c08e8520(arguments[0]);oldConsoleLog.apply(this,arguments)};var oldConsoleInfo=console.info;console.info=function(){arguments[0]=_cbf665abe47aee4f445d18e9e1990a23c08e8520(arguments[0]);oldConsoleInfo.apply(this,arguments)}}
function _cbf665abe47aee4f445d18e9e1990a23c08e8520(a){var b=a;"string"==typeof a?b="["+new Date+"] - "+a:"object"==typeof a||"array"==typeof a?b.ts_log_exec=new Date:b=a;return b}
var globalArrayOfApprovedHostsForCustomPushToPhone=["google.com/maps","youtube.com/watch","yelp.com/biz","google.co.uk/maps"],globalRetryInternetTimeoutID,clientRunningScript="CRX",globalShouldPerformGlobalAppHealthCheck=!0,origConsoleFunctionality=console,remindersAppUrl="https://mightytext.net/reminders",currentProductionPath="web8",crxID=chrome.runtime.id;
function _ca052fd0c58dff651677328502611dd4b9f96373(a,b,c){var d={};d.category=a;d.action=b;d.label=c;chrome.runtime.sendMessage({GAEventInfo:d},function(a){console.log(a.confirmation)})}function _b6afb5d8174c3fdc86a2854292689a85e768bba9(a,b){var c={};c.event=a;c.properties=b;chrome.runtime.sendMessage({KMEventInfo:c},function(a){console.log(a.confirmation)})}
function _8a7fc4926e9fa6955c55b013d3fca37a0d36ad05(a,b){chrome.runtime.sendMessage({intercomEventInfo:{event:a,properties:b}},function(a){console.log(a.confirmation)})}function _c717c8186fe68f520941370a68c7d57aeb26e6d9(a,b){return Math.round(a*Math.pow(10,b))/Math.pow(10,b)}function _4c34daf797c86e14f2e97c23ddc8cb1df7ea7d04(a,b){b&&(a+=" UTC");return moment(new Date(a)).format("h:mm a")}
function _09a01a1a2aa9efc7e8b671f47aebf9e7ad0e17d1(a){for(var b="";0<a;--a)b+="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.round(61*Math.random())];return b}function _63844fc7c6db7790c91db338e0be6ac2f9ad2062(a){if(3>a.replace(/[^%]/g,"").length)return a;a=a.replace(/\+/g,"%20");return a=decodeURIComponent(a)}function _a1d7603a0d0fbcb30ed515d462180f76e10cc809(){return 1E3*(new Date).getTime()}
function _5532963ef11cbd785134a51c963b08ec6f6c50f5(a){return encodeURIComponent(a).replace(/[!'()]/g,escape).replace(/\*/g,"%2A")}function _b4ce615e45fffcff1e5ab8f8917c10a18ff63f4e(a,b){var c=window.localStorage.notif_auto_dismiss;b="incoming_mms_wakeup"==a?1E4:"1"==c?1E3*parseInt(window.localStorage.notif_auto_dismiss_time):36E5;setTimeout(function(){chrome.notifications.clear(a);console.log("notif clear after: "+b+" milliseconds at: "+new Date)},b)}
function _7b2c0da22646fcd76eed58b1a753d13903fa7880(a){var b=!0;window.localStorage.global_notifications&&"0"==window.localStorage.global_notifications?b=!1:window.localStorage[a]&&"0"==window.localStorage[a]&&(b=!1);return b}function _9709c7d5693e2b7674afb63dfe2b89a90408c0cd(){var a=new Date,b=Array(7);b[0]="Sunday";b[1]="Monday";b[2]="Tuesday";b[3]="Wednesday";b[4]="Thursday";b[5]="Friday";b[6]="Saturday";return b[a.getDay()]}
function _50f384862a33c22485aa8ef4b0adb31a7eb761d1(){chrome.storage.local.get(null,function(a){void 0!=a.debug_mode?_b7ee258ce4687a3c67aa7492da7236ae74bda13d(a.debug_mode):chrome.storage.local.set({debug_mode:"dkfhfaphfkopdgpbfkebjfcblcafcmpi"==crxID?"console_off":"console_on"},function(a){console.log(a)})})}
function ___toggleDebugMode(a){"console_on"==a||"console_off"==a?chrome.storage.local.set({debug_mode:a},function(a){console.log(a)}):console.error("Unrecognized debug string.  Please try again")}function _b7ee258ce4687a3c67aa7492da7236ae74bda13d(a){"console_off"==a?(console.info=function(){},console.log=function(){}):"console_on"==a&&(console.info=origConsoleFunctionality.info,console.log=origConsoleFunctionality.log)}chrome.storage.onChanged.addListener(function(a,b){void 0!=a.debug_mode&&_b7ee258ce4687a3c67aa7492da7236ae74bda13d(a.debug_mode.newValue)});
function _b6954e31d8b9625d672cd1854f68886ef44d953f(){"1"==window.localStorage.notif_sound_mode&&(new Audio("../sounds/"+window.localStorage.notif_sound_tone)).play()}function ___clearJstorage(a){if(a){var b=manifest.version;"no-news-for-this-version"!=$.jStorage.get("news_"+b,"no-news-for-this-version")&&setTimeout(function(){$.jStorage.set("news_"+b,"1")},1E3)}$.jStorage.flush()}function _c74b7efa9d15c055a086e9938f6bac8ac50e9b11(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function _b64bdd522abebf44f807721875afe5597b86403d(a,b){for(;-1<a.search("[-]");)a=a.replace("-","");for(;-1<a.search("[ ]");)a=a.replace(" ","");for(;-1<a.search("[(]");)a=a.replace("(","");for(;-1<a.search("[)]");)a=a.replace(")","");for(;-1<a.search("[.]");)a=a.replace(".","");for(;-1<a.search("[/]");)a=a.replace("/","");for(;-1<a.search("[+]");)a=a.replace("+","");return a=!b&&7>a.length?_f2e0546035cfb88a33dbd6acbb2bbcfca9da98b0(a,7):a.substring(a.length-7)}
function _f2e0546035cfb88a33dbd6acbb2bbcfca9da98b0(a,b){for(var c=a+"";c.length<b;)c="0"+c;return c}
function _2179e4e648b11e528a65b5e742682e4621eb0da4(a,b){var c=[];b&&-1<b.indexOf("|")?c=b.split("|"):c.push(b);for(var d=c.length,g="",f=0;f<d;f++){b=c[f];a=_b64bdd522abebf44f807721875afe5597b86403d(b,"do_not_zeropad");if("09999999999"==a)return"Unknown / Misc";var e=$.jStorage.get(username_prefix_jstrg_purpose+"|PC_"+a,"no-jstorage-val-found");"no-jstorage-val-found"==e?(e=_136a6d5a80cc1799beb5584146db9c085f945709(a),e=void 0!=e?e.contactName:b):e=e.contactName;g+=e;f<d-1&&(g+=", ")}return g}
function _136a6d5a80cc1799beb5584146db9c085f945709(a){var b;$.each(contactsFromPhoneGlobal,function(c,d){a==d.phoneNumClean&&(b=d,$.jStorage.set(username_prefix_jstrg_purpose+"|PC_"+a,{contactName:d.contactName,phoneNum:d.phoneNum,phoneNumType:d.phoneNumType},{TTL:5184E6}))});return b}
function _267e9463f856dafe244230b54a788a2e784e4f7e(a){"undefined"!=typeof a&&a.hasOwnProperty("strings_elem")&&$(a.strings_elem).each(function(){var b=$(this).attr("local-key");"undefined"!=b&&(b=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:b}),$(this).hasClass("mighty-tooltip")?$(this).attr("tooltip-content",b):(a.hasOwnProperty("replace_func")&&(b=a.replace_func(b)),$(this).html(b)),$(this).removeAttr("local-key"),a.hasOwnProperty("additional_callback")&&a.additional_callback(this))})}
function _17b88bbdae4990e1a40e4c9175cb0cb5f572c185(a){var b="*** Error in localization string function ***";"undefined"!=typeof a&&a.hasOwnProperty("key")?(b=chrome.i18n.getMessage(a.key),"placeholders"in a&&0<a.placeholders.length&&(b=chrome.i18n.getMessage(a.key,a.placeholders)),b=0<b.length?b:'*** Error: Localization string not found for key: "'+a.key+'" ***'):console.error(new Date+"Error in custom localization string function");return b}
function _269565642dd2d8f42a27988af07a905ba65e893b(a){chrome.tabs.query({currentWindow:!0,active:!0},function(b){console.info("get current active tabs",b);b=$.extend({},a,{url:b[0].url});_abbb39f08e2e4b90838a5979e64e70d58b1fc5be(b)})}
function _abbb39f08e2e4b90838a5979e64e70d58b1fc5be(a){if("undefined"!=typeof a&&a.hasOwnProperty("url")){var b=a.url;-1<b.indexOf("http")?($(globalArrayOfApprovedHostsForCustomPushToPhone).each(function(a,d){-1<b.indexOf(d)?(console.log("This is a special site!: "+d),_2b5e0072e3828ec52a99f2ff90e8087d0d9b5a7e(d)):console.log("no match found")}),a.hasOwnProperty("crx_js_injection_cb")&&a.crx_js_injection_cb()):($("#phoneInteractButtons, .divider").hide(),$("#composeNew").attr("data-message","openComposeNewInNewTab"),
a.hasOwnProperty("non_crx_js_injection_cb")&&a.non_crx_js_injection_cb())}}_50f384862a33c22485aa8ef4b0adb31a7eb761d1();
function _31766a4c5c1786c575b42c7e777d2a0df57fd5e0(a){a=void 0===a?{}:a;var b={client:"crx",browser:BrowserDetect.browser,browser_version:BrowserDetect.version,os:BrowserDetect.OS,app_version:manifest.version};
try{
	
	if(typeof globalUserName != "undefined"){//adding user email back into the mt stats request 12.15.17 KL
		b.email = globalUserName;
	}
		
	if("undefined"!=typeof cleanVersionGlobal){
		b.app_version=cleanVersionGlobal
	}
	
}catch(d){}var c={"function":"addEvent",event:"event_client_metric"};"event"in a&&"name"in a.event&&(c.event=a.event.name);$.extend(b,a.event.options);try{c.data=JSON.stringify(b)}catch(d){}$.ajax({type:"POST",url:"https://stats.mightytext.co",
data:c,dataType:"text",success:function(a){}})}function _9e6ed81be0a6ecebbc92eef95afac1bf4a8adce3(a){for(var b="";0<a;--a)b+="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(62*Math.random())];return b}
var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS"},searchString:function(a){for(var b=0;b<a.length;b++){var c=a[b].string,d=a[b].prop;this.versionSearchString=a[b].versionSearch||a[b].identity;if(c){if(-1!=c.indexOf(a[b].subString))return a[b].identity}else if(d)return a[b].identity}},
searchVersion:function(a){var b=a.indexOf(this.versionSearchString);if(-1!=b)return parseFloat(a.substring(b+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",
identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",
identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};BrowserDetect.init();

function recordMTLiveLoggerEvent(data = {}){//moved to clean because it's referenced in BOTH firebase.js and capi-health-checker.js

	var eventData = {//default values
		"client": "webapp",
		"browser": BrowserDetect.browser,
		"browser_version": BrowserDetect.version,
		"os": BrowserDetect.OS					
	};
		
	eventData.app_version = manifest.version;

	if(typeof globalUserName != "undefined"){
		eventData.email = globalUserName;
	}
	
	var postData = {
		"type": "push-babysitter"
	}	

	if(clientRunningScript == "native-app"){
		eventData.client = "desktop";
		
		if(checkIfScriptIsLoadedInDesktopBG()){//want to record where this event is being sent from. 
			//11.30.17 obfusc func name to check if the script is being loaded in BG (of desktop)
			eventData.sub_client = "desktop-bg";
		} else {
			eventData.sub_client = "desktop-main";
		}
		
	} else if(typeof threadDisplayModeGlobal != "undefined"){//only want to pass the display mode in webapp.  We should only have a babysitter interval in the main app window in the desktop app 11.28.17
		
		if(postData.event == "event_client_metrics"){
			eventData.app_mode = threadDisplayModeGlobal;			
		} else {
			eventData.sub_client = threadDisplayModeGlobal;			
		}
		
	}

	$.extend(eventData, data.event);
	
	try{
		postData.data = JSON.stringify(eventData);
	} catch (err){
		console.error("Error processing event data in recordMTStatsEvent: " + err);
	}
	
	$.ajax({
		type: "POST",
		url: baseUrl + "/mt-logger" + _1f2408cf2ad672d01a2f6ca772f9a3a4f218d0df(),
		timeout: 10000,
		data: postData,
		xhrFields: { withCredentials: true},
		dataType: "text",
		success: function(reply_server){
			console.info("analytics reply:", reply_server);
		},
		error: function(jqXHR, textStatus){
			console.error("Request error to mt-logger", textStatus);
		}

	})
}