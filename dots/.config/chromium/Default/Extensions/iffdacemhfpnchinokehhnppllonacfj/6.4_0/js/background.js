var autoContacts = new Array();
var contactsArrayToMatchTypeAheadTo = new Object();
var tabsRunningContentScriptByID = new Array();
var pushEnabledTabs = new Array();//this is a subset of tabsRunningContentScriptByID, scripts that are running a content script, and are able to receive a CAPI
var currentUserServerSettings = '';
//PRODUCTION SERVER
var baseUrl = 'https://textyserver.appspot.com';
var signOutThenAppStore = 'http://mightytext.net/install?utm_source=not_logged_into_gtext'
var userHasAuthorizedGoogleAccount = false;
var multipleAccountSupport = false;
var lastTabToSendMessage;
var socket = {};
var globalPhoneStatusInterval;
var userEmail;
var contentScriptsAreTogglingTitles = false;
var isAProUser = false;
var manifest = chrome.runtime.getManifest();
var globalCAPIHealthCheckInterval;
var globalCAPIHealthCheckIntervalStatus = false;
var stripeMode = "live";
//Added 8/25/14 by KL for contact photos
var username_prefix_jstrg_purpose;
var contactsFromPhoneGlobal = new Array();
var signInUrlCRX = baseUrl + '/signin?extret=' + encodeURIComponent(chrome.extension.getURL('help.html')) + '%23signed_in';
var clientRunningScript = "CRX-NEW";

LE.init('948bd01e-2aa1-4ae4-9a8b-05d426d6add2');

function disableConsoleLogs(check){
    if (check){
        console.log = function(){};
    } else {
        console.log = console.log;
    }
};

function alertUserAboutGmail(){
    chrome.storage.local.get(["initialFlag"], function(data) { /*     console.log(data); */
    
        console.log("Checking chrome local storage flag to know whether or not to show welcome CRX notif.  Flag set to: " + data["initialFlag"]);
    
        if (data["initialFlag"] === undefined) {
            console.log("first time user launched CRX. Alert them to go to Gmail or reload the tab.");
            var firstTimeInstallNotifOptions = {
                type: "basic",
                title: "MightyText in Gmail",
                message: "Click below to start texting from Gmail",
                iconUrl: "../img/gtext-48x48_white_bg.png",
                priority: 2
            };

            chrome.tabs.query({//check num tabs that are running gmail for the user
                url: "*://mail.google.com/*"
            }, function (tabs){
                if(tabs.length < 1){//no gmail tabs found
                    firstTimeInstallNotifOptions.buttons = [{
                        title: "Open Gmail Now",
                        iconUrl: "../img/email.png"
                    }]
                } else {
                    firstTimeInstallNotifOptions.buttons = [{
                        title: "Launch MightyText in Gmail",
                        iconUrl: "../img/email.png"
                    }]                    
                }      
                
                chrome.notifications.create("firstTimeInstall", firstTimeInstallNotifOptions, function(){ 
                    console.log("setting initialFlag setting");
                    
                    chrome.storage.local.set({
                            'initialFlag':true
                        }, function() {
                        // Notify that we saved.
                        console.log('Initial Flag settings set to true');
                    });
    
                });          
                
/*
                if(tabs.length < 1){//no gmail tabs found
                    chrome.tabs.create({
                        url: "http://mail.google.com/",
                        active: true
                    }); 
                } else {//found a gmail tab!
                    var idOfTabToMakeActive = tabs[0].id;
                    chrome.tabs.update(idOfTabToMakeActive, {
                        selected: true
                    });
                }
*/
            })
            
                        
        } else if (data["initialFlag"] == true){

            console.log("GText welcome notif already shown");

            chrome.storage.local.set({
                    'initialFlag':false
                }, function() {
                // Notify that we saved.
                console.log('Initial Flag settings set to false');
            });

        } else {
            
            //do nothing. We've already updated the local setting to reflect that it's not the first session.
        }
    });
}
//! wrap these functions in an initialize function.
alertUserAboutGmail();
getGoogleChromeLocalStorageSettings();
setTimeout(function(){
    notifyUserOfNewFeaturesInThisUpdate();   
}, 15000)

function notifyUserOfNewFeaturesInThisUpdate(){
    //start array of update content
    
    chrome.storage.local.get(["initialFlag"], function(data) { 
    
            var obj = {};
            var valToRetrieveFromChromeStorage = "news_" + manifest.version;
            obj[valToRetrieveFromChromeStorage] = true;
    
/*         if(data["initialFlag"] === false){ */
            var updateNotifContent = new Array();
            updateNotifContent[4.18] = {
                type: "basic",
                title: "Coming soon: MightyText in Facebook",
                message: "You'll be soon able to text directly from Facebook (optional setting).\n\nNote: When the MightyText in Gmail Chrome Extension updates in 2-3 days, you will be prompted to accept a new permission.",
                iconUrl: "../img/gtext-48x48_white_bg.png"
            };
            updateNotifContent[4.19] = {
                type: "basic",
                title: "MightyText now in Facebook",
                message: "Send & receive SMS text messages directly from Facebook!",
                iconUrl: "../img/fb_logo.png",
                priority: 2,
                buttons:[{
                    title:"Try it now in Facebook",
                    iconUrl: "../img/pop_out.png"
                }]
            };
            updateNotifContent['4.20'] = {
                type: "basic",
                title: "MightyText",
                message: "This is for testing",
                iconUrl: "../img/fb_logo.png",
                priority: 2,
                buttons:[{
                    title:"Try it now in Facebook",
                    iconUrl: "../img/pop_out.png"
                }]
            };
            
            //end array of update content
            
                        
            //var valToRetrieveFromChromeStorageStr = valToRetrieveFromChromeStorage.toString();
            
            console.log(obj)
            
            chrome.storage.local.get(valToRetrieveFromChromeStorage, function(data) { 
            
                console.log(data[valToRetrieveFromChromeStorage]);
                
                if(!data[valToRetrieveFromChromeStorage]){
                    console.log(updateNotifContent[manifest.version]);

                    //console.log(manifest.version);

                    if(updateNotifContent[manifest.version] != undefined){
//                         console.log(updateNotifContent[manifest.version]);
                        chrome.notifications.create(valToRetrieveFromChromeStorage, updateNotifContent[manifest.version], function(){
                            
                            chrome.storage.local.set( obj , function() {
                                // Notify that we saved.
                                console.log('Saved the news-update setting for this version.');
                            });
    
                            _gaq.push(["_trackEvent","CRX-Gmail","show_news_v." + manifest.version]);
    
                        });
                        
                    } else {
                        //alert("no updates for this version found");
                    }

                } else {
                    //do nothing, the user has already been notified of the update.
                    console.log("The user has already been notified of the news update for this version.");
                }
        
            });
            
/*         } else { */
            //this is the user's first session, don't show an update.
/*         } */
    });
    
};

//Google Analytics
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//MA - override ga.src location, per instructions in Google Chrome Extension docs
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-21391541-9']); //CRX profile in GA
_gaq.push(['_trackPageview']);
_gaq.push(["_trackEvent","CRX-Gmail","Startup-BG-Page",manifest.version]);

//KISSMETRICS LIBRARY

var _kmq = _kmq || [];
var _kmk = _kmk || 'a009d9e3633da7d7456e8e1478c8f05f33e35f8e';
function _kms(u){
  setTimeout(function(){
    var d = document, f = d.getElementsByTagName('script')[0],
    s = d.createElement('script');
    s.type = 'text/javascript'; s.async = true; s.src = u;
    f.parentNode.insertBefore(s, f);
  }, 1);
}
_kms('https://i.kissmetrics.com/i.js');
_kms('https://scripts.kissmetrics.com/' + _kmk + '.2.js');
_kms('js/km_secure.js');


function zeroPad(num, count) {
    var numZeropad = num + '';
    while (numZeropad.length < count) {
        numZeropad = "0" + numZeropad;
    }
    return numZeropad;
}

// Intercom Analytics Library

(function(){
    var w=window;
    var ic=w.Intercom;
    if(typeof ic==="function"){
        ic('reattach_activator');
        ic('update',intercomSettings);
    }else{
        var d=document;
        var i=function(){
            i.c(arguments)
        };
        i.q=[];
        i.c=function(args){
            i.q.push(args)
        };
        w.Intercom=i;
        function l(){
            var s=d.createElement('script');
            s.type='text/javascript';
            s.async=true;
            s.src='https://widget.intercom.io/widget/7guo5kws';
            var x=d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s,x);                
        }
        
        if(w.attachEvent){
            w.attachEvent('onload',l);
        }else{
            w.addEventListener('load',l,false);
        }
    }}
)();

//START GOOGLE CRX LISTENERS

chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {
    /*     console.log(sender.tab ? "from a content script ran on: " + sender.tab.url : "from the extension"); */
    /*     console.log('received: ' + request); */
    
    //WE DO NOT WANT TO REMEMBER THE TAB.ID OF HELP.HTML BECAUSE IT IS NOT A GMAIL TAB AND IT CLOSES ITSELF SO WE DO NOT HAVE A DESTINATION FOR RESPONSES
        if ((sender.hasOwnProperty("tab")) && (sender.tab.url.indexOf(chrome.extension.getURL('help.html')) === -1)){    
            lastTabToSendMessage = sender.tab.id;
        }
            
        if(request.checkLoginStatusHelpJS){
            //AFTER A USER REGISTERS FOR THE FIRST TIME AND GOES THROUGH ALL THE AUTH SCREENS, THEY WILL LOAD A NEW PAGE CALLED HELP.HTML .  WHEN THAT SCRIPT SENDS A MESSAGE OVER, WE KNOW THAT THE USER HAS REGISTERED THEIR ACCOUNT AND THEREFORE WE SET THIS VAR userHasAuthorizedGoogleAccount TO TRUE SO THAT WHEN THE CONTENT SCRIPT LOADS, AND WE CHECK THE STATUS, WE KNOW OF THEIR REGISTERED STATUS. 

            userHasAuthorizedGoogleAccount =  true;
            initializeGtext("", lastTabToSendMessage);//we are using lastTabToSendMessage here because the message that is coming in is actually being sent from a "tab" that we are going to close (the signin page).  The functions chained off of initializeGtext should be sent to the last tab to send a message (what lastTabToSendMessage is set to because of the rule above)
            sendResponse({
                confirmation: "acknowledged that user has authorized mightytext to login with their google account."
            });
        } else if(request.checkLoginStatusCS){
	        
	        determineSubClientEnabledTabs({
		        action: loadAppInAllTabsOfEnabledSubClients
	        });

            initializeGtext(request.origin, sender.tab.id);//which service (gmail or facebook) and which tab (by id) sent this message
            sendResponse({
               confirmation: "Background.js is checking the user's login status..." 
            });
        } else if (request.getAutoContact) {
            
            buildTypeAheadContactArray(sendResponse);
            
            return true;

        } else if (request.getContactInfo){
            getContactInfo(request.typeaheadItem, sendResponse);
            return true;//adding this return true so that the listener in the content script knows that we will be sending a response async.                        
        } else if (request.getUserSettings) {
            getUserSettingsFromServer("forContentScript", sender.tab.id);
            console.log(currentUserServerSettings);
            sendResponse({
                confirmation: "userServerSettings being retrieved for content script..."
            });
        } else if (request.getUserSettingsOptionsPage) {
            getUserSettingsFromServer("forOptionsPage", sender.tab.id);
            sendResponse({
                confirmation: "userServerSettings being retrieved for options page..."
            });
        } else if (request.saveSettingsToServer) {
            sendResponse({
                confirmation: "settings successfully saved!"
            });
            currentUserServerSettings.enter_to_send = parseInt(request.updatedSettings);
            var crxUserSettings = JSON.stringify(currentUserServerSettings);
            saveUserSettings('settings_list', crxUserSettings, true, sender.tab.id, request);
        } else if (request.getLocalSettings) { /*         console.log(syncSettings); */
            sendResponse({
                confirmation: "local settings served",
                localSettings: chromeLocalSettings
            });
        } else if (request.userHasMightyTextEnabled) {
            sendResponse({
                confirmation: "getting info from the server...",
            });
        } else if (request.openMightyTextIntelligently) {
            openWebApp(request.viewToOpen, request.numberOfConversationToOpen);
            sendResponse({
                confirmation: "opening mightyText now"
            })
        } else if (request.getChromeLocalSettings){
/*             currentGTextHostName = request.currentURL; */
/*             getGoogleChromeLocalStorageSettings(request.currentURL); */
            sendResponse({
               confirmation: "Getting local settings to see if gmail sms is enabled." 
            });
        } else if (request.GoToInstall){
            PushToAppStore(request.origin);
            sendResponse({
               confirmation: "Pushing user to MightyText install page." 
            });
        } else if (request.GoToGoogleAuth){
            PushToGoogleAuth(request.origin);
            sendResponse({
               confirmation: "Pushing user to Google Auth page." 
            });
        } else if(request.logBackIn){
            loginBackInToMightyText(request.origin);
            sendResponse({
                confirmation: "Logging user back into Mightytext..."
            })
        } else if(request.GAEventInfo){ //this lets us send event info to Google Analytics from the content script....
             console.log(request.GAEventInfo);
            sendResponse({
                confirmation: "Recorded GA Event!"
            })
            _gaq.push(["_trackEvent",request.GAEventInfo.category,request.GAEventInfo.action,request.GAEventInfo.label]);
        } else if(request.KMEventInfo){
    /*          console.log(request.KMEventInfo); */
            sendResponse({
                confirmation: "Recorded KM Event!"
            })
            _kmq.push(["record",request.KMEventInfo.event,request.KMEventInfo.properties]);
        } else if (request.supportMultipleAccounts){
            sendResponse({
                confirmation: "Supporting multiple google accounts in background"
            })
            supportMultipleAccounts(request.supportMultipleAccounts);
        } else if(request.getUserSettingsContent){    
            getUserSettingsFromServer("forContentScript", sender.tab.id);
            sendResponse({
                confirmation: "Sending the settings over now."
            })
        } else if (request.getMightyTextAccount){
            sendResponse({
                confirmation: userEmail
            })
        } else if (request.lookThisContactUp){
            sendResponse({
                confirmation: searchForCleanPhoneNumContact(request.numClean, request.fullNum)
            })
        } else if (request.requestPhoneStatus){
            sendResponse({
                confirmation: '{"requesting_phoneStatus":true}'
            });
            getPhoneStatus();
        } else if (request.notifyUserOfMightyTextInFacebook){
            sendResponse({
                createChromeNotif: true
            });
            notifyUserOfMightyTextInFacebook();
        } else if (request.openWebappProPromo){
            sendResponse({
                opening_webapp_in_pro_promo_mode: true
            });
            //! open webapp to promodal 2
            openWebApp("pro_promo");
        } else if (request.openTemplatesAndSignaturesPane){
            openWebApp("templates_and_signatures");
            sendResponse({
                opening_webapp_in_templates_settings_pane: true
            });
        } else if (request.getContactPhotoForThisContact){
            sendResponse({
                contactPhoto: CRX_genericGetThumbnailFromCaches(request.phoneNumClean, request.phoneNumFull)
            });
        } else if (request.intercomEventInfo){
			Intercom('trackEvent', request["intercomEventInfo"]["event"], request["intercomEventInfo"]["properties"]);
            sendResponse({
                confirmation: "Recorded " + request["intercomEventInfo"]["event"] + " event recorded!"
            });
        } else if (request.logEntriesInfo){
	        LE.log(request.logEntriesInfo);
            sendResponse({
                confirmation: "Recorded LogEntries event!"
            });
        } else if (request.sentryInfo){
	        recordSentryEvent(request.sentryInfo);
	        sendResponse({
		        confirmation: "Recorded Sentry Error!"
	        })
        } else if (request.userSignedOutFromContentScript){
            console.log("User has signed out of MT from a subclient tab.");
            alertAllContentScriptsOfUserSignedOutThenReload({trigger: "user-signed-out-from-gtext"});

            sendThisMessageToAllContentScripts({
                user_signed_out_from_mt: true
            });        
            
/*
            clearGlobalIntervals();//the user signed out of MT from a subclient so, we should stop calling these global intervals because they've now dropped their MT cookie. 10/14/14 KL
            //tell all other tabs about this signout as well
            sendThisMessageToAllContentScripts({user_signed_out_from_another_tab: true})
*/
            
            sendResponse({
                notif_of_signout_received: true
            });            
        } else if (request.invokeChromeNotif){
            
            createChromeNotif(request.details);
            sendResponse({
                invoking_notif: true
            })
        } else if (request.reloadTab){
            
            //reload this tab
            var tabIdOfSender = sender.tab.id;
            reloadThisTab(tabIdOfSender);
            
            sendResponse({
                reloading_tab: true
            })
        } else if (request.getUserProStatus){
            
            sendResponse({
                pro_status: isAProUser
            })
        } else if (request.background_connection_check){
            
            sendResponse({
                confirmation: "background is here."
            })
        }

    }
);

function recordSentryEvent(data){
	if(
		(data.hasOwnProperty("message"))&&
		(data.hasOwnProperty("details"))
	){
		try{
			Raven.captureMessage(data.message,{
				tags: data.details.tags
			});		
		} catch (err){
			console.error(new Date() + " there was an issue loading Sentry JS error tracker. Did not record event.");
		}
	}
}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    confirmTheseTabsRunContentScript(tabId);
    
    if(pushEnabledTabs.indexOf(tabId) > -1){
        pushEnabledTabs.splice(tabId, 1);
    }
    
});

chrome.tabs.onActivated.addListener(function(tabInfo){
    //console.log("activated Tab ID: " + tabInfo.tabId);
    checkIfUserIsActiveInGtextTab({origin:"onActivatedListener"});
})

chrome.windows.onFocusChanged.addListener(function(windowInfo){
//    console.log(windowInfo); just returns the window ID
    //console.log("changed focus in windows");
    checkIfUserIsActiveInGtextTab({origin:"onActivatedListener"});
});

chrome.storage.onChanged.addListener(function(data, location) {
    console.log("A user's chrome storage settings have been changed.")
    console.log("---------------sync or local?---------------");
    console.log(location);
    console.log("what was changed?");
    console.log(data);
    console.log("Notifying content scripts of this change.");
    $(data).each(function(key, value){
        notifyContentScriptsOfThisLocalStorageChange(this);
    })
    //getGoogleChromeLocalStorageSettings(currentGTextHostName, "settingsUpdate");
});

chrome.notifications.onButtonClicked.addListener(function(notifID, buttonIndex){

    if(notifID == "news_4.19"){
        enableFacebookThenOpenTab();                                    
    } else if(notifID == "first_load_facebook_not_enabled"){
        //console.log(buttonIndex);

        if(buttonIndex === 0){
            enableFacebookThenOpenTab();                                    
            
        } else {
            
        }

        chrome.notifications.clear(notifID, function(){
            console.log("notif cleared");
        });

        chrome.storage.local.set({
            'first_time_facebook_not_enabled': JSON.stringify(1)
        }, function() {
        
        });
    
    } else if ((notifID == "firstTimeInstall") && (buttonIndex === 0)){
        chrome.tabs.query({//check num tabs that are running gmail for the user
            url: "*://mail.google.com/*"
        }, function (tabs){
            if(tabs.length < 1){//no gmail tabs found
                chrome.tabs.create({
                    url: "http://mail.google.com/",
                    active: true
                }); 
            } else {//found a gmail tab!
                var idOfTabToMakeActive = tabs[0].id;
                chrome.tabs.update(idOfTabToMakeActive, {
                    selected: true
                }, function(tab){
                    chrome.tabs.reload(tab.id)
                });
            }
        })

    }

});

chrome.runtime.onInstalled.addListener(function(details){
	console.log("On installed details:", details);
	console.log("On installed triggered. Reason: " + details.reason);
	try{
		if("reason" in details && details.reason == "update"){
			
			determineSubClientEnabledTabs({//we should only notify the user if they have a sub client tab (GText or Facebook) open 11.17.17 KL
				//will check user's settings first, and then check for open subclient tabs
				action: checkIfUserNeedsToBeNotifiedOfUpdate
			});

		}
	} catch(err){
		console.error("Error occurred while determining if a user's extension was updated.");
	}
});

function checkIfUserNeedsToBeNotifiedOfUpdate(data={}){
	var subClientTabs = data.tabs,
		subClientTabURLMatchArray = manifest.content_scripts[0].matches,//pulling the values from the manifest.json (where we set the urls we want to attempt to inject our content script into) 11.17.17 KL
		matchedSubClients = {
			gmail: false,
			fb: false
		};
		
	$(subClientTabs).each(function(index, tab){
		console.log("[Update Notify Checker] Tab Info", tab);

		if("url" in tab){
			console.log("[Update Notify Checker] Tab url", tab.url);			
			
			$(subClientTabURLMatchArray).each(function(index, subClientURLMatch){
				var regex = new RegExp("[" + subClientURLMatch + "]", "i");//create regex out of the urlmatch string specified in manifest 11.17.17 KL
				var check = tab.url.match(regex);
				console.log("[Update Notify Checker] Does the url: " + tab.url + " match: " + regex + " ? Check: ", check);
				
				if(check != null){//there was a match found! 11.17.17 KL
					subClientTabURLMatchArray.splice(index, 1);//remove this item from the array, so that we don't continue to check for it
					if(subClientURLMatch.indexOf("mail.google.com") > -1){
						matchedSubClients.gmail=true;
					} else if (subClientURLMatch.indexOf("facebook.com") > -1){
						matchedSubClients.fb=true;						
					}
				}
				
			});

		}
		
	});
	
	if("action" in data){//this was added on 1.22.18 by KL to add an action to reload the background page after displaying a notif to alert the user that the app has updated (push provider has changed) and that they should reload all tabs of facebook and gmail.
		data.action();
	} else {//default action is to notify users of an update
		notifyUserOfExtensionUpdate(matchedSubClients);		
	}
	
}

function notifyUserOfExtensionUpdate(data = {}){

	console.log("Inside of notifyUserOfExtensionUpdate", data);

	var notifBody = "Please reload all tabs of Gmail";//generating custom body based on if the user has FB enabled, and if FB is open
		
		if("fb" in data && data.fb != false){
			notifBody += " and Facebook";
		}
		
		notifBody += " for the update to apply.";
		
    var notifOptions = {
	        type: "basic",
	        title: "MightyText In Gmail: Update Available",
	        iconUrl: "../img/gtext-48x48_white_bg.png",
	        message: notifBody,
	        priority: 2
	    },
	    notifID = "update-available-"+manifest.version;//specifying the version incase the user has a stale "laert" type mac notif for a previous update
            

    chrome.notifications.create(notifID, notifOptions, function(notifCreatedID){
	    
	    recordMTStatsEvent({//as of 1.24.18 KL the only place where this function is being invoked is for when the BG reloads due to the push provider switching
			event:{
				name: 'event_client_metric',//we default to this event name, but leaving here as a reminder that we can override this value from the caller
				options:{
					type: `crx-update-available-notif-created`,
					email: userEmail
				}
			}
		});
        
        console.log("Time of " + notifCreatedID + " notif on create at: " + new Date() + "in current date in millseconds: " + new Date().getTime());
        
    });
        	
}

function determineSubClientEnabledTabs(options={}){
    chrome.storage.local.get(null, function(data){//passing null so that we can get all storage values
        if(data != null){
	        console.log("[SubClient Tab Checker] User Settings", data);
            var enabledSubClients = new Array();
            $.each(data, function(key, value){
                if((key == "gmail_notifs") && (value == "1")){
                    enabledSubClients.push("*://mail.google.com/*");
                } else if ((key == "fb_notifs") && (value == "1")){
                    enabledSubClients.push("*://www.facebook.com/*");
                }
            });
            
            //query all tabs that are opened with these domains            
            chrome.tabs.query({
                url: enabledSubClients
            }, function(tabs) {
				if("action" in options){
					options.action({tabs: tabs});
				}
			});
		}
	})
}

function loadAppInAllTabsOfEnabledSubClients(data = {}){

    var openSubClientTabIDs = new Array();
    var subclientTabs = data.tabs;
    console.info("Inside of loadAppInAllTabsOfEnabledSubClients", data);
    $(subclientTabs).each(function(index, tab){
        openSubClientTabIDs.push(tab.id);                    
        if(tabsRunningContentScriptByID.length === 0){
            tabsRunningContentScriptByID.push(this.id);
        } else {
            var idToMatch = tab.id;
            if (tabsRunningContentScriptByID.indexOf(idToMatch) > -1){
            } else {
                tabsRunningContentScriptByID.push(idToMatch);
            }
        }
    });
    confirmTheseTabsRunContentScript(openSubClientTabIDs);

}

//END GOOGLE CRX LISTENERS

function callServlet(whichServletFunction, service, optionalOriginOfServletCallRequest, optionalTabIDToInitialize) {
    var full_url_test = baseUrl + whichServletFunction;
    var curr_timestamp_2,
        postVarBuilder;

    if(service == "getUserInfo"){
        postVarBuilder = "billing_mode=" + stripeMode;
    }

    var contentDataTypeAjax = "json";
    if ((service == 'clearThreads') || (service == 'getThreadsMemcacheOnly') || (service == 'deleteUserThreadInfo')){
        contentDataTypeAjax = "text";
    }
    var bodyContent = $.ajax({
        url: full_url_test,
        global: false,
        type: "GET",
        data: postVarBuilder,
        timeout: 10000,
        dataType: contentDataTypeAjax,
        tryCount : 0,
        retryLimit : 3,
        xhrFields: {
            withCredentials: true
        },
        //v important!
        //jsonpCallback: "servletReturns",
        beforeSend: function(x, y) {
            curr_timestamp_2 = new Date().getTime();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            
            if (textStatus == 'timeout') {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    console.error("Error calling " + whichServletFunction + ". Trying again.  This is try number: "+ this.tryCount );
                    $.ajax(this);
                    return;
                }

                var getUserInfoFullErrorNotifOptions = {
                    type: "basic",
                    title: "MightyText in Gmail",
                    message: "Unable to connect to MightyText. Please check your internet connection and refresh the extension.",
                    iconUrl: "../img/gtext_logo_error.png",
                    priority: 2
                };

                chrome.storage.local.get(null, function(data){//check local storage settings to see what string we should display inthe notif
                    console.log(data)
                    
                    if((data.hasOwnProperty("gmail_preference") && (data.gmail_preference == "1")) && ((data.hasOwnProperty("fb_preference")) && (data.fb_preference == "1"))){
                        //enabled both
                        getUserInfoFullErrorNotifOptions.title = "MightyText in Gmail and Facebook";
                        
                    } else if(data.hasOwnProperty("fb_preference") && (data.fb_preference == "1")){//user enable facebook
                        //only enabled facebook
                        getUserInfoFullErrorNotifOptions.title = "MightyText in Facebook";
                    }
                    //now create the notif.
                    chrome.notifications.create("user-info-full-error", getUserInfoFullErrorNotifOptions, function(createdNotifID){
                        
                        setTimeout(function(){
                            chrome.notifications.clear(createdNotifID, function(){});
                        }, 20000)
                        
                        _gaq.push(["_trackEvent","CRX-Gmail","get-user-info-full-error"]);
    
                    });

                })
                            
                return;
            }

        },
        success: function(reply_server, textStatus, jqXHR) {
            var curr_timestamp_3 = new Date().getTime();
            var logColor = "blue";
            var timeElapsed = (curr_timestamp_3 - curr_timestamp_2);
            
            if (timeElapsed > 7000) {
/*
                $.jGrowl("servlet " + whichServletFunction + " took " + timeElapsed + "ms!!!", {
                    header: 'SLOW RESPONSE...',
                    sticky: true,
                    theme: 'manilla'
                });
*/
                document.title = 'SLOW TIME: ' + timeElapsed;
            }
            if (service == 'getUserInfo') {
            
                console.log(reply_server);
            
                if ((reply_server.user) && (reply_server.user == "user not logged in")) {
                
                    //CREATE A TAB TO AUTO LOG THE USER BACK IN.  THE UX SHOULD BE AS THE FOLLOWING: THE USER SHOULD NOTICE A TAB OPEN, AND THEN CLOSE AND THE CORRECT COMPOSE BUTTON SHOULD APPEAR
                    loginBackInToMightyText(optionalOriginOfServletCallRequest);   
                    //THE CHECKIFUSERISPENDING FUNCTION IS FOR A DELAY IN THE AUTO SIGNIN PROCESS.  IT WILL DETERMINE IF THE USER HAS AUTHED MIGHTYTEXT TO LOG THEM IN WITH THEIR CURRENT GOOGLE ACCOUNT.
                    setTimeout(function(){
                        checkIfUserIsPending(userHasAuthorizedGoogleAccount, optionalTabIDToInitialize);
                    }, 2000);
                    //THE FUNCTION CHECKIFUSERISPENDING IS CHECKING A GLOBAL VAR THAT I SET WHEN THE BACKGROUND             
                } else if ((reply_server.user_status) && (reply_server.user_status.indexOf("not registered") > -1)) {
            			console.log("This user does not have an active Android App registration! (either never set up or they disconnected..)");
                    	if (confirm("Thank you for installing MightyText in Gmail! \r\n \r\n \"" + reply_server.email + "\" has not yet installed & configured the MightyText Android Phone App. \r\n \r\nPlease install the MightyText Android App on your phone and make sure you've selected this same Google Account (" + reply_server.email + ")")){
                        	PushToAppStore();
                    	}
                    	
                        //SEND A MESSAGE TO THE CURRENT TAB RUNNING CONTENT SCRIPT THAT THE USER IS LOGGED IN, REGISTERED AN EMAIL WITH THE APP ON THEIR PHONE, AND AUTHED THEIR GOOGLE ACCOUNT.
                    	chrome.tabs.sendMessage(optionalTabIDToInitialize, {
                            userIsLoggedIntoGoogleButNotRegistered: true
                        }, function(response) {
                            console.log(response.confirmation);
                        });               
                } else if ((reply_server.user_info_full) && (reply_server.user_info_full.email.length > 0)) { 
                    userEmail = reply_server.user_info_full.email;
                    var dateUserCreatedAccountString = reply_server.user_info_full.ts_creation;
                    
       				username_prefix_jstrg_purpose = userEmail.substr(0, reply_server.user_info_full.email.indexOf('@'));        


                    //CALLING KISSMETRICS.
           			_kmq.push(['identify', userEmail]);

                    //SEND A MESSAGE TO THE CURRENT TAB RUNNING GMAIL THAT THE USER IS LOGGED IN, REGISTERED AN EMAIL WITH THE APP ONT HEIR PHONE, AND AUTHED THEIR GOOGLE ACCOUNT.
                                        
                    chrome.tabs.sendMessage(optionalTabIDToInitialize, {
                        userIsLoggedIntoMightyText: true,
                        mtAccount: userEmail
                    }, function(response) {
                        console.log(response);
                        var accountMatchCheck = response.confirmation;
                        //If the user has enabled mutliple accounts, then always set this value to "gmail-user-matched" so that the background will open a CAPI socket, etc.                                               
                        if(multipleAccountSupport){
                            accountMatchCheck = "gmail-user-matched";
                        } else {
                            //do nothing
                        }
                                                
                        //this will let us know the ratio of matches:unmatches
                        
                        if( getRandomInt(0, 100) === 1){
                            _gaq.push(["_trackEvent","CRX-Gmail","Check-Gmail-User-Match-1pct-Sample", accountMatchCheck]);
                        }
                        
                        checkIfUserIsSupportingMultipleAccounts(accountMatchCheck, optionalTabIDToInitialize);
                        
                        if((reply_server.user_info_full.premium == 999) || (reply_server.user_info_full.premium == 1)){

                		  	if(reply_server.user_info_full.premium == 999)
                		  		{
                		  		
                			  		isAProUser = true;
    				  				sendContentScriptProStatusInfo(optionalTabIDToInitialize);//send message to content script that the user is pro.
                			  		                		  		
                		  		}
                		  	else if(reply_server.user_info_full.premium == 1)
                		  		{
                                                    		  		
                			  		//CRV this was a paying user.  Let's make sure that their paid account is still active
                			  		if(reply_server.billing_info)
                			  			{
                			  			                			  			
                			  				billingInfo = reply_server.billing_info;
                				  			if((billingInfo.status == 'active') || (billingInfo.status == 'past_due') || (billingInfo.status == 'trialing')){
            					  				isAProUser = true;
            					  				sendContentScriptProStatusInfo(optionalTabIDToInitialize);//send message to content script that the user is pro.
            				  				            				  				
								  				if(reply_server.billing_info.status == 'past_due'){
								  				
        						  					var randomInt = getRandomInt(1, 3);
        											if(randomInt == 2){
                                                        
                                                        chrome.tabs.sendMessage(optionalTabIDToInitialize, {
                                                            userStripeStatusIsPastDue: true,
                                                        }, function(response) {
                                                            console.log(response);
                                                        });
                                                        
                                                        //alert("MightyText Payment Issue\nWe recently tried to chard your card for MightyText Pro but the charge was unsuccessful.\n\nTo avoid cancellation of MightyText Pro, please go to: {link to billing in webapp}");

    												}
        					  					}            				  				
            				  				}
                			  			}
                		  		}

/* user billing info past due copy = */
            		  		
        		  		} else {
            		  		isAProUser = false;
        		  		}
        		  		
                        doIntercomSetup(userEmail, dateUserCreatedAccountString, reply_server, "CRX-NEW-GTEXT");
                        
                        //only configuring Raven for cookie'd users to help keep event volume down
                        initiateSentry({subclient: optionalOriginOfServletCallRequest});
        		  		        		  		
	  		    		var currentDateWithoutTime = new Date().setHours(0,0,0,0); //"round" to nearest whole day
	        			
                		var lastDateWithoutTimeUserLoginEventCall = $.jStorage.get("ts_last_user_logged_in_event_call", "not_found");
                		                		
                		if(lastDateWithoutTimeUserLoginEventCall == currentDateWithoutTime){
                    		
                		} else {//it's a new day!
                    		
    	    				Intercom('trackEvent', 'User-Logged-In-GText', {'CRX-New-Login':'true', 'Client': 'CRX-New', 'Subclient' : optionalOriginOfServletCallRequest, "isPro": isAProUser});
    	        			_kmq.push(['record', 'User Logged In', {'CRX-New-Login':'true','Client':'CRX-New', 'Subclient' : optionalOriginOfServletCallRequest, "isPro": isAProUser }]);

	        				recordMTStatsEvent({//recording an MT stats event here so that we can track number of users on this new version
								event:{
									name: 'event_client_metric',//we default to this event name, but leaving here as a reminder that we can override this value from the caller
									options:{
										type: "logged-in",
										email: userEmail
									}
								}
							});

                            //set flag so that we don't call the event above more than once.
                    		$.jStorage.set("ts_last_user_logged_in_event_call", currentDateWithoutTime);
                    		
                		}

                    }); 

                }
            }
            if (contentDataTypeAjax == "json") {
                processJSON(reply_server, service, optionalTabIDToInitialize);
            }
        }
    });
}

function initiateSentry(data){
	try{
		Raven.config('https://970e091ca13f438497240655296a0529@sentry.io/134150',{
			environment: "production",//this seems to be treated like a tag
			tags:{
				client: "GText/FText",//adding this so that we can filter in the dashboard on webapp specific events.  Only including Sentry in WA as of 1/24/17 KL
				subclient: data.subclient
			},
			release: manifest.version,
			ignoreErrors: [
				// Random plugins/extensions
				'top.GLOBALS',
				// See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
				'originalCreateNotification',
				'canvas.contentDocument',
				'MyApp_RemoveAllHighlights',
				'http://tt.epicplay.com',
				'Can\'t find variable: ZiteReader',
				'jigsaw is not defined',
				'ComboSearch is not defined',
				'http://loading.retry.widdit.com/',
				'atomicFindClose',
				// Facebook borked
				'fb_xd_fragment',
				// ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
				// See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
				'bmi_SafeAddOnload',
				'EBCallBackMessageReceived',
				// See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
				'conduitPage',
				// Generic error code from errors outside the security sandbox
				// You can delete this if using raven.js > 1.0, which ignores these automatically.
				'Script error.'
			],
			ignoreUrls: [
				// Facebook flakiness
				/graph\.facebook\.com/i,
				// Facebook blocked
				/connect\.facebook\.net\/en_US\/all\.js/i,
				// Woopra flakiness
				/eatdifferent\.com\.woopra-ns\.com/i,
				/static\.woopra\.com\/js\/woopra\.js/i,
				// Other plugins
				/127\.0\.0\.1:4001\/isrunning/i,  // Cacaoweb
				/webappstoolbarba\.texthelp\.com\//i,
				/metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
				/kaspersky-labs\.com/i,
				/^18$/,
				/frame\..*\.js/i
			]
		});		
	} catch(e){
		console.error(new Date() + " error occurred while trying to config SentryJS", e);
	}
}

function checkIfUserIsSupportingMultipleAccounts(accountMatchCheck, optionalTabIDToInitialize){
    chrome.storage.local.get("multiple_accounts", function(data){
        if(data["multiple_accounts"] == "1"){

            startContentScript(optionalTabIDToInitialize);
            
        } else if (data["multiple_accounts"] == "0"){
        
            //check that the MT logged in user matches the Gmail logged-in user.
            if(accountMatchCheck == "gmail-user-matched"){
            //IF THEY ARE NOT IN THE GMAIL TAB, WE HARDCODE GMAIL-USERMATCHED SO THAT WE CAN TELL THE CONTENT SCRIPT TO START THE APP.
            //accountMatchCheck is a global that is set in the response of the message "userIsLoggedIntoMightyText"
                
                startContentScript(optionalTabIDToInitialize);
                
            } else if (accountMatchCheck == "gmail-user-not-matched") {//
//                 console.error("User opened a tab under another username");
                //alert("GText from MightyText did not load because you are signed into MightyText and Gmail with different Google Accounts.");             
            } 
            
        }
    });
        
}                                                    

function startContentScript(tabIDToInitialize){
        // success - proceed with the rest of the setup
    
    clearAndStartNewGetPhoneStatusInterval();
    
    //get user settings from server. Which for now is just the send on enter preference.
    getUserSettingsFromServer("forContentScript", tabIDToInitialize);

    //WE KNOW THAT THE USER IS LOGGED IN AND THAT THEY HAVE GMAIL PREFERENCES ENABLED, SO WE CHECK IF THE AUTOCOMPLETE CONTACTS ARRAY IS BUILT ALREADY BY CALLING TEXTY TO GET THE USER'S PHONE CONTACTS.  IF NOT, WE CALL THE SERVLET TO BUILD THE ARRAY WHICH WILL LATER BE SENT TO THE CONTENT SCRIPT FOR THE AUTOCOMPLETE IN THE CONTACTSINPUT
    if(contactsFromPhoneGlobal.length > 0){//have already fetched contacts
        console.log("already pushed contacts into arrays")
    } else {
        callServlet('/phonecontact?function=getPhoneContacts', 'getPhoneContacts', "", tabIDToInitialize);
    }
    
    if(isAProUser){//if the user is pro, we are going to fetch their contact groups every time a content script is loaded (and we know that the user has an MT cookie).  We will make sure to not have dup entries in the global array. KL 11.12.15
        addContactGroupsToTypeahead();        
    }
    
    setTimeout(function(){//setting a delay because the global phone contacts array should be populate before we try to set photo contacts
        getThreads();                            
    }, 2000);


    if(pushSocketOpened){
        //SOCKET IS A GLOBAL VARIABLE.  IT IS SET THE FIRST TIME THAT CHANNEL_API_TOKEN_SETUP IS RUN.  IF WE ARE HERE, IT MEANS THAT THE SOCKET IS ALREADY CREATED, AND THAT THE READYSTATE MEANS IT IS "OPEN".  NOW WE SHOULD JUST DOUBLE CHECK THAT THE CAPI IS OPEN.  BY SENDING A HEALTH CHECK BELOW.
                                        
        sendTestPushMessage('CAPI_HEALTH_CHECK_FROM_GTEXT_2018', true, tabIDToInitialize);
                
    } else {
    
        console.log("socket.readyState was undefined, so we need to create a new CAPI socket");
        setTimeout(function(){
	        checkIfUserIsCompatibleWithOurDefaultPushProvider();
        }, timeBeforeCheckForPushServiceEnabled);
        fetchUserAppInfo({attempt: 0, tab_id:tabIDToInitialize});
        
    }
    
    if(!globalCAPIHealthCheckIntervalStatus){//there is not a capi health interval set, then set one now
        startPushHealthCheckInterval(); 
    }
    
}

function clearAndStartNewGetPhoneStatusInterval(){
    if(tabsRunningContentScriptByID.length > 0){
    
        window.clearInterval(globalPhoneStatusInterval);

        globalPhoneStatusInterval = setInterval(function(){
            getPhoneStatus(); 
        }, 3 * 60 * 1000);//calling getPhoneStatus every 3 minutes.

    }
}

function checkIfUserIsPending(userStatus, optionalTabIDToMessage){
/*
    console.log("Inside of checkIfUserIsPending");
    console.log(userStatus);
*/
    if (userStatus != true) {
    	chrome.tabs.sendMessage(optionalTabIDToMessage, {
            userHasNotAuthedGoogle: true
        }, function(response) {
            console.log(response.confirmation);
        });
    } else {
        console.log("The user has connected their Google Account with their MightyText account. Look Below:");
        console.log(userStatus);
    }
    //reset the VAR TO OFF FOR THE NEXT TIME WE MAY HAVE TO CHECK THE REGISTRATION STATUS.
    userHasAuthorizedGoogleAccount = false;
};

function getPhoneStatus() {
//GET THE BATTERY STATUS
    //alert("get phone status");
    console.log("Requesting phone status: " + new Date());
    sendOtherC2DM('get_phone_status', 'not-needed-gtext');
/*     phoneStatusRequested = true; */
}

function sendOtherC2DM(action, actionData, extraParamOptional, tabIdOptional)
//THIS FUNCTION IS COPIED FROM THE WEBAPP ON 5.5.13 I AM CURRENT USING IT FOR GETPHONESTATUS.  IT CAN ALSO BE USED FOR REFRESHING CONTACTS/SYNC CONTACTS (BASED OFF OF THE ALERTS IN THE SUCCESS CALLBACK THAT I COMMENTED OUT.
{
    var sendUrlC2DMBase = baseUrl + '/client';
/*     var sendUrlC2DMBase = baseUrl + '/client?function=send&deviceType=ac2dm&source_client=31'; */
/*     var sendUrl = sendUrlC2DMBase + '&action=' + action + '&action_data=' + actionData; */
    var sendUrl = sendUrlC2DMBase;
    var postVarBuilder = {
        "function": "send",
        "deviceType":"ac2dm",
        "source_client":31,
        "action":action,
        "action_data": actionData
    };
    if (extraParamOptional) sendUrl = sendUrl + extraParamOptional;
//     console.log('send url for Custom C2DM is: ' + sendUrl);
    var bodyContent = $.ajax({
        url: sendUrl,
        global: false,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        //v important if browser supports CORS
        data: postVarBuilder,
        //if browser supports CORS, then this is just blank
        dataType: "text",
        success: function(reply_server, textStatus, jqXHR) {
            
            if (reply_server.search("sent to phone") > -1) {
                console.log("successful "+ action +" request.");
                
                if((action == "fetch_binary_from_url_store_on_device")||(action == "launch_from_url")){
                    var contextAction
                    
                    alertWeb2PhoneOfSendC2DMSuccess(tabIdOptional);
                    
                    if(action =="fetch_binary_from_url_store_on_device"){
                        contextAction == "add_image_to_phone";
                    } else if (action == "launch_from_url"){
                        contextAction = "open_link_on_phone";
                    }               
                    
            		_kmq.push(['record', 'Context Menu Action', {'Context-Menu-Click': contextAction,'Client':'CRX'}]);
                    _gaq.push(["_trackEvent","CRX-ContextMenu","CRX-PhoneAction", contextAction]);
                    
                } else if(action == "get_phone_status"){
                    //! record phone status km
                    
                    if((typeof username_prefix_jstrg_purpose != "undefined") && (username_prefix_jstrg_purpose.indexOf("k") === 0)){//username begins with letter K, then call kmq to determine if there are any runaway km's
                        _kmq.push(['record', 'Phone-Status-Request-Success-User-K', {'Client':'CRX-New'}]);
                    }
                    
                    return false;
                }

/*
		     	if(action=="push_phone_contacts_to_cloud")
	     			displayAlertMessage('Sent request to your phone to get the latest contact names. Please make sure your phone is on and connected to a data network.', 'success', 7000);

	     		else if (action=="push_phone_contact_photos_to_cloud")
	     			displayAlertMessage('Sent request to your phone to sync contact photos. Please make sure your phone is on and connected to a data network, and reload this page in a few minutes.', 'success', 10000);
*/
            } else if((action == "get_phone_status") && (reply_server.indexOf("LOGIN_REQUIRED") > -1)){
                //only want to alert if the background is triggering this message for getPhoneStatus
                //as of 10.28.15, we don't call this function in any other case.  
                //Trying to prevent a user with a broken CAPI from repeatedly calling get phone status after signing out from another client, or just from Gmail.
                console.log("Server returned that the user was not logged in when requesting a phone status at: " + new Date());
                alertAllContentScriptsOfUserSignedOutThenReload({trigger: "get-phone-status-request"});
            } else {            
                handleC2DM_GCM_Errors(action, reply_server);
            } 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error in C2DM: ' + errorThrown);
            console.log('Error details: ' + errorThrown.error);
        }
    });
}

function handleC2DM_GCM_Errors(which_c2dm_gcm_action,reply_server,optionalMessagesDiv){
        var errorMessage='';

        if (reply_server.indexOf('LOGIN_REQUIRED') > -1){
        
            checkNumTabsRunningContentScriptThenClearGlobalIntervals();//this function will check the number of tabs running the content script.  If it is less than 1, then it will clear 

            _gaq.push(["_trackEvent","CRX-Gmail","C2DM-Error","LOGIN_REQUIRED",1]);
            errorMessage='Error: Not logged in to MightyText. (MightyText in Gmail)';
        } else if (reply_server.indexOf('DEVICE_NOT_REGISTERED') > -1){
            _gaq.push(["_trackEvent","CRX-Gmail","C2DM-Error","DEVICE_NOT_REG",1]);
            errorMessage='Error: Android Phone not registered with MightyText with this Google Account, or MightyText Android App not installed properly on your phone.';
        } else if (reply_server.indexOf('DeviceQuotaExceeded') > -1){
            _gaq.push(["_trackEvent","CRX-Gmail","C2DM-Error","DEVICE_QUOTA_EXCEEDED",1]);
            errorMessage='Android Phone Quota Exceeded.  Error Code: DeviceQuotaExceeded (C2DM)';

        } else {
            errorMessage='C2DM/GCM Error.  Please retry. \r\n\r\n Error Info: \r\n\r\n' + reply_server;
            _gaq.push(["_trackEvent","CRX-Gmail","C2DM-Error", "GENERAL C2DM ERROR"]);

        }


        console.error(errorMessage);
/*
	  alert(errorMessage);

	  if ( (which_c2dm_gcm_action=='send_sms') || (which_c2dm_gcm_action=='send_mms') ){
        resetFocusOnEntryBoxAfterC2DMProblem(optionalMessagesDiv);
	  }
*/

}

function processJSON(json_data, service, tabIDToSendMessageTo) {

    if (service == 'phoneThreads') {

    } else if (service == 'getUserInfo') { /* 			logSuper("Data from GetUserInfo function is here: " + JSON.stringify(json_data), "green"); */
//        console.log(JSON.stringify(json_data.user_info_full));
    } else if ((service == 'clearUserSetupInfo') || (service == 'clearUserContentInfo')) { 			
        //logSuper("Data from " + service + " function is here: " + JSON.stringify(json_data), "purple");
    } else if (service == 'getUserInfoREPEAT') {
        console.log(JSON.stringify(json_data.user_info_full));
        setTimeout("callServlet('/content?function=getUserInfoFull','getUserInfoREPEAT');", 500);
    } else if (service == 'clearPhoneContacts') { 
        //logSuper("Status from Clear function is: " + json_data.contacts_status,"green");
    } else if (service == 'clearDevices') { 
		//logSuper("Data from " + service + " function is here: " + JSON.stringify(json_data), "purple");
    } else if (service == 'getDeviceList') {
        //logSuper("Status from getDeviceList function is: " + json_data,"green");
        //logSuper(JSON.stringify(json_data));
        $.each(json_data, function(i, thisdevice) { //loop through HEADER threads 
            /* 		   		logSuper("<B>"+ thisdevice.name + " (" + thisdevice.type + ")</B>  --> " + thisdevice.registrationTimestamp + " --> " + thisdevice.deviceRegistrationID); */
        });
    } else if (service == 'getCameraPics') {
        console.log(json_data.messages);
        $.each(json_data.messages, function(i, thispic) {
            console.log(thispic);
            var mms_blob_url = baseUrl + '/imageserve?function=fetchFile&id=' + thispic.id;
            var additional_body_text = '<div id="mms-scale-down" style="height:120px;margin:10px"><a id="fancyimagepopup" style="margin-left:25px;" href="' + mms_blob_url + '"> <img class="photohover" style="vertical-align:middle;height:100%" src="' + mms_blob_url + '" alt="Photo in process"></a></div>';
            document.getElementById("OUTPUT-SERVER").innerHTML += additional_body_text;
        });
    } else if (service == 'getPhoneContacts') { 
        $.each(json_data, function(i, thiscontact) { //loop through HEADER threads 
                
        contactid = thiscontact.contactId;
//        contactName = createHTMLEquivalentOfMessageBody(thiscontact.displayName);
        contactName = thiscontact.displayName;
            $.each(thiscontact.phoneList, function(j, thisphoneentry) {
                phoneNumTypeInt = thisphoneentry.type;
                phoneNum = thisphoneentry.phoneNumber; 
                cleanPhoneNum = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(phoneNum); 
                var phone_num_type = '';
                if (phoneNumTypeInt == 1) phoneNumType = 'Home';
                else if (phoneNumTypeInt == 2) phoneNumType = 'Mobile';
                else if (phoneNumTypeInt == 3) phoneNumType = 'Work';
                else phoneNumType = 'Other';
                var contactInfo = {
                    contactType: "individual",
                    phoneNum: phoneNum,
                    phoneNumType: phone_num_type,
                    phoneNumClean: cleanPhoneNum,
                    contactName: contactName
                }
                
                if(contactName.indexOf("Hyphen") > -1){
                    console.log({
                        "raw": contactName,
                        "html": createHTMLEquivalentOfMessageBody(contactName, 'YES')
                    });
                }
                
                var typeAheadContact = createHTMLEquivalentOfMessageBody(contactName, 'YES') + " - " + createHTMLEquivalentOfMessageBody(phoneNum, 'YES') + " - " + phoneNumType;

/*                 var typeAheadContact = contactName + " - " + phoneNum + " - " + phoneNumType; */
                //check to see how the string you built looks ^                    
                /*                 console.log('The following should be all of your contacts'); */
                autoContacts.push(typeAheadContact);
                
                contactsArrayToMatchTypeAheadTo[typeAheadContact] = contactInfo;
                
                contactsFromPhoneGlobal.push(contactInfo);
            });
            //console.log("Thread phone_num_clean= " + thismessage.phone_num_clean);
            //logSuper("Thread phone_num_clean= " + thismessage.phone_num_clean);
        });
        
        chrome.tabs.sendMessage(tabIDToSendMessageTo, {
            phoneContacts: contactsFromPhoneGlobal
        }, function(response) {

        });

    }
}

function getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(phonenum_to_check, do_not_zeropad_optional) {
    var phonenum_normalized = "";
    var prefix_build = ""; /*         console.log(phonenum_to_check); */
    while (phonenum_to_check.search("[-]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace("-", ""); //check for '-' within phone number and remove
    }
    while (phonenum_to_check.search("[ ]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace(" ", ""); //check for '-' within phone number and remove
    }
    while (phonenum_to_check.search("[(]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace("(", ""); //check for '-' within phone number and remove
    }
    while (phonenum_to_check.search("[)]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace(")", ""); //check for '-' within phone number and remove
    }
    while (phonenum_to_check.search("[.]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace(".", ""); //check for '-' within phone number and remove
    }
    while (phonenum_to_check.search("[/]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace("/", ""); //check for '-' within phone number and remove
    }
    while (phonenum_to_check.search("[+]") > -1) //need while loop as there may be up to 3 hyphens in phone number
    {
        phonenum_to_check = phonenum_to_check.replace("+", ""); //check for '-' within phone number and remove
    }
    //after above cleanup, if the number is short, then zeropad since we are zeropadding the source # if it's short too.
    if ((!do_not_zeropad_optional) && (phonenum_to_check.length < 7)) phonenum_to_check = zeroPad(phonenum_to_check, 7) //last 7, and zeropadded.
    else phonenum_to_check = phonenum_to_check.substring(phonenum_to_check.length - 7);
    //just last 7, no zeropad 
    return phonenum_to_check;
}

//FIND CLEAN PHONE NUM CONTACT IN contactsFromPhoneGlobal ARRAY
function searchForCleanPhoneNumContact(cleanPhoneNum, phoneNum) {
    var matchedContact;
    $(contactsFromPhoneGlobal).each(function() {
        if (cleanPhoneNum == this.phoneNumClean) {
            matchedContact = this;
//            console.log(matchedContact);
            return false;
        } else {
            matchedContact = {
                phoneNum: phoneNum,
                phoneNumType: 1,
                phoneNumClean: cleanPhoneNum,
                contactName: phoneNum
            }
        } 
    });
    return matchedContact;
};

function genericGetContactNameFromCaches(phone_num_clean,full_phone_num){
	var numbersToGetContacts = new Array();
	
	if((full_phone_num) && (full_phone_num.indexOf('|') > -1))
		{
			//CRV this is likely a pipe delimited string of phoneNumbers for a group message thread.  
			numbersToGetContacts = full_phone_num.split("|");
		}
	else
		{
			numbersToGetContacts.push(full_phone_num);
		}
		
	var numberOfContactsToLookUp = numbersToGetContacts.length;
	
	var contactsString = '';
	
	for(var i = 0; i < numberOfContactsToLookUp; i++)
	{
		var full_phone_num = numbersToGetContacts[i];
		var num_or_name = full_phone_num;
		var phone_num_clean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(full_phone_num, 'do_not_zeropad');

		//MA sept 16th we undid this functionality MA & NCD testing when sender is an email. 
	      if(phone_num_clean==099999999999999)
       		{
       		//happens if message is from an email address (carrier email) -- phone_num gets set to 'xyz@gmail.com' but phone_num_clean gets set to 0
  //     		console.log('got a phone_num_clean equal to 0');
       		return('Unknown / Misc');

       		}
        	
//            	alert("phoneNumClean: "+ phone_num_clean);
        	var phoneContactObj = searchForCleanPhoneNumContact(phone_num_clean, full_phone_num);
        		   	 		
    	   	 		if (phoneContactObj != undefined){
    	//	       	 	console.log(phone_num_clean + " not found in cloud array");
        					num_or_name = phoneContactObj.contactName;
			   	 	} else {
        	        		num_or_name = full_phone_num;
    	//				console.log(phone_num_clean + " WAS found in cloud array");
                    }
	
	//        console.log("genericGetContactNameFromCaches is returning as the best contact name/number: " + num_or_name);
	
            	//we already createHTMLEquiv when we create the contactsFromPhoneGlobal array
    	        //num_or_name = createHTMLEquivalentOfMessageBody(num_or_name, 'YES');
    	        contactsString += num_or_name;

    	        if(i < (numberOfContactsToLookUp - 1))
	        	{ //CRV if this is not the last contact to look up, add a comma after it. 
		        	contactsString += ', ';
	        	}
        	
//            	console.log(phoneContactObj);
//	       console.log("Checking jStorage Contact Name for Phone Num Clean: " + phone_num_clean);
//	       var phoneContactObj=$.jStorage.get(username_prefix_jstrg_purpose + '|PC_'+ phone_num_clean ,"no-jstorage-val-found"); //2nd param is the default value if the key is not found in jStorage
//		   console.log("Result is: " + phoneContactObj);
//THE ABOVE 3 LINES SHOULD BE WHERE I LOOK UP THE ENTIRE CONTACT OBJECT
            
/*                 var phoneContactObj = blahhhhhh */
           //KL REMOVED THE IF STATEMENT BELOW BECAUSE I DON'T USE JSTORAGE	
	       //if not matched in jStorage, check the JS array that has the current list of phone contacts from cloud
/*
	       if (phoneContactObj=="no-jstorage-val-found")
   	 			{
//				console.log("NO LOCAL JSTORAGE MATCH FOR PHONE_NUM_CLEAN: " + phone_num_clean + " ... now check array loaded from cloud");
				phoneContactObj=getSinglePhoneContactInfoFromCloudArray(phone_num_clean);
				}
*/

	}
	//console.error(contactsString);
	return(contactsString);
			
};

function processIncomingPush(dataObject){
    
        //IF THE NEW_CONTENT FIELD OF THE DATAOBJECT EXISTS, THEN CHECK IF IT'S AN SMS OR NOT AND RUN SUBSEQUENT CODE
    if (dataObject.new_content !== undefined) {
        
        if(dataObject.new_content.stale_notif == 1){
            //if the stale notif flag is set to 1, then we do not want to send this CAPI to the content scripts.
            return false;
            
        }
        
        var capiMessageObj
        var dataType = dataObject.new_content.type;
        var inboxOutbox = dataObject.new_content.inbox_outbox;
        var cleanPhoneNum = dataObject.new_content.phone_num_clean;
        var phoneNum = dataObject.new_content.phone_num;
        var textBody = dataObject.new_content.body;
        var timeStamp = dataObject.new_content.ts_server;
        var messageID = dataObject.new_content.id;
        var sourceClient = dataObject.new_content.source_client;
        var momentDate = moment(timeStamp).format("MMM D, h:mm a");
        var fromContact = searchForCleanPhoneNumContact(cleanPhoneNum, phoneNum);
		var eventID = dataObject.new_content.event_id;
		var eventList = dataObject.new_content.event_list;
		                			                			                			
		if(eventID == undefined){
			eventID = 0; //CRV this was not a scheduled event.  Therefor we sent the event_id to 0 so that it will buildMessageHTML will know how to render the content
			eventList = '';
		}
		
        if (dataType == 10) {
            //IS IT A SMS??
            console.log('incoming SMS from contact: ' + fromContact);
//             console.log(fromContact);

            capiMessageObj = {
                receivedSMS: true,
                sender: fromContact,
                phone_num_clean: cleanPhoneNum,
                phone_num: phoneNum,
                ts_server: timeStamp,
                body: textBody,
                inbox_outbox: inboxOutbox,
                id: messageID,
                source_client: sourceClient,
                type: dataType,
                event_id: eventID,
                event_list: eventList,
                stale_notif_flag: dataObject.new_content.stale_notif_flag
            };
                                                
            //KL the function below checks if the user is active in gtext tab in the current window, and toggle the page title based off that.
            if(inboxOutbox === 60){
                _gaq.push(["_trackEvent","CRX-Gmail","Incoming-SMS",""]);

    			setTimeout(function(){
	    			recordIncomingMessageKMEvent({properties:{'Type':'SMS','Client':'CRX-New'}});
    			}, 6000);

                checkIfUserIsActiveInGtextTab({origin:"incomingCAPI", message: "New Message From " + fromContact.contactName});//if user is NOT active in a GText subclient tab, we are going to toggle the page title to alert them of this CAPI
            }
                        
        } else if ((dataType == 80) || (dataType == 81) || (dataType == 83)) {
            //IS IT A PHONE CALL??
            if (dataType == 80) {
                //DON'T SHOW IN-APP ALert for "Outgoing Call"!
            	_gaq.push(["_trackEvent","CRX-Gmail","Incoming-Phone-Call",""]);
                checkIfUserIsActiveInGtextTab({origin: "incomingCAPI", message: "Incoming Call From " + fromContact.contactName});

                capiMessageObj = {
                    incomingPhoneCall: true,
                    sender: fromContact,
                    stale_notif_flag: dataObject.new_content.stale_notif_flag
                }
                
            } else if(dataType == 81){
                //console.log("missed call");
                checkIfUserIsActiveInGtextTab({origin: "incomingCAPI", message: "Missed Call From" + fromContact.contactName});
                
                capiMessageObj = {
                    missedPhoneCall: true,
                    sender: fromContact,
                    stale_notif_flag: dataObject.new_content.stale_notif_flag
                }
                
            } else {
                console.log('your phone is making a call, don\'t need to know about it.');
                return false;
            }
            console.log('it\'s a phone call!')
        } else if (dataType == 11) {
            //incoming mms
            console.log('incoming MMS');
            if(inboxOutbox === 60){
                _gaq.push(["_trackEvent","CRX-Gmail","Incoming-MMS",""]);
    			setTimeout(function(){
	    			recordIncomingMessageKMEvent({properties:{'Type':'MMS','Client':'CRX-New'}});
    			}, 6000);
                checkIfUserIsActiveInGtextTab({origin: "incomingCAPI", message: "New Message From" + fromContact.contactName});
            }
            
            capiMessageObj = {
                receivedMMS: true,
                entireMessage: dataObject.new_content,
                sender: fromContact,
                phone_num_clean: cleanPhoneNum,
                phone_num: phoneNum,
                ts_server: timeStamp,
                body: textBody,
                inbox_outbox: inboxOutbox,
                id: messageID,
                source_client: sourceClient,
                type: dataType,
                mms_object_key: dataObject.new_content.mms_object_key,
                event_id: eventID,
                event_list: eventList,
                stale_notif_flag: dataObject.new_content.stale_notif_flag
            }
            

        } else if (dataType == 20){
//                                 console.log("incoming GroupMMS");
            var contactHeaderNames = genericGetContactNameFromCaches(cleanPhoneNum, phoneNum);
            var contentAuthor = dataObject.new_content.content_author;
            var contentAuthorClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(contentAuthor);
            
            fromContact = searchForCleanPhoneNumContact(contentAuthorClean, contentAuthor);
            
/*
            console.log(contactHeaderNames);
            console.log(sender);
*/

            if(inboxOutbox == 60){
	                                    
    			recordIncomingMessageKMEvent({properties:{'Type':'GroupText','Client':'CRX-New'}});
                checkIfUserIsActiveInGtextTab({origin: "incomingCAPI", message: "New Group Message From " + contactHeaderNames});
            }
            
            capiMessageObj = {
                receivedGroupMMS: true,
                sender: fromContact,
                fullPhoneNum: phoneNum,
                phone_num_clean: cleanPhoneNum,
                phone_num: phoneNum,
                contactHeaderNames: contactHeaderNames,
                ts_server: timeStamp,
                body: textBody,
                inbox_outbox: inboxOutbox,
                id: messageID,
                source_client: sourceClient,
                type: dataType,
                event_id: eventID,
                event_list: eventList,
                content_author: contentAuthor,
                stale_notif_flag: dataObject.new_content.stale_notif_flag
            };
            
            
        } else if (dataType == 21){
            var contactHeaderNames = genericGetContactNameFromCaches(cleanPhoneNum, phoneNum);
            var contentAuthor = dataObject.new_content.content_author;
            var contentAuthorClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(contentAuthor);                                
            
            fromContact = searchForCleanPhoneNumContact(contentAuthorClean, contentAuthor);
            
            if(inboxOutbox === 60){
                              
				//3/9/16 KL updated the type to "GroupPicText" from "GroupText" to match the value being sent from the webapp
    			recordIncomingMessageKMEvent({properties:{'Type':'GroupPicText','Client':'CRX-New'}});
                checkIfUserIsActiveInGtextTab({origin: "incomingCAPI", message: "New Group Message From " + contactHeaderNames});
            }
                                            
            capiMessageObj = {
                receivedGroupPicMMS: true,
                sender: fromContact,
                fullPhoneNum: phoneNum,
                phone_num_clean: cleanPhoneNum,
                phone_num: phoneNum,
                contactHeaderNames: contactHeaderNames,
                entireMessage: dataObject.new_content,
                ts_server: timeStamp,
                body: textBody,
                inbox_outbox: inboxOutbox,
                id: messageID,
                source_client: sourceClient,
                type: dataType,
                mms_object_key: dataObject.new_content.mms_object_key,
                event_id: eventID,
                event_list: eventList,
                content_author: contentAuthor,
                stale_notif_flag: dataObject.new_content.stale_notif_flag
            }
                                            
        } else {
                                        
            console.log("we received a new_content type, but were unable to recognize the type: " + dataType + ".  And this is the entire obj: ");    
            console.log(dataObject.new_content);
            return; 
            
            //If we are getting into this else block, then we are not looking for this new_content type.  So let's look at it in GA so that we can check what is causing the error. So we should not try to send a message to the content scripts. 7/24/14 KL
        }
        
        sendThisMessageToAllContentScripts(capiMessageObj);

    } else if(dataObject['event_update_notify'] !== undefined){
	  	
        capiMessageObj = {
            receivedEventUpdate: true,
            CAPI: dataObject,
        }
        
        sendThisMessageToAllContentScripts(capiMessageObj);

	  	            			  	
    } else if (dataObject.ack_processed !== undefined) {
        var dataType = dataObject.ack_processed.type;
        var inboxOutbox = dataObject.ack_processed.inbox_outbox;
        var cleanPhoneNum = dataObject.ack_processed.phone_num_clean;
        var phoneNum = dataObject.ack_processed.phone_num;
        var textBody = dataObject.ack_processed.body;
        var timeStamp = dataObject.ack_processed.ts_server+ ' UTC';
        var messageID = dataObject.ack_processed.id;
        var sourceClient = dataObject.ack_processed.source_client;
        var momentDate = moment(timeStamp).format("MMM D, h:mm a");
        var fromContact = searchForCleanPhoneNumContact(cleanPhoneNum, phoneNum);
		var eventID = dataObject.ack_processed.event_id;
		var eventList = dataObject.ack_processed.event_list;
		                			
		if(eventID == undefined){
			eventID = 0; //CRV this was not a scheduled event.  Therefor we sent the event_id to 0 so that it will buildMessageHTML will know how to render the content
			eventList = '';
		}
        console.log("text sent via sendc2dm servlet");
        
        capiMessageObj = {
            receivedSMSfromSendc2dm: true,
            sender: fromContact,
            phone_num_clean: cleanPhoneNum,
            phone_num: phoneNum,
            ts_server: timeStamp,
            body: textBody,
            inbox_outbox: inboxOutbox,
            id: messageID,
            source_client: sourceClient,
            type: dataType,
            event_id: eventID,
            event_list: eventList,
            status_route: dataObject.ack_processed.status_route
        }
                
        sendThisMessageToAllContentScripts(capiMessageObj);

    } else if (dataObject.phone_status !== undefined) {
        var phoneStatus = dataObject.phone_status;
        var batteryLevel = phoneStatus.battery_level;
        var phoneCharging = phoneStatus.battery_is_charging;
        var currentAPKVersion = phoneStatus.current_version;
        var lastPSTimeStamp = phoneStatus.ts_phone_utc;

        capiMessageObj = {
            receivedPhoneStatus: true,
            batteryLevel: batteryLevel,
            phoneCharging: phoneCharging,
            currentAPKVersion: currentAPKVersion,
            lastTimeStamp: lastPSTimeStamp
        }
        
        sendThisMessageToAllContentScripts(capiMessageObj);

	} else if (dataObject.initial_mms_wakeup !== undefined){
		//KL removed this on 1.22.18 from his dev GText branch
/*
    	var dataType = dataObject.initial_mms_wakeup.type;
    	var phoneNum = dataObject.initial_mms_wakeup.content_author;
    	var phoneNumClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(phoneNum);
    	var sender = searchForCleanPhoneNumContact(phoneNumClean, phoneNum);
    	var dataSize = dataObject.initial_mms_wakeup.size;
    	
        if(dataType == 11){
            capiMessageObj = {
                receivedInitialWakeUpForPicMMS: true,
                sender: sender
            }
            
            sendThisMessageToAllContentScripts(capiMessageObj);
            
        } else if (dataType == 20){
            
            capiMessageObj = {
                receivedInitialWakeUpForGroupMMS: true,
                sender: sender
            }
         
             sendThisMessageToAllContentScripts(capiMessageObj);
            
        }
*/
	} else if (dataObject['contact_photo_refreshed_from_phone'] !== undefined) {
		//alert('contact photo arrived!');
	//console.log(dataObject['new_contact_photo_pushed_to_phone']);

		var contactNumberPhotoJustUpdated = dataObject['contact_photo_refreshed_from_phone']['phone_num'];
		var phoneNumClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(contactNumberPhotoJustUpdated, 'do_not_zeropad');

		
		getRefreshedContactPhotoAndSaveToJStorage(phoneNumClean, contactNumberPhotoJustUpdated);		
	} else if (dataObject["generic_notification"] !== undefined) {
    	
        var genericNotifCapiInfo = dataObject.generic_notification;
        
        var capiMessageObj = {
            generic_notif: true,
            details : genericNotifCapiInfo
        };

        sendThisMessageToAllContentScripts(capiMessageObj);
            	
	} else if(dataObject.client_changed_login_state !== undefined){
        console.log("received a CAPI that user signed out from a client at: " + new Date());
    	var loginStateChangeInfo = dataObject.client_changed_login_state;

        //after receiving this CAPI, then we need to check our login status.        
        setTimeout(function(){
        
            //Waiting for 1 second because the texty server page (/signout) still has to render to drop the cookie. 8/5/14 KL
            
            checkUserLoginStatusAfterCAPINotifyLogout();
            
        }, 1000);//this is a separate getuserinfofull call to check if the user has logged out in the context of this browser. If we are in fact not logged in, then we should restart the CRX  8/5/14 KL  	
	
	} else {
		console.log("unrecognized CAPI Object");
		console.log(dataObject);
	}

}

//CAPI SAFETY PROTOCOL
function checkIfUserIsActiveInGtextTab(options){
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if(tabs.length > 0){
            var gTextTabCheck = tabsRunningContentScriptByID.indexOf(tabs[0].id);

            if(gTextTabCheck > -1){//the user is active in a subclient tab
                if(((options.origin == "onActivatedListener") && (contentScriptsAreTogglingTitles)) || ((options.hasOwnProperty("message")) && (options.message.indexOf("Missed Call") > -1))) {//the user is already "active" within a tab running gtext or the user got a missed call, we also want to dismiss the interval
                    contentScriptsAreTogglingTitles = false;
                    togglePageTitle(false);
                } else if(options.origin == "messageSendFailure"){//user is currently active in a subclient, AND this check was triggered from an onclick of a notif created by a message send failure
                    processIncomingPush({"new_content": options.message_details});
                }
            } else {//the user is not active in a subclient tab
                if((options.origin == "incomingCAPI") && (!contentScriptsAreTogglingTitles)){//the user is running gtext, but not currently active in a tab that is running it.
                    //console.error("start interval");
                    contentScriptsAreTogglingTitles = true;
//                     options.message = "MightyText";
//                     console.log(options.message)
//                     options.message = "";
                    togglePageTitle(true, options.message);
                } else if(options.origin == "messageSendFailure"){
                    //query for first active tab running content script able to receive capi's

                    makeUserActiveInSubClient({capi_opened: true, capi_details: options.message_details, tab_array_index: 0});
                }    
            }
        }
    });   
};

function togglePageTitle(initiateToggle, messageToDisplay){
    
    var pageTitleToggleMsgObj
    
    if((initiateToggle) && (contentScriptsAreTogglingTitles)){
    	pageTitleToggleMsgObj = {
            notifyUserOfIncomingMessageInTab: true,
            message: messageToDisplay
        }                         
    } else if ((!initiateToggle) && (!contentScriptsAreTogglingTitles)){
        console.log("stop toggle interval!");
    	pageTitleToggleMsgObj = {
            stopNotifOfIncomingMessageInTab: true
        }                           
    }
    
    sendThisMessageToAllContentScripts(pageTitleToggleMsgObj)
    //when 1 of these tabs becomes active, it should send a message to the background script telling IT to tell all other tabs to stop toggling their page titles.    
    
};

function makeUserActiveInSubClient(options){
    var index = options.tab_array_index;//this is being passed as an option in the function to tell us which item in the global tabsrunningcontentbyid array we should try sending a message to.
    
    if(pushEnabledTabs[index] != undefined){
        var tabID = pushEnabledTabs[index];
        chrome.tabs.sendMessage(tabID, {
            canReceiveCapiCheck: true
        }, function(response){
            
            if((typeof response != "undefined") && (!response.subclient_tab_not_enabled)){

                chrome.tabs.update(tabID, {
                    selected: true
                }, function(tab){
                    processIncomingPush({"new_content": options.capi_details});                    
                });
            } else {//we did not get a response from this tab, it's not able to receive CAPI's let's try the next item in the array
                var newTabIndexToTry = options.tab_array_index + 1;
                    options.tab_array_index = newTabIndexToTry;                    
                makeUserActiveInSubClient(options);
            }
        });        
    } else {
        //this function is currently only triggered on click of a message send failure notif.  So, we are going to open a quick reply if we have reached the end of the loop. 
        //open quick reply
        openWebApp("quickview", options.capi_details.id);
    }
}

/*
function startNewCAPIHealthCheckInterval() {//not in use as of 1.11.18 KL
    
    window.clearInterval(globalCAPIHealthCheckInterval);
    globalCAPIHealthCheckInterval = 0;

    globalCAPIHealthCheckInterval = setInterval(function(){
        checkLastCAPIReceived();
    }, 20000);
    
    globalCAPIHealthCheckIntervalStatus = true;//we are storing a global var so that we know each time the interval is set and cleared.  So that, if the user opens a new tab when there is already a capi open.. then we can start an interval again. KL 9/29/14
        
};

function checkLastCAPIReceived() {//not in use as of 1.16.18 KL
    
    var secondsSinceLastCAPIIncoming = getSecondsSinceLastCAPI();
    
    console.log("Current time is: " + new Date() + "checking when the amount of time since the last CAPI was received");
    console.log(secondsSinceLastCAPIIncoming + " seconds since last CAPI rcvd.")
    
    if (secondsSinceLastCAPIIncoming > 300){ //if it's been more than 5 minutes, then do a CAPI-only check (no battery status returned, no other capi returned)
        console.log('*** Has been > 300 seconds, so issue a CAPI Health Check. Issuing a CAPI health check, then in 5 seconds we are going to issue a final broken CAPI health check.');
        sendTestPushMessage('CAPI_HEALTH_CHECK_FROM_GTEXT_2015');
        
        setTimeout(function(){
	        finalPushSocketBrokenCheck(300)
        }, 5000);
        
    } else if (secondsSinceLastCAPIIncoming > 240){ //if it's been more than 4 minutes, then do a CAPI-only check (no battery status returned, no other capi returned)
    
        sendTestPushMessage('CAPI_HEALTH_CHECK_FROM_GTEXT_2015');
       console.log('Has been > 240 seconds, so issue a CAPI Health Check');
    } else{

       console.log('Has been < 240 seconds, so no need to issue a new CAPI health check');

    }
};
*/

function finalPushSocketBrokenCheck(secsThreshold) {
    
    var secondsSinceLastCAPIIncoming = getSecondsSinceLastPushRcvd();
    
        console.log("Inside final capi broken check.  If it's been > 5 minutes since last capi rcvd, then we are going to check the user's internet connection.  Been " + secondsSinceLastCAPIIncoming + " since last CAPI rcvd.")

    if (secondsSinceLastCAPIIncoming > secsThreshold){
        console.log("inside of finalPushSocketBrokenCheck.  Have not received an incoming CAPI for > 5 minutes so we are checking the internet connection next. It's been: " + secondsSinceLastCAPIIncoming + " seconds since the last CAPI.");
        checkInternetConnectionOutbound(reestablishPushSocket);
    }
    
}

function getSecondsSinceLastPushRcvd() {
    var ts_moment_last_capi = moment(globalTsLastPushRcvd);
    var now = moment();

    //using the moment library...
    return (now.diff(ts_moment_last_capi, 'seconds'));
}

function checkInternetConnectionOutbound(nextFunctionAfterNetworkSuccess) {
    console.log('--------Checking outbound internet connection (font file on google)');
    $.ajax({
        type: "GET",
        url: "https://ajax.googleapis.com/ajax/libs/webfont/1.3.0/webfont.js",
        cache: false,
        dataType: 'text',
        success: function(msg) {            
            console.log("SUCCESS - User has internet connection.");
            nextFunctionAfterNetworkSuccess();
        },
        error: function() {
            // if Ajax doesn't succeed - do nothing -- because poller will call this function again automatically so we don't want to chain at this point.
            console.log("FAILED - User does not have an internet connection.");
        }
    });
}

function sendTestPushMessage(body_text_info, testPushRequestCompatibilityCheck, optionalTabID){
    
    console.log("-------------------------------- Sending PUSH Test Message from GText -----------------------------------");
/*     body_text_to_send = body_text_info + " ---- " + Date(); */
//replacing the date string above with a new unixtimestamp because there was an error when the string was getting encoded and being sent as a get param for certain browsers KL 6/3/14
    body_text_to_send = body_text_info + " ---- " + new Date().getTime().toString();

    var full_url_test = baseUrl + "/test?function=capi&body=" + body_text_to_send + "&phone_num=555555555";
    var bodyContent = $.ajax({
        url: full_url_test,
        type: "GET",
        global: false,
        dataType: "text",
        success: function(reply_server) {
            console.log(reply_server);
            if ((reply_server.indexOf("user not logged in") > -1)) {
                console.log("Server returned that the user is no longer signed in to MT at: " + new Date() + " in success callback of request to send a TEST CAPI. About to tell all tabs running cs.js this and then reload bg.html");
                alertAllContentScriptsOfUserSignedOutThenReload({trigger: "send-test-capi-request"});
//                checkNumTabsRunningContentScriptThenClearGlobalIntervals();//this function will check the number of tabs running the content script.  If it is less than 1, then we will clear the global intervals
                
                console.error("User is not logged in to MightyText -- found out during CAPI Health time check");
            } else if (reply_server.indexOf("CAPI test sent successfully") != -1) {
//KL commented the code below because we were not actively checking this GA, and should be able to find the capi health checks from the server by the gtext specific BODY that we are passing 1.16.18 KL
/*
                console.log("Successfully SENT CAPI test message from GTEXT");
                
                if(getRandomInt(0, 100) === 42){//only want to make this call 1% of the time.
                    _gaq.push(["_trackEvent","CRX-Gmail","CAPI-Health-Check-Issued-1pct-Sample", userEmail]);                    
                }
*/
                
                if(testPushRequestCompatibilityCheck){//this testPushRequestCompatibilityCheck var is a boolean that is being set to let us know when a user has multiple tabs open of a subclient open and we only want to send a test CAPI, to see if the capi is still open. If we got here, we know we were able to send a test CAPI, (not if it's opened.) so we let that tab know. 
                    //sendMessage here after confirming CAPI Test success
                    
                    var tabID = optionalTabID;//the optionalTabID should always be passed when the testPushRequestCompatibilityCheck flag is equal to true.
                    chrome.tabs.sendMessage(tabID, {
                        CAPIOpened: true
                    }, function(response) {
                        if(
	                        (typeof response != "undefined") && 
	                        (response.hasOwnProperty("confirmation"))&&
	                        (pushEnabledTabs.indexOf(tabID) < 0)//this tab is as not already in the "push enabled tabs" array
                        ){
                            pushEnabledTabs.push(tabID);
                        }
                    });
                } else {
                    //do nothing 
                }
            } 
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error("error in sendTestPushMessage");
            console.error(new Date(), jqXHR, textStatus, errorThrown);
        }
    }).responseText;
}
//END CAPI SAFETY PROTOCOL

//GRAB USER SETTINGS FROM TEXTY SERVER

function getUserSettingsFromServer(destination, tabID){
    var urlMighty = baseUrl + '/usersettings?function=getUserSettings';
    var user_settings_json;
    var bodyContent = $.ajax({
        url: urlMighty,
        global: false,
        type: "GET",
        dataType: "json",
        timeout: 8000,
        error: function(jqXHR, textStatus, errorThrown) { /* 	        _gaq.push(["_trackEvent","WebApp","AjaxError","getUserSettings-" + errorThrown,1]);	 */
            console.error("Error in getUserSettingsFromServer");
            sendServerSettingsToDestination("error", destination, tabID);
        },
        success: function(json_data) {
            if (json_data.user && (json_data.user.indexOf("user not logged in") > -1)) { 
            //this redirects the user to the login screen if they have not already logged in. */
                currentUserServerSettings == "user not logged in";
                console.log("Server responded that the user was not logged in at: " + new Date() + " while getting the user's settings.");
                alertAllContentScriptsOfUserSignedOutThenReload({trigger: "get-user-settings"});
                sendServerSettingsToDestination("error", destination, tabID);
            } else {
                console.log(json_data);
                var objNewSettings = '';
                if (json_data.usersettings.settings_list) //Settings List (big JSON) was found from server                
                {
                    console.log("User Server Settings: "+ json_data.usersettings.settings_list.value);
                    objNewSettings = jQuery.parseJSON(json_data.usersettings.settings_list.value);
                    //DONT NEED THE CODE BELOW BECAUSE THIS WILL ALREADY BE DISPLAYING THE SETTINGS PAGE OF THE CRX
                    //sets the global variable that we use all throughout the app
/*
                    if (show_settings_pane) //optionally, show the settings pane
                    showSettingsPane(json_data.usersettings);
*/
/*                     console.log('Settings Found from server. Settings Global Settings - here: '); */
/*
console.log("THIS SHOULD BE A JSON OBJECT IT IS A CONSOLE OF A VARIABLE AFTER JQUERY.PARSEJSON IS USED.");                     
                    console.log(objNewSettings);
*/
                    currentUserServerSettings = objNewSettings;
                    sendServerSettingsToDestination(objNewSettings, destination, tabID);
                } else //No "Settings List" was found, -- so set the default values...
                {
                    //alert('setting default settings');
                    objNewSettings = jQuery.parseJSON("{}");
                    var defaultSettingsJSON = '{"enter_to_send":"1","notif_content":"2","notif_toggle_on_off":"1","notif_dismiss_time":"9999", "default_view": "CLASSIC", "delete_sync_to_phone": "0", "theme":"default", "default_multi_contact": "group"}'; ///DEFAULT VALUES!
                    saveUserSettings('settings_list', defaultSettingsJSON, false, tabID);
                }
            }
        } //end of else call
    }).responseText;
}
//SAVING USER SETTINGS

function saveUserSettings(param_name, setting_value, is_user_triggered_settings_save, tabID, optionalRequestObj) {
    var postVarBuilder = '';
    var urlMighty = baseUrl + '/usersettings';
/*     urlMighty += '&' + param_name + '=' + encodeURIComponent(setting_value); */
    var postVarBuilder = 'function=updateUserSettings&' + param_name + '=' + encodeURIComponent(setting_value);;
    
    var bodyContent = $.ajax({
        url: urlMighty,
        global: false,
        xhrFields: {
            withCredentials: true
        },
        //v important!
        type: "POST",
        data: postVarBuilder,
        //if browser supports CORS, then this is just blank
        dataType: "json",
        success: function(json_data) {
            if ((json_data.user) && (json_data.user.indexOf("user not logged in") > -1)) {
                //user can only be triggering this update from the options page, so we are going to send a message to display an error.  
                //This is less likely to happen because if the user is not logged in to MT when loading the settings page, then we are going to disable the enter to send setting
                //Enter to send is also the ONLY server side setting used in GText
                chrome.runtime.sendMessage({//we are alerting the options page of an error, so we can use the chrome.runtime send message method
                    errorUpdatingServerSetting: true
                });
                return;
            }

            if (is_user_triggered_settings_save) {
            //user triggered save? or set by app first time?
                if (json_data.usersettings == 'success') {
                    console.log("successfully saved");
                    getUserSettingsFromServer("forContentScript", tabID);
                    //  NONE OF THE SELECTORS BELOW EXIST IN CRX SO I COMMENTED THEM OUT.  THIS CODE JUST SIMULATES PROGRESS NOTIFS FOR SETTINGS BEING SAVED
                } else {
                    //  DO NOTHING
                }
            } else {
            //not user triggered, so is likely the first auto save done by the app to set initial default settings!
                if (json_data.usersettings == 'success') {
                    console.log("successfully saved the server settings for the first time.");
                } else {
                    //do nothing.   
                }
            }
        }
    });
}

function openWebApp(view, messageID) {

    var DestinationURL = 'https://mightytext.net/web/';

    var createObj = {};
    
    if(view == "quickview"){
    
        createObj["url"] = DestinationURL;
    
        if(messageID){
            createObj["url"] = DestinationURL + "/?1/#mode=quick&msgid=" + messageID;
        }
        
        var windowWidth
        var chromeAppVersion = window.navigator.appVersion;
        
        if(chromeAppVersion.indexOf("Macintosh") > -1){
            windowWidth = 500;
        } else {
            windowWidth = 516;
        }
        
        createObj.width = windowWidth;
        createObj.height = 600;
        createObj.type = "popup";
        createObj.left = screen.width - (windowWidth + 7); // 7px buffer is good.
        
        chrome.windows.create(createObj); 
               
    } else {
        
        createObj["active"] = true;
        
        if (view == "events"){
            createObj["url"] = DestinationURL + "#mode=events"
            
        } else if (view == "pro_promo"){

            createObj["url"] = DestinationURL + "#promo=true"
/*
            chrome.tabs.create({
                url: DestinationURL,
                active: true
            });
*/
        } else  if (view == "templates_and_signatures"){
            createObj["url"] = DestinationURL + "#mode=settings&pane=templates"
        } else  if (view == "compose-new"){
            createObj["url"] = DestinationURL + "#mode=compose-new"
        }

        chrome.tabs.create(createObj);

    } 
    
}

function PushToAppStore(){
    chrome.tabs.create({
        url: signOutThenAppStore,
        active: true
    });
};

function PushToGoogleAuth(origin){
    chrome.tabs.query({
        url: "https://accounts.google.com/ServiceLogin?service=ah&passive=true&continue=https://appengine.google.com/_ah/conflogin%3Fcontinue%3Dhttps://textyserver.appspot.com*"
    }, function(tabs) {
        if (tabs[0]) {
            chrome.tabs.update(tabs[0].id, {
                selected: true
            });
        } else {

            loginBackInToMightyText(origin);

        }
    });
}

function loginBackInToMightyText(originOfRequest){
    var smartSignInUrlCRX = signInUrlCRX + '%26signout_source%3D' + originOfRequest;
    //var smartSignInUrlCRX = signInUrlCRX + "%23godamnit";
    
    chrome.windows.create({
        url: smartSignInUrlCRX,
        width: 500,
        height: 500,
        type: "popup"
    });        
    
/*
    chrome.tabs.create({
        url: smartSignInUrlCRX,
        active: true
    });
*/
}

function initializeGtext(optionalOriginOfRequest, optionalTabIDToInitialize){

//THIS IS JUST A CHECK TO SEE IF THE USER IS LOGGED IN. AMONG OTHER THINGS.    
callServlet('/content?function=getUserInfoFull', 'getUserInfo', optionalOriginOfRequest, optionalTabIDToInitialize);

};

function sendServerSettingsToDestination(settings, destination, tabID){
    if (destination == "forContentScript" && settings != "error"){//! send updated server setting to all tabs running content script
        var serverSettingsMsgObj = {
            gotUserSettings: true,
            userSettings: settings
        };
        sendThisMessageToAllContentScripts(serverSettingsMsgObj);
    } else if(destination == "forOptionsPage" && settings != "error"){
        chrome.runtime.sendMessage({
                gotUserSettingsForOptionsPage: true,
                userSettings: settings        
            }, function(response){
                var lastError = chrome.runtime.lastError;
                if (lastError) {
                    console.log("Got an error when sending the \"gotUserSettingsForOptionsPage\". This is was the error message was: \""+lastError.message+"\"");
                        //BECAUSE THE RECEIVING END OF THIS MESSAGE DIDN'T EXIST, IT MEANS THAT THE SETTINGS WERE LOADED DIRECTLY IN GMAIL. THEREFORE, I NEED TO SEND A MESSAGE TO THE TAB ITSELF INSTEAD OF JUST THE SCRIPT, BECAUSE OPTIONS.JS IS BEING LOADED INSIDE OF GMAIL.                    
                        
                    chrome.tabs.sendMessage(tabID, {
                        gotUserSettingsForOptionsPage: true,
                        userSettings: settings
                    }, function(response) {
                        console.log(response.confirmation);
                    });                    
                    return;
                } else {
                    console.log("options page loaded outside of gmail. The user clicked options in chrome://extensions.");
                }
                console.log(response.confirmation);
        });

    } else if (destination == "forOptionsPage" && settings == "error"){
        chrome.runtime.sendMessage({
                gotSettingsErrorForOptionsPage: true,
            }, function(response){
                console.log(response.confirmation);
        });
        
    }
    console.log("user's server settings");
    console.log(settings);
}

/* function alertOptionsPageOfChangeInServerSetting(settings){ */

/* }; */

function getGoogleChromeLocalStorageSettings(LocalSettingsDestination, optionalUpdateParam){
    
    chrome.storage.local.get(null, function(data) {//if any values are not set, then we should set the default values
        var chromeLocalSettings = '';
        if (!data.gmail_preference) {
            chrome.storage.local.set({ "gmail_preference":"1"});
        }
        if (!data.fb_preference) {
            chrome.storage.local.set({ "fb_preference":"0"});
        }
        if (!data.ongoing_conversations){
            chrome.storage.local.set({ "ongoing_conversations":"0"});
        }
        if (!data.gmail_notifs){
            chrome.storage.local.set({ "gmail_notifs":"1"});
        }
        if (!data.fb_notifs){
            chrome.storage.local.set({ "fb_notifs":"0"});
        } 
        if (!data.multiple_accounts){
            chrome.storage.local.set({ "multiple_accounts":"0"});
        }
        if (!data.displayMTLinks_texts){
            chrome.storage.local.set({ "displayMTLinks_texts":"1"});
        }
        if (!data.displayMTLinks_media){
            chrome.storage.local.set({ "displayMTLinks_media":"1"});
        } 
        if (!data.enable_logs){
            chrome.storage.local.set({ "enable_logs":"0"});
        }
    });    
}

function supportMultipleAccounts(supportCheck){
    if(supportCheck == "support"){
        multipleAccountSupport = true;
    } else if (supportCheck == "don't support"){
        multipleAccountSupport = false;
    } else {
        console.error("Error in supportMultipleAccounts.");
    }
}

//KEEP THIS LINE SO THAT YOU CAN RESET YOUR SETTINGS. 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* saveUserSettings('settings_list', '{"enter_to_send":1,"notif_content":2,"notif_toggle_on_off":1,"notif_dismiss_time":9999}', false); */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function confirmTheseTabsRunContentScript(tabIDsToQuery){
    
    var numTabsToQuery = tabIDsToQuery.length;
    
    $(tabIDsToQuery).each(function(index, item){
        
        var tabIDUnderScrutiny = item;

    	chrome.tabs.sendMessage(tabIDUnderScrutiny, {
            contentScriptCheck: true
        }, function(response) {

            var lastError = chrome.runtime.lastError,
                indexOfTabIDUnderScrutiny = tabsRunningContentScriptByID.indexOf(tabIDUnderScrutiny);
                
            var numTabsMessageSentTo = index + 1;
            
            if (lastError && (indexOfTabIDUnderScrutiny > -1)) {
                tabsRunningContentScriptByID.splice(indexOfTabIDUnderScrutiny, 1);
                checkNumTabsRunningContentScriptThenClearGlobalIntervals();
            } else {
                console.log("[Content Script Check] Tab(s): " + tabIDsToQuery + " is running the content script");
            }
                        
        });

    });
    
}

function confirmTheseTabsCanReceiveCapiMsgs(tabs){
    pushEnabledTabs = tabs;
    
    $(tabs).each(function(index, item){
        
        var tabIDUnderScrutiny = item;

    	chrome.tabs.sendMessage(tabIDUnderScrutiny, {
            canReceiveCapiCheck: true
        }, function(response) {

            var lastError = chrome.runtime.lastError,
                indexOfTabIDUnderScrutiny = pushEnabledTabs.indexOf(tabIDUnderScrutiny);
                
            if(lastError){
//                 console.log("!!!! " + lastError.message)
            }
                            
            if ((lastError && (indexOfTabIDUnderScrutiny > -1)) || (typeof response == "undefined")) {
                pushEnabledTabs.splice(indexOfTabIDUnderScrutiny, 1);
                checkNumTabsRunningContentScriptThenClearGlobalIntervals();
            }
                        
        });

    });
    
}

function addThisHostToArray(hostToAdd){
    
    chrome.tabs.query({
        url: "*://" + hostToAdd + "/*"
    }, function(tabs) {
        var tabsRunningContentScript = new Array();
        $(tabs).each(function(){
            tabsRunningContentScript.push(this.id);
            if(tabsRunningContentScriptByID.length === 0){
                tabsRunningContentScriptByID.push(this.id);
            } else {
                var idToMatch = this.id;
                console.log("CHECKING TO SEE IF: "+ idToMatch +" IS IN THE ARRAY");
                if (tabsRunningContentScriptByID.indexOf(idToMatch) > -1){
                    console.log("nice try. already have this tab: "+ idToMatch);
                } else {
                    console.log("adding this ID: "+ idToMatch);
                    tabsRunningContentScriptByID.push(idToMatch);
                }
            }
        });
        confirmTheseTabsRunContentScript(tabsRunningContentScript);
    });

}

function checkNumTabsRunningContentScriptThenClearGlobalIntervals(){
    if (tabsRunningContentScriptByID["length"] < 1){//if there are no tabs running the content script, then we should clear the getphonestatus and capihealthcheck intervals
        console.log("!!! about to clear global intervals !!!");
        clearGlobalIntervals();

    } else {
        console.log("Good, there are still tabs running the content script for GText. Don't clear interval set for requesting Phone Status and CAPI Health Check.");
    }
}

function doIntercomSetup(username,dateTimeRegisteredAsString, userInfo, client_string){
    
    var ts_user_account_created = Math.round((new Date(dateTimeRegisteredAsString)).getTime() / 1000);
    
    var currentAndroidAppVersion = userInfo["user_info_full"]["current_app_version"];
    var TSLastLoginAsString = userInfo["user_info_full"]["ts_last_login"];
    var ts_last_login = Math.round((new Date(TSLastLoginAsString)).getTime() / 1000);
    
    var tsFirstLoginOnAnyClient = userInfo["user_info_full"]["ts_first_login"];
    var ts_first_login = Math.round((new Date(tsFirstLoginOnAnyClient)).getTime() / 1000);
    
    var proUserStatus = 'NO';
    if(isAProUser)
    	{
    		proUserStatus = 'YES';
    	}
    

    //console.log(dateTimeRegisteredAsString);
    //console.log(ts_user_account_created);
    
    //console.log(TSLastLoginAsString);
    //console.log(ts_last_login);
    
    intercomSettings = {
        // TODO: The current logged in user's email address.
        email: username,
        // TODO: The current logged in user's sign-up date as a Unix timestamp.
        created_at: ts_user_account_created,
        app_id: "7guo5kws",
        web_app: client_string,
        phone_app_version: currentAndroidAppVersion,
        ts_last_login_at: ts_last_login,
        wagda: manifest.version,
        app_version: manifest["version"],
        pro_user: proUserStatus,
        "day-last-seen": getCurrentWeekdayName()
    };
    
    //On 10/14/14 We implemented a timestamp for the first time a user ever logs in on any client.  For any new signups starting now, we want to pass this information to that user's profile on intercom. KL 
    if(tsFirstLoginOnAnyClient != undefined){
        intercomSettings["ts_first_login_at"] = ts_first_login;
    }
    
    console.log(intercomSettings);
    
    if(isAProUser){

        intercomSettings["pro_user"] = "YES";

    }
    
    if(userInfo["billing_info"]){

        intercomSettings["plan_id"] = userInfo["billing_info"]["plan_id"];
        
    }
    
    window.Intercom('boot', intercomSettings);  
    
}

/* START CODE FOR SAVING ANY PHOTO ON INTERNET TO YOUR PHONE */

function handleClick(info, tab, context){

    var clickEventInfo = {
       "info":info,
       "tab":tab,
       "context": context         
    }

    console.log(clickEventInfo);

    if((info["frameUrl"] != undefined)&&(String(info["frameUrl"]).indexOf("mightytext.net") > -1)){//are the user's trying to interact inside of another iFrame? If so, is it an MT iframe? Are they trying t trigger another overlay ontop of an existing one? Don't let them.
            return false
    } else {
    
		_kmq.push(['record', 'Context Menu Action', {'Context-Menu-Click': context,'Client':'CRX'}]);
        _gaq.push(["_trackEvent","CRX-ContextMenu","Context-Menu-Click", context]);
        
//        _gaq.push(["_trackEvent",request.GAEventInfo.category,request.GAEventInfo.action,request.GAEventInfo.label]);
		
        chrome.tabs.insertCSS(tab["id"], {file: "css/web_to_phone.css"}, function (){//INSERT NECESSARY STYLESHEET FOR HTML.  WILL PROBABLY MIGRATE TO INLINE STYLING TO AVOID MULTIPLE STYLESHEETS INSERTED.
            console.log("inserted web_to_phone.css");
        });

        chrome.tabs.executeScript(tab["id"], {file: "js/jquery1.9.1.min.js"}, function(){
            console.log("executed jquery");
            chrome.tabs.executeScript(tab["id"], {file: "js/web_to_phone.js"}, function(){
                console.log("executed web_to_phone.js");
                    
                    if(context != "image"){
                        shortenContextURLThenBuildIframeURL(clickEventInfo, tab["id"])
                    }
                    sendClickInfoToContentScript(clickEventInfo, tab["id"])
            });            
        });
    }        
}

function sendClickInfoToContentScript(info, tabID){
	chrome.tabs.sendMessage(tabID, {//SEND MESSAGE TO THE CONTENT SCRIPT WE JUST INSERTED WITH THE CLICK EVEN INFO
        contextMenuInfo: info,
    }, function(response) {
        console.log(response);                    
    });
}

function syncToPhone(info){
    console.log(info);
    if(info.context == "image"){    
        body = " ";
        action = "fetch_binary_from_url_store_on_device";
        action_data = body + "||" + info["info"]["srcUrl"];
    } else if (info.context == "page"){
        action = "launch_from_url";
        action_data = info["info"]["pageUrl"];
    }
    sendOtherC2DM(action, action_data, null, info["tab"]["id"]);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.getFrameURL){
            sendResponse({
                confirmation: "{\"url\":\""+ iFrameURL +"\"}"
            })                            
        } else if (request.injectOverlay){
            injectMightyOverlay();
            sendResponse({
                confirmation: "{\"overlayAttached\":\"true\"}"
            })
        } else if (request.sendOtherC2DM){
            
            syncToPhone(request.action_data);
                        
            sendResponse({
                confirmation: "{\"requestToSendImg\":\"true\"}"
            })                
        } 
});

//PAGE ACTION CLICK EVENT HANDLER

function tellCSToOpenWidget(clickInfo){
    var infoObj = {
        "pageUrl": clickInfo["url"]
    }
    var pageActionData = {
        "context":"page",
        "info": {
            "pageUrl": clickInfo["url"]
        },
        "tab":{
            "title":clickInfo["title"],
            "id":clickInfo["id"]
        }
    }
    
    handleClick(pageActionData["info"], pageActionData["tab"], "page");
}

function alertWeb2PhoneOfSendC2DMSuccess(tabId){
	chrome.tabs.sendMessage(tabId, {//SEND MESSAGE TO THE CONTENT SCRIPT WE JUST INSERTED WITH THE CLICK EVEN INFO
        sendC2DMSuccess: true
    }, function(response) {
        console.log(response);                    
    });
}

function enableFacebookThenOpenTab(){
    chrome.storage.local.set({
        'fb_preference': JSON.stringify(1),
        'fb_notifs': JSON.stringify(1)
    }, function() {
        // Notify that we saved.
        console.log('Enabled the facebook setting for this version.');
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs){
                console.log(tabs);
                
                var activeTab = tabs[0];
                
                if(activeTab["url"].indexOf("facebook.com") > -1){//check if the user is currently in facebook, if so then activate the content script in this tab instead of opening a new one by default.
                    insertMightyTextIntoThisTab(activeTab["id"]);
                } else {
                    chrome.tabs.create({
                        url: "http://facebook.com",
                        active: true
                    }); 
                }
                
            })                
    });
}

function notifyContentScriptsOfThisLocalStorageChange(setting){
    var nameOfUpdatedSetting = Object.keys(setting);
//     console.log(nameOfUpdatedSetting);
/*     console.log(nameOfUpdatedSetting[0]); */

    $(nameOfUpdatedSetting).each(function(){
        var thisSettingName = this;
        var valueOfUpdatedSetting = setting[thisSettingName]["newValue"];
        
        if((thisSettingName == "displayMTLinks_texts") || (thisSettingName == "displayMTLinks_media")){
            
            var enabled
            
            if(valueOfUpdatedSetting == "1"){
                enabled = true;
            } else if (valueOfUpdatedSetting == "0"){
                enabled = false;
            }
            
            if(tabsRunningContentScriptByID.length > 0){
                
                var localStorageSettingChangeMsgObj = {
                    leftNavLinkSettingChanged :  true,
                    leftNavLinkSetting : nameOfUpdatedSetting[0],
                    displayThisLink : enabled
                }
                
                sendThisMessageToAllContentScripts(localStorageSettingChangeMsgObj);
            }
    
        } else if(thisSettingName == "multiple_accounts"){
        
            if(tabsRunningContentScriptByID.length > 0){
                if(valueOfUpdatedSetting == "1"){
                    startContentScript();
                    
                    var enableNonMTTabsMsgObj = {
                        enabledThisNonMTAccountTab : true
                    }
                    
                    sendThisMessageToAllContentScripts(enableNonMTTabsMsgObj);
                }
            }
            
        } else {
            console.log("A setting was changed, but we don't need to notify the content scripts of it.");
        }

    });
    
    
}

function sendThisMessageToAllContentScripts(messageObj, optionalMsgBatchSendCompletionCallback){
    //!send this to all content scripts
    console.log("About to send this message to all tabs running GText");
    console.log(messageObj);
    
    if((messageObj.hasOwnProperty("stale_notif_flag")) && (messageObj.stale_notif_flag != 0)){//check if this is a stale CAPI.
        
        return false;        
            
    }

	var numTabMsgsCompleted = 0;//important, this is just an ack that the message attempt was made, and an outcome was reached.  It does not gaurantee that a response was received by the tab's we're sending a msg to.  KL implemented it this way 1.24.18 because we wanted to leverage this function to alert content scripts of the BG page reloading, because of a change in the push provider (controlled by our own remote API).  There should NEVER be a case where we don't reload the background page, but we want to give each message to tabs the best shot of being completed so we are going to reload AFTER we get a callback for each msg attempt
	//The chrome documentation claims that this callback should always be triggered, even if there is an error

    $(tabsRunningContentScriptByID).each(function(index, item){
	    
        console.log("sending a message to tab id: " + item);
        chrome.tabs.sendMessage(item, messageObj, function(response) {
            console.log("confirmation of message sent to tab id: " + item + " Response details from content script below: ");
            console.log({
                tab_id: item,
                resp:response
            });
            
            try{
	            numTabMsgsCompleted++;
	            
	            if(numTabMsgsCompleted === tabsRunningContentScriptByID.length){//the last 
		            console.info("Final tab msg sent!");
		            if(typeof optionalMsgBatchSendCompletionCallback == "function"){
						console.info("BG => CS Tab complete callback passed. Executing now");
			            optionalMsgBatchSendCompletionCallback();
		            }
	            }
	            
            } catch(err){
	            console.error("Error occurred when attempting to increment tab message counter", err);
            }
            
        }); 
    });

}

function shortenContextURLThenBuildIframeURL(contextInfo, tabID){

    var encodedURL = encodeURIComponent(contextInfo["info"]["pageUrl"]);

    var bodyContent = $.ajax({
        type: "GET",
//there should be a url here to mt.net for our link shortening API. (not using bitly anymore)
        dataType:"text",
        success: function(reply_server, textStatus, jqXHR) {
            console.log(reply_server);
//            contextInfo["info"]["shortUrl"] = reply_server["id"];
            //console.log(contextInfo);
//            sendClickInfoToContentScript(contextInfo, tabID);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error in C2DM: ' + errorThrown);
            console.error('Error details: ' + errorThrown.error);
        }
    });
}

function addContextMenusAndPageAction(){

    chrome.pageAction.onClicked.addListener(
        function(tab){
            console.log(tab);
            tellCSToOpenWidget(tab);
        }
    )
    
    chrome.tabs.query({
        currentWindow: true
    }, function(tabs) {
    /*     console.log(tabs);  */
        $(tabs).each(function(){
    /*         console.log(this); */
            chrome.pageAction.show(this["id"]);
        });       
    });           
    
    chrome.contextMenus.create({
        "id":"context-menu-handle-image",
        "title": "MightyText this image",
        "type": "normal",
        "contexts": ["image"],
        "onclick": function(info, tab){
            handleClick(info, tab, "image");
        }
    });
    
    chrome.contextMenus.create({
        "id":"context-menu-handle-page",
        "title": "MightyText this page",
        "type": "normal",
        "onclick": function(info, tab){
            handleClick(info, tab, "page");
        }
    });
    
    chrome.contextMenus.create({
        "id":"context-menu-handle-selection",
        "title": "Send '%s' via text message",
        "type": "normal",
        "contexts": ["selection"],
        "onclick": function(info, tab){
            handleClick(info, tab, "selection");
        }
    });
    /*
    
    chrome.contextMenus.create({
        "title": "MightyText this page",
        "type": "normal",
        "contexts": ["link"],
        "onclick": function(info, tab){
    //        handleClick(info, tab, "page");
            console.log({
                "info":info,
                "tab":tab
            });
        }
    });
    
    */
        
}

function checkForPermission(permission){

    chrome.permissions.contains(permission, function(result) {
        if (result) {
            console.log(result);
        // The extension has the permissions.
        } else {
//            alert("woo");
            requestThisPermission(permission);
        // The extension doesn't have the permissions.
        }
    });

}

function requestThisPermission(permissionToReq){
    var permissionToReq = {
        origins: ["*://mightytext.net/*"]
    };
    chrome.permissions.request(permissionToReq, function(granted) {
    // The callback argument will be true if the user granted the permissions.
        console.log(granted);
        if (granted) {
            alert("success");
        } else {
            alert("denied");
        }
    });
}
//START CODE TO INSERT MT IN FB WITHOUT MATCHING IN CONTENT SCRIPT
/*
    chrome.tabs.onCreated.addListener(function(tabs){        
//        console.log(tabs); 
        $(tabs).each(function(){
            console.log({
                created:true,
                tabs:tabs
            });
        });       
    });
*/
/*
    chrome.tabs.onUpdated.addListener(function(tabID, info, state){        
//        console.log(tabs); 
        if(info["status"] == "complete"){
            $(tabID).each(function(){
                console.log({
                    updated: true,
                    tabs: tabID,
                    updateInfo: info,
                    status: state
                });
                
                chrome.tabs.get(tabID, function(tab){
                    console.log(tab);
                    if(tab["url"].indexOf("facebook.com") > -1){
                        
                        //alert("you're in facebook!");
                        insertMightyTextIntoThisTab(tabID);
    
                    }
                })
                
            });         
        }
    });
*/
//END CODE TO INSERT MT IN FB WITHOUT MATCHING IN CONTENT SCRIPT

function insertMightyTextIntoThisTab(id){
    
    console.log(manifest["content_scripts"]);
    console.log(manifest.version);

    var contentScriptJSFiles = manifest["content_scripts"][0]["js"];
    var contentScriptCSSFiles = manifest["content_scripts"][0]["css"];
    
    $(contentScriptJSFiles).each(function(){
        var filePathStr = String(this);
        
        chrome.tabs.executeScript(id, {
            file: filePathStr,
            runAt: "document_start"
        });
    });
    
    $(contentScriptCSSFiles).each(function(){

        var filePathStr = String(this);

        chrome.tabs.insertCSS(id, {
            file: filePathStr
        }, function (){
            console.log("inserted web_to_phone.css");
        });

    });

};

function notifyUserOfMightyTextInFacebook(){
    var facebookNotificationOptions = {
        type: "basic",
        title: "MightyText now in Facebook",
        message: "Send & receive SMS text messages directly from Facebook!",
        iconUrl: "../img/fb_logo.png",
        priority: 2,
        buttons:[{
            title:"Try it now in Facebook"
/*             iconUrl: "../img/pop_out.png" */
        },{
            title:"No thanks"
/*             iconUrl: "../img/" */
        }]
    }
    
    chrome.notifications.create("first_load_facebook_not_enabled", facebookNotificationOptions, function(){ 
        console.log("setting initialFlag setting");

    });
            
}

/* END CODE FOR SAVING ANY PHOTO ON INTERNET TO YOUR PHONE */

/* Including Signature Capability */

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendContentScriptProStatusInfo(tabID){
	chrome.tabs.sendMessage(tabID, {
        userIsPro: true
    }, function(response) {
        console.log(response.confirmation);
    });               
}

/* Adding contact photos to this CRX 8/25/14 KL */
function CRX_genericGetThumbnailFromCaches(phone_num_clean,full_phone_num){
    
	if(isThisConversationAGroupMessage(full_phone_num)){
    	var groupContactPhoto = chrome.extension.getURL('img/fb-gray_group.png');
		return(groupContactPhoto);
	}
			
    var bestContactThumbnail=chrome.extension.getURL('img/silhouette.jpeg');	//set it to default, and override if we have a good thumbnail image
			
	photoThumbnailObj = $.jStorage.get(username_prefix_jstrg_purpose + '|PH_PIC_'+ phone_num_clean ,"no-jstorage-val-found-PHOTO");
		
//	console.error(photoThumbnailObj);
	
	if (photoThumbnailObj == "no-jstorage-val-found-PHOTO"){
	 		 	
	 	console.log("NO PHOTO LOCAL JSTORAGE MATCH FOR PHONE_NUM_CLEAN: " + phone_num_clean);	
 		//bestContactThumbnail ='../img/silhouette.jpg';
 	
 	} else {	
 	    
    	if ((photoThumbnailObj.contactThumbnailBinary!='NO_PHOTO') && (photoThumbnailObj.contactThumbnailBinary.length > 2)){ 
    	//got photo match - if it's "NO_PHOTO", then it means that at some point in the past, this phone_num's image was
    	// attempted to be fetched from phone, but there was no photo on the phone at that time
    	
    		bestContactThumbnail= "data:image/jpeg;base64," + photoThumbnailObj.contactThumbnailBinary;
		
		}

	}
	
	return bestContactThumbnail;	
	    
};

function getContactImageFromCloudAndSetJStorage(phoneNumFull,phoneNumClean, optionalSecsSinceLastC2DMImageRequest){

    var postVarBuilder = 'function=getPhoneContactPhotos&phone_num_clean=' + phoneNumClean + '&phone_num_full=' + encodeURIComponent(phoneNumFull);
    
    var bodyContent = $.ajax({
        url: baseUrl + "/phonecontact",
        global: false,
        type: "POST",
        data: postVarBuilder,
        dataType: "json",
        success: function(reply_server, textStatus, jqXHR){             
	     
            //console.info(reply_server);
            if (reply_server.phone_contact_photo_status.length > 0){

                var contactPhotoThumbnail = reply_server.phone_contact_photo_status;
                var numDays = 30;//default value
                
                if(reply_server.phone_contact_photo_status == "0"){
                    //Server has no record of a contact photo for this number. It will try to fetch it from phone.  We only set the TTL for 2 days.
                    
                    numDays = 2;
                    
                } else if(contactPhotoThumbnail == "NO_PHOTO"){
                    
                //image was requested from phone, but there was no image on phone at that time...
                // (our server stores this as "NO_PHOTO" in the phoneContactPhotos table)
                // do *not* request pic from phone again, but only keep local browser cache for 7 days. 

                    numDays = 7;
                    
                } else {
                    
                    numDays = 30;//This means that there is a contact photo for this contact, and because we don't think they are changed very often, set a higher TTL. 
                
                }

                console.log("Thumbnail returned for: "+ phoneNumClean + ", at "+ new Date() + "storing it for: " + numDays + " days. ");

                var ttlForContactPhoto = numDays * 24 * 60 * 60 * 1000;
            
    	 		$.jStorage.set(username_prefix_jstrg_purpose + '|PH_PIC_' + phoneNumClean, {'contactThumbnailBinary':contactPhotoThumbnail}, {TTL: ttlForContactPhoto});

            } 
             	
        }
	});
	
};

function getThreads(oauth_contacts_token, is_reload, retry_count){
    //chained off of a getuserinfofull call that returned the user is logged in

    if (typeof retry_count === 'undefined'){
        // if this is undefined, then it's the first retry count, so set it to 0
        retry_count=0;
    }

    console.log("inside of getThreads");
//     console.log("params: " + oauth_contacts_token + " ---- " + is_reload + " --- " + retry_count);

	var try_contacts_match = false;	
    var urlMighty = baseUrl + '/api?function=GetDistinctMessageHeaders&CLIENT=CRX'; //MA IE temp override
    var bodyContent = $.ajax({
        url: urlMighty,
        global: false,
        type: "GET",
        timeout: 9000,
        dataType: "json",
        xhrFields: { withCredentials: true},    //v important!
        error:function(jqXHR, textStatus, errorThrown) {   
        
            if (retry_count < 1){
                getThreads(oauth_contacts_token, is_reload, retry_count+1);                
            } else {
                checkInternetConnectionOutbound(errorGetDistinctHeaders); // enough tries...now check internet, and send desktop notif.
            }
        },
        success: function(json_data,textStatus,jqXHR){

        	var total_num_threads=0;
        	var total_messages_across_all_threads=0;
        	var have_picture_thumbnail_count=0;
	 
            $.each(json_data["messages"],function(index, thismessage){  //loop through HEADER threads 

                if(thismessage.phone_num_clean==0){
                    thismessage.phone_num='Unknown / Misc';                    
                }
                //happens if message is from an email address (carrier email) -- phone_num gets set to 'xyz@gmail.com' but phone_num_clean gets set to 0
                // in this case we also make sure to not get a Contact from getSingleNumberContactsFeed (we check for 0 at the top of that function)
           		                
                var photoThumbnailObj;
               
//END code to check if any contacts returned by getDistinctMessageHeaders are not already cached.  If they are not cached, try referencing a global array we built when we fetched the latest contacts from the phone when we called getPhoneContactsFromServer()

                var contactObj;
               //First, check local storage for this phone number   
               
               //    
                contactObj=$.jStorage.get(username_prefix_jstrg_purpose + '|PC_'+ thismessage.phone_num_clean ,"no-jstorage-val-found"); //2nd param is the default value if the key is not found in jStorage
                
               //if not matched in local storage, check the JS array that has the current list of phone contacts from cloud
                if (contactObj == "no-jstorage-val-found"){
                                        
                	contactObj = getSinglePhoneContactInfo(thismessage.phone_num_clean);//This function checks if the phonenumclean passed to it is stored in the local array we build with the user's phone contacts
                    console.log("NO LOCAL JSTORAGE CONTACT NAME MATCH FOR PHONE_NUM_CLEAN: " + thismessage.phone_num_clean + " ... now check array loaded from cloud");	
        	 	
                } else{
                
                    console.log("MATCHED! LOCAL JSTORAGE CONTACT NAME MATCH FOR PHONE_NUM_CLEAN: " + thismessage.phone_num_clean);	                        
                
                }
                
//END code to check if any contacts returned by getDistinctMessageHeaders are not already cached.  If they are not cached, try fetching them from the server
        	   	  	   
                if (contactObj == undefined){//If we get into the section of code below, these are users that we had not previously stored in jstorage

                     console.log("No contact info found.  No contact phone on phone w/ phone num clean: " + thismessage.phone_num_clean);                                                           

    			} else { 
    			//we have a contact name match (either from jstorage, or from cloud loaded JS array), so let's see if we have an image in jstorage
               		               
                    //First, check local storage for this phone number       
                    photoThumbnailObj=$.jStorage.get(username_prefix_jstrg_purpose + '|PH_PIC_'+ thismessage.phone_num_clean ,"no-jstorage-val-found");
           			           			
                    if (photoThumbnailObj=="no-jstorage-val-found"){//No contact thumbnail found in jstorage
                    
                        setTimeout(function(){
                            
                            getContactImageFromCloudAndSetJStorage(thismessage.phone_num,thismessage.phone_num_clean);
                        
                        }, index * 500)

     		       	 	console.log("NO CONTACT PHOTO LOCAL JSTORAGE MATCH FOR PHONE_NUM_CLEAN: " + thismessage.phone_num_clean);	

                    } else {

     		       	 	console.log("CONTACT PHOTO MATCH LOCAL JSTORAGE MATCH FOR PHONE_NUM_CLEAN: " + thismessage.phone_num_clean);	
                        
                    }
                    	
    			}		
    			         
            }); //end EACH THROUGH THREADS
		                 
        }
   });
};

function getSinglePhoneContactInfo(phoneNumClean){
//This function parses the global js array (contactsFromPhoneGlobal) we built in  processPhoneContacts. And sets this information in jStorage

	var contactObjToReturn;
		
	$.each(contactsFromPhoneGlobal, function(j,thiscontact){
    	    	
        if(phoneNumClean == thiscontact.phoneNumClean){

            contactObjToReturn=thiscontact;//if we got here, that means this was an entry that was pulled from server, but not in jstorage, so store it.
            
            var ttlForContactName = 60 * 24 * 60 * 60 * 1000;//sixty days in milliseconds
   			
            $.jStorage.set(username_prefix_jstrg_purpose + '|PC_'+ phoneNumClean, {'contactName':thiscontact.contactName, 'phoneNum':thiscontact.phoneNum, 'phoneNumType':thiscontact.phoneNumType}, {TTL: ttlForContactName});

            return;//this return breaks out of the callback of the each loop
			
		}

	});

	return(contactObjToReturn);
				
};

function currentTimeStampInSeconds(){
    var timeStampInSeconds = new Date().getTime() * 1000;
    
    return timeStampInSeconds;
};

function clearGlobalIntervals(){

    window.clearInterval(globalPhoneStatusInterval);
    globalPhoneStatusInterval = 0;
    //also want to close CAPI Health Check
    window.clearInterval(globalCAPIHealthCheckInterval);
    globalCAPIHealthCheckInterval = 0;
    globalCAPIHealthCheckIntervalStatus = false;
            
    console.log("Phone Status Request and CAPI Health Check Interval Cleared.");

};

function getRefreshedContactPhotoAndSaveToJStorage(phoneNumClean, phoneNum){

	var postVarBuilder = 'phone_num_clean=' + phoneNumClean + '&phone_num_full=' + encodeURIComponent(phoneNum);
    var bodyContent = $.ajax({
        url: baseUrl + "/phonecontact?function=getPhoneContactPhotos",
        data: postVarBuilder,
        global: false,
        type: "POST",
        dataType: "json",
        xhrFields: { withCredentials: true},
        success: function(reply_server){
            
            var binaryImageContactPhoto = reply_server['phone_contact_photo_status'];            
            var ttl_for_valid_contact_image = 14 * 24 * 60 * 60 * 1000; //keep local cache of valid image for 14 days
            
            console.log(reply_server);
            
            console.log(username_prefix_jstrg_purpose + '|PH_PIC_' + phoneNumClean);
            
            //store Contact Photo in jStorage for 14 days
            $.jStorage.set(username_prefix_jstrg_purpose + '|PH_PIC_' + phoneNumClean, {'contactThumbnailBinary':binaryImageContactPhoto}, {TTL: ttl_for_valid_contact_image});
            
        },
        error: function(reply_server){
        //console.error('error in getRefreshedContactPhotoAndSaveToJStorage');
        //console.error(reply_server);
        }    
    });
    
		
};

function createChromeNotif(options){

    var arrayOfAcceptedOverrides = ["type", "title", "message", "iconUrl", "priority"];
    var chromeNotifOptions = {
        type: "basic",
        title: "MightyText in Gmail",
        message: "To start texting from Gmail, please reload Gmail or launch a new Gmail tab",
        iconUrl: "../img/gtext-48x48_white_bg.png",
        priority: 2
    };
    
    jQuery.each(options, function(key, value){
        if(arrayOfAcceptedOverrides.indexOf(key) > -1){//only override if it's one of the accepted methods
            chromeNotifOptions[key] = value;
        }
    });

    chrome.notifications.create(options.id , chromeNotifOptions, function(notifCreatedID){ 
        console.log("notif created w/ id: " + notifCreatedID);
    });
    
}

function fetchMessageDetails(options){

	var getDataFromServer = $.ajax({
		type: "GET",
		url: baseUrl + '/content?function=getMessageDetail&id=' + options.id,
		dataType: "json",
		timeout: 10000,
		success: function(response){
			if(response.message){
                response.message.inbox_outbox = 60;//override the value of inbox_outbox to display a notif
                checkIfUserIsActiveInGtextTab({origin:"messageSendFailure", message_details: response.message})

            } else {
                console.error("error fetching message details");
                console.error(response);
            }
        },
        error: function(){
            console.error("error fetching message details")
        }
    });
    
}

function reloadThisTab(tabID){
    chrome.tabs.reload(tabID, function(){
        console.log("tab ID: " + tabID + " reloaded");
    });
}

chrome.notifications.onClicked.addListener(function(clickedNotifID){
    
    if(clickedNotifID.indexOf("message-send-failure") > -1){//user clicked a message send failure notif
        //we should fetch the message details when the user clicks
        var messageID = clickedNotifID.replace("message-send-failure-", "");
        fetchMessageDetails({id: messageID});        
    }
    
})

function setAutoRemoveTimeOutForThisNotif(id, removeDelay){
    
    setTimeout(function(){

        chrome.notifications.clear(id, function(cleared){
            console.log({
                "id_of_notif_cleared": id,
                "chrome_notif_cleared":cleared
            });
        });
        
        console.log("notif clear after: " + removeDelay + " milliseconds at: "+ new Date());
        
    }, removeDelay);
    
};

//network connection listeners

window.addEventListener('online',  function(){
	
    console.log("User has gained network connection at: " + new Date());
	
});
window.addEventListener('offline', function(){

    console.log("User lost network connection at: " + new Date());

});

function checkUserLoginStatusAfterCAPINotifyLogout(userSignedInFromWebapp){//we'll call this if we get a CAPI that some client has logged out.  We'll check if this client is logged out 8/5/14 KL

    var requestURL = baseUrl + '/api?function=getUserInfoFull&CLIENT=GText';
    
    var userinforesponse = $.ajax({
        url:requestURL,	
        type: "GET",
        timeout: 10000,
        dataType: "json",
        error:function(jqXHR, textStatus, errorThrown) {   
        	
        	console.log("ERROR in AJAX in getUserInfoFull: " + errorThrown);
        		
    	},
        success: function(response, textStatus, jqXHR){		
            
            if((response["user_info_full"]) && (response["user_info_full"]["email"]["length"] > 0)){//user is still signed in on this browser
                console.log("Confirmed that the user still has a MT cookie on this browser at: " + new Date());
                //not sure we should do anything here
            
            } else if(response["user"] == "user not logged in"){
                    //user does not have their MT cookie anymore
                //send a message to all content scripts that the user is logged out from MT in this browser
                console.log("Confirmed that the user has signed out of MT at: " + new Date());
                alertAllContentScriptsOfUserSignedOutThenReload({trigger: "user-signed-out-status-sync"});

            }     
        }        
    });
};

function alertAllContentScriptsOfUserSignedOutThenReload(options){
    console.log("Sending message to all tabs running a content script, that bg.js knows that the user has been signed out of MT in this browser at: " + new Date());
    sendThisMessageToAllContentScripts({
        user_signed_out_from_mt: true
    });
    //passing along the options so that the function to reload can handle whether or not a reason or "trigger" was given for this reload.
    forceReloadBackground(options);
};

function forceReloadBackground(options){

    var reasonForReload;
    
    if(options.hasOwnProperty("trigger")){
        reasonForReload = options.trigger;
    } else {
        reasonForReload = "unknown-reason-for-reload";
    }
    
    console.log("About to reload the bg page because: " + options.trigger + " at: " + new Date());
    
    _gaq.push(["_trackEvent","CRX-Gmail", "Force-Reload-GText-BG", reasonForReload]);

    //give 1 second buffer so GA call can be made.
    setTimeout(function(){
        window.location.reload();                    
    }, 1000);
    
}

function getContactInfo(typeAheadValSelectedInContentScript, requestResponseFunction){

    var contactDetailsFromTypeAheadEntry = contactsArrayToMatchTypeAheadTo[typeAheadValSelectedInContentScript];
	
    if(contactDetailsFromTypeAheadEntry.contactType == "group"){
        getSingleContactGroupInfo({id:contactDetailsFromTypeAheadEntry.id, response_function:requestResponseFunction, attempt:0});
    } else {//individual contact info
        requestResponseFunction({
            confirmation: "responding with matching contact info.",
            contactInfo: contactDetailsFromTypeAheadEntry
        });
    }
    
}

// Contact List Code
function updateGroupEntryInTypeahead(oldName, optionalNewName, optionalGroupId)
	{
		//First, we must remove the old group from the global typahead array and the global contact object 
		var oldGroupIndex = createHTMLEquivalentOfMessageBody(oldName, 'YES') + ' - Contact List';
		
		// Find and remove item from an array
		var i = contactsNameArrayForTypeAhead.indexOf(oldGroupIndex); //CRV only remove if the index exists
		if(i != -1) {
			contactsNameArrayForTypeAhead.splice(i, 1);
		}
		
		
		if(contactInfoArrayForTypeAheadMatching[oldGroupIndex])   //CRV only remove if the obect exists
			{
				delete contactInfoArrayForTypeAheadMatching[oldGroupIndex];
			}
			
		
		//CRV if the user has also specified a new name (i.e. the group was edited, NOT deleted) then let's update the two global variable so that the new name will be serachable in the typeahead	
		if(optionalNewName){
			var newGroupIndex = createHTMLEquivalentOfMessageBody(optionalNewName, 'YES') + ' - Contact List';	
			
			contactsNameArrayForTypeAhead.push(newGroupIndex);
			
			contactInfoArrayForTypeAheadMatching[newGroupIndex] = {
				contactType: "group", 
				id: optionalGroupId, 
				name: createHTMLEquivalentOfMessageBody(optionalNewName, 'YES')
			};
		}
		
		
		
	}

function addContactGroupsToTypeahead()
	{
		var getDataFromServer = $.ajax({
		type: "GET",
		url: baseUrl + '/contactgroup?function=getContactGroups&start_range=0&num=100',
		dataType: "json",
		xhrFields: { withCredentials: true},
		success: function(json_data,textStatus,jqXHR){
			//console.log('success in addContactGroupsToTypeahead:');
			//console.log(json_data);	
			
			if(json_data.hasOwnProperty('contact_groups')){

                $(json_data.contact_groups).each(function(index, group){
					var typeaheadEntry = createHTMLEquivalentOfMessageBody(group.name, 'YES') + ' - Contact List';
					
					if(!contactsArrayToMatchTypeAheadTo.hasOwnProperty(typeaheadEntry)){//only want to add this entry to the typeahead array if it does not already exist.
    				
    						
						autoContacts.push(typeaheadEntry);
    					
					}

					contactsArrayToMatchTypeAheadTo[typeaheadEntry] = {//it's ok to always set this because it will overwrite the old value because it's an object.  The value of this KEY in the OBJECT will be overwritten
						contactType: "group", 
						id: group.id, 
						name: createHTMLEquivalentOfMessageBody(group.name, 'YES')
					};
					
                });

			} else {
    			console.error(new Date() + " No contact lists returned by server");
			}
			
			
		},
		error: function(json_data,textStatus,jqXHR){
			console.log('error in addContactGroupsToTypeahead:');
			console.log(json_data);
			console.log(textStatus);
			console.log(jqXHR);
		}
		});

	}	

function getSingleContactGroupInfo(options){
    var contactGroupID = options.id, 
        contentScriptResponse = options.response_function,
        numAttempt = options.attempt;
	var postVarBuilder = 'id=' + contactGroupID;
	
    $.ajax({
		type: "POST",
		url: baseUrl + '/contactgroup?function=getContactGroupbyId',
		data: postVarBuilder,
		dataType: "json",
		timeout: 2000,
		success: function(json_data,textStatus,jqXHR){
			//console.log('success in getSingleContactGroupInfo:');
			//console.log(json_data);
			
			if(json_data.hasOwnProperty('contact_group')){ //CRV a contact group was successfully returned

				var numbers = json_data['contact_group']['numbers'];
				if(numbers){
						//console.log(numbers['value']);
					var contacts = jQuery.parseJSON(numbers.value),
    					contactGroupInfoArray = new Array();
						//console.log(contacts);
					$.each(contacts, function(index, value){
						var contactFullNum = value.number;
						var contactPhoneNumClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(contactFullNum, 'do_not_zeropad');

						var contactGroupMemberInfo = searchForCleanPhoneNumContact(contactPhoneNumClean, contactFullNum);
						contactGroupInfoArray.push(contactGroupMemberInfo);
					});

			        contentScriptResponse({
                        confirmation: "responding with matching contact info.",
                        contactInfo: contactGroupInfoArray
                    });

				} else {
    				
			        contentScriptResponse({
                        confirmation: "responding with matching contact info.",
                        error: "no_contacts_in_list",
                        list_name: json_data.contact_group.name
                    });
    				
				}					

			} else {
				//no contact group was returned;
		        contentScriptResponse({
                    confirmation: "responding with matching contact info.",
                    error: "no_contact_info_found"
                });
			}
						
		},
		error: function(json_data,textStatus,jqXHR){
            if(numAttempt < 3){
                options.attempt = numAttempt++;
                getSingleContactGroupInfo(options);
            } else {
		        contentScriptResponse({
                    confirmation: "responding with matching contact info.",
                    error: "unable_to_retrieve_contact_list_details"
                });                
            }            
		}
	});
	
}

function buildTypeAheadContactArray(sendResponse){
    if(!isAProUser){
        //if a user is NOT pro, make sure that we remove any contact lists in the auto contacts array before we respond to the content script
        $(autoContacts).each(function(index, item){
            if(item.indexOf("Contact List") > -1){
                console.log(item);
                autoContacts.splice(index, 1);
            }
        });
    } else {
        
    }
                
    sendResponse({//sending an async response to the original sender of the message
        confirmation: "autoContacts Array served",
        typeAheadSource: autoContacts
    });
}

function recordIncomingMessageKMEvent(data){
	
	var kmProperties = data.properties;

    if(getRandomInt(0, 4) === 2){	
		_kmq.push(['record', 'Incoming-Message-25pct', kmProperties]);	
	}
	
}