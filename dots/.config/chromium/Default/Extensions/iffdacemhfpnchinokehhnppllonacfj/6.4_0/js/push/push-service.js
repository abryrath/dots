var pushProvider = "pusher",//default push provider is still FRD as of 11.29.17 KL
	pushSocketOpened = false;
	
var pushPayloadBabysitterArray = new Array,
	userIsDefaultPushServiceCapable = false,
	timeBeforeCheckForPushServiceEnabled = 18000,//18 seconds
	PushServiceBabysitterIntervalDetails = {//setting as a property of the window obj is the same as setting a global
		id: "",
		interval: generateBabysitterIntervalInMS(),//10 mins in ms.  updated 10.27.17 KL
		body: generateBabySitterBody()
	},
	PUSHHealthCheckInterval = {//definition of details for legacy push health check interval.  this interval checks the last time that we received a PUSH, not the babysitter
		id: "",
		interval: 10000,//10 seconds in ms
		body: "CAPI_HEALTH_CHECK_GTEXT_JAN_2018"
	},
	globalTsLastPushRcvd = new Date() - 60000;// KL updated the var to be 1 mins ago instead of 10 mins ago on 11.27.17 to prevent the retry logic being triggered every 30 seconds for users in the wild who are incompatible w/ our push provider (currently FRD).  

function setupPushSocket(data = {}){//the main app code (mighty.js) should reference this function.  Then each service-specific (FRD vs. Pusher) should reference it's open setup function (example: getFRDToken for FRD) 11.29.17 KL
	if(pushProvider == "pusher"){
		retrievePusherSetupInfo(data);	
	} else {
		getFRDToken(data);//as of 11.29.17 Firebase Realtime Database is still the default push provider.  But we are going to begin testing Pusher to see if it's a viable solution KL	
	}
	
}

function reestablishPushSocket(){

	pushSocketOpened = false;//this boolean will be reset to "true" when the socket is reopened 1.22.18 KL
	
	if(pushProvider == "pusher"){
		closeAndOpenNewPusherSocket();
	} else {
		closeAndReAttemptOpenFRDSocket();//frd specific
	}

}

function checkIfUserIsCompatibleWithOurDefaultPushProvider(){

	var compatibilityStr = "push-service-not-compatible",
		compatibilityInt = 0;
	if(userIsDefaultPushServiceCapable){
		compatibilityStr = "push-service-compatible";
		compatibilityInt = 1;
	} else {
		pushServiceLogger("Oh no! User is not compatible w/ our current push provider.", "error");
	}
	
	recordPUSHHealthCheckEvent({
		push_type: "push-service-compatibility", 
		sub_type: pushProvider, //added push provider (frd or pusher) 11.29.17 KL
		attempt:1, 
		success: compatibilityInt
	});
	
	pushServiceLogger('[PUSH SERVICE CAPABILITY CHECK] User is ' + compatibilityStr);	

}

function pushServiceLogger(msg, optionalType, optionalAdditLogArgument){
	
	var logLine = "[PUSH][" + pushProvider.toUpperCase() + "] " +msg;
	
	if(typeof clientRunningScript != "undefined" && clientRunningScript == "native-app"){
		writeToDesktopLog(logLine);
	} else {
		if(
			(typeof optionalType != "undefined")&&
			(optionalType == "error")
		){
			if(typeof optionalAdditLogArgument != "undefined"){
				console.error(logLine, optionalAdditLogArgument);
			} else {
				console.error(logLine);
			}
		} else {
			if(typeof optionalAdditLogArgument != "undefined"){
				console.info(logLine, optionalAdditLogArgument);
			} else {
				console.info(logLine);
			}

		}
	}
}

function babysitThisPushHealthCheck(data){
	//checking that the pushPayloadBabysitterArray array exists before invoking this function
    if(pushPayloadBabysitterArray.indexOf(data.id) > -1){//this is in the global placeholder array
		pushServiceLogger('PUSH Health Check ID: ' + data.id+ ' did not come back in 5 seconds. Removing ID from babysitter array whose current length is ' + pushPayloadBabysitterArray.length);
		pushPayloadBabysitterArray.splice(pushPayloadBabysitterArray.indexOf(data.id), 1);//remove the unique ID from the in-memory push payload babysitter array
		
		var eventData = {
			attempt: 1,
			success: 0
		};
		
		if("type" in data){
			eventData.push_type = data.type;
		}

		if("sub_type" in data){
			eventData.sub_type = data.sub_type;
		}
		
		recordPUSHHealthCheckEvent(eventData);
		pushServiceLogger('PUSH Health Check ID: ' + data.id + ' did not come back in 5 seconds. Removed ID from babysitter array whose NEW length is ' + pushPayloadBabysitterArray.length);
    }

}

function handlePushSocketOnMessageForBabySitter(message, optionalPushTypeOverride){

	if(
		("data" in message)&&
		(typeof PushServiceBabysitterIntervalDetails != "undefined")&&//this global hasn't been defined yet
		(message.data.search(PushServiceBabysitterIntervalDetails.body) > -1)//checking if this is a pending Babysitter Push Payload
	){
		var pushPayload = new Object;
		pushServiceLogger("Received valid Babysitter payload JSON " + message.data);
		try{
			pushPayload = JSON.parse(message.data);
		} catch(error){
			pushServiceLogger("!!! and error occurred while trying to parse the incoming Babysitter json string: " + JSON.stringify(err), "error");
		}
		
		if("new_content" in pushPayload){
			var payloadObj = pushPayload.new_content,
				tsNow = new Date().getTime();
				
			tsSend = payloadObj.body.split(" ");//spliting the body payload into an array
			//parsing out the JSON from the array created above
			var bodyJSON = tsSend[0];
			pushServiceLogger('Body JSON w/o timestamp: ' + bodyJSON);
			var bodyObj = new Object;
			try{
				bodyObj = JSON.parse(bodyJSON);
			} catch(err){
				pushServiceLogger('An error occurred while trying to parse the BODY of an incoming Electron CAPI Health Check', 'error');
			}
			if(
				("id" in bodyObj)&&//found an ID in the bodyObj
				(typeof pushPayloadBabysitterArray != "undefined")&&
				(pushPayloadBabysitterArray.indexOf(bodyObj.id) > -1)
			){
			    pushServiceLogger('Babysitter ID: ' + bodyObj.id + ' found in PUSH Babysitter Array (current length: ' + pushPayloadBabysitterArray.length + ")");
				pushPayloadBabysitterArray.splice(pushPayloadBabysitterArray.indexOf(bodyObj.id), 1);				    
			    pushServiceLogger('Babysitter ID: ' + bodyObj.id + ' removed from PUSH Babysitter Array (new length: ' + pushPayloadBabysitterArray.length + ")");	

				tsSend = parseInt(tsSend[tsSend.length - 1]);
														
				pushServiceLogger('Push Babysitter payload rcvd.  Time diff between send & receipt: ' + (tsNow - tsSend) + "ms");
				
				//pass the user's time to receive
				var timeDiffInSecs = (tsNow - tsSend)/1000;
				
				var eventOptions = {
					attempt: 1, 
					success: 1, 
					completion_time: timeDiffInSecs, 
					push_type: pushProvider
				};
				
				if("sub_type" in bodyObj){//if the sub_type is present in the body obj, then pass it along in the babysitter stats event 11.17.17 KL
					eventOptions.sub_type = bodyObj.sub_type;
				}
				
				recordPUSHHealthCheckEvent(eventOptions);

			}
					
		}
	}
}

function pushSocketOpenedActions(data = {}){

	pushSocketOpened = true;
	
	recordPUSHHealthCheckEvent({push_type:"push-socket-open", sub_type:pushProvider, attempt: 1, success: 1, completion_time: 0});
	
	pushServiceLogger('Sending inital push babysitter because we just established a socket for: ' + pushProvider);
	
	startPushBabysitterInterval();
	
	setTimeout(function(){
		pushServiceLogger('Sending inital push babysitter because we just established a socket for: ' + pushProvider);
		sendCustomTestPushForBabySitterPurposes({type: pushProvider, sub_type: "triggered-by-socket-open"});
	}, 3000);//adding a 3 second delay to allow the push socket to be established before sending the babysitter, to make sure that the push isn't established before the push comes in
	
	if("tab_id" in data && typeof data.tab_id != "undefined"){
	    chrome.tabs.sendMessage(data.tab_id, {
	        CAPIOpened: true
	    }, function(response) {
	        
	        if((typeof response != "undefined") && (response.hasOwnProperty("confirmation"))){
		        //tabs able to receive PUSH
	            pushEnabledTabs.push(data.tab_id);
	        }
	
	    });		
	}

}

function pushSocketClosedActions(){

	recordPUSHHealthCheckEvent({
		push_type:"push-socket-close", 
		sub_type: pushProvider, 
		attempt: 0, 
		success: 0, 
		completion_time: 0
	});

}

function startPushHealthCheckInterval(){

	clearPushHealthCheckInterval();

	//CRV changed the ms value of this interval to be a global variable so that it can be changed in the obfuscated version of the code
	setTimeout(function(){
		PUSHHealthCheckInterval.id = setInterval(dispatchTestPushOnlyIfNeeded, PUSHHealthCheckInterval.interval);		
		
	    globalCAPIHealthCheckIntervalStatus = true;//we are storing a global var so that we know each time the interval is set and cleared.  So that, if the user opens a new tab when there is already a capi open.. then we can start an interval again. KL 9/29/14
	    //GText specific !!! 1.18.18 KL

	}, 20000);//adding a delay before setting push health check interval because we implemented our own startup push service compatibility checks 11.7.17 KL

}



function dispatchTestPushOnlyIfNeeded(){

	pushServiceLogger('In Body JSON w/o timestamp');
	var secondsSinceLastIncomingPush = getSecondsSinceLastPushRcvd();

	pushServiceLogger('Last PUSH inbound received ' + secondsSinceLastIncomingPush + ' seconds ago');

	if (secondsSinceLastIncomingPush > 200){//We've made 2 PUSH Health Check attempts since it's been > 3 minutes that we've last received a PUSH.  It's possible that the user's Push Socket has been busted for > 3 minutes now.  Checking the user's internet connection.  If connected, then we will close the current socket, and request a new token from GAE to open a new socket. 7-19-17 KL
		//previously the user would have gone 5 MINUTES with a busted PUSH socket, before we attempted to close and re-open the socket

		pushServiceLogger('It\'s been > 200 seconds since last PUSH! do one last health check attempt before opening a new Push socket...');
        sendTestPushMessage(PUSHHealthCheckInterval.body);
        
        setTimeout(function(){
	        finalPushSocketBrokenCheck(300)
        }, 5000);

	} else if (secondsSinceLastIncomingPush > 180){  //if it's been more than 3 minutes, then do a PUSH-only check (no battery status returned, no other PUSH returned)

		sendTestPushMessage(PUSHHealthCheckInterval.body);
		pushServiceLogger('It\'s been more than 180 seconds, so issue a Push Health Check');

	} else{

		pushServiceLogger('It\'s been less than 180 seconds, so no need to issue a new Push health check');

	}

}

function generateBabySitterBody(){
	return 'CAPI_HEALTH_CHECK_FOR_' + pushProvider.toUpperCase() + '_2017_FROM_GTEXT';
}

function sendCustomTestPushForBabySitterPurposes(data = {}){

    var uniqueID = buildRandAlphaNumStr(10);//generating unique ID, because the existing OBFUSC function adds the timestamp to the health check body
	var timeToWaitTilCAPICheckIn = 5000;//time before we determine the CAPI is a lost cause, it's not going to come in.										    
	var healthCheckBody = PushServiceBabysitterIntervalDetails.body;
	pushPayloadBabysitterArray.push(uniqueID);
	
	var bodyDetailsObj = {
		body: PushServiceBabysitterIntervalDetails.body, 
		id: uniqueID
	};
	
	if("sub_type" in data && data.sub_type == "triggered-by-socket-open"){
		bodyDetailsObj.sub_type = data.sub_type;//passing the sub_type AKA trigger in the CAPI health check payload ONLY for babysitters triggered on socket open because KL noticed that stats were skewed 11.17.17 and wanted to discount users who were in an every 10 second loop to open the push socket
	}
	
	var capiHealthJSON = JSON.stringify(bodyDetailsObj);	
	
	$.ajax({
		url: baseUrl + "/test?function=capi",
		data: {
			body: capiHealthJSON  + " ---- " + new Date().getTime(),
			phone_num: 555555555
		},
		global: false,
		type: "POST",
		dataType: "text",
		xhrFields: { withCredentials: true},
		success: function(reply_server){

			if (reply_server.search("CAPI test sent successfully") != -1){
			    setTimeout(function(){									    
				    
				    $.extend(data, {id: uniqueID, deadline: timeToWaitTilCAPICheckIn});
				    
				    babysitThisPushHealthCheck(data);
				    
			    }, timeToWaitTilCAPICheckIn);			    
			}
		}
	});

}

function startPushBabysitterInterval(){
		
    clearInterval(PushServiceBabysitterIntervalDetails.id);

	PushServiceBabysitterIntervalDetails.body = generateBabySitterBody();//updating the babysitter body again to ensure that we are looking for the correct body 12.4.17 KL

	pushServiceLogger('Setting Push Babysitter Interval for: ' + pushProvider);
	
    PushServiceBabysitterIntervalDetails.id = setInterval(function(){//waiting for the CAPI socket to open before we override the setInterval so that we don't get false positives.  Don't want to send CAPI's for this experiment if the user hasn't opened a SOCKET	    
	    
	    sendCustomTestPushForBabySitterPurposes({type: pushProvider});		
		
    }, PushServiceBabysitterIntervalDetails.interval);							
	    
}

function clearPushHealthCheckInterval(){
	try{
		clearInterval(PUSHHealthCheckInterval.id);
	} catch(err){
		console.error('An error occurred trying to close the legacy CAPI Health Check Interval: '+err);
		_kmq.push(['record', 'Clear-Legacy-CAPI-Health-Check-Interval-Error', {'legacy_capi_health_check_clearinterval_check_error': err}]);
	}
}

function fetchUserAppInfo(data = {}){

	var attemptCount = data.attempt,
		timeBetweenCheckIns = 30 * 60 * 1000;//30 mins as of 12.11.17 KL
// 		timeBetweenCheckIns = 5 * 1000;

	$.ajax({
		type: "GET",
		url: "https://content.mightytext.net/app-info/data.php",
		dataType: "json",
		timeout: 3000,
		success: function(response){
			try{//wrapping in a try/catch so that we never halt the JS and prevent a push socket from being established 12.11.17 KL
				console.info("Received a response from /app-info JSON", response);
				if(typeof response == "object" && "push_provider" in response){
					console.info("Found the push_provider field!", response.push_provider);
					var serverPushProvider = response.push_provider.value,
						updateType = response.push_provider.update_type;
					if(pushProvider != serverPushProvider){
						if(attemptCount == 0){//updating the global pushProvider var so that we know with provider to fetch the setup info for 12.11.17 KL

							pushProvider = serverPushProvider							

						} else {//warn user about required update, because this is intra-session 12.11.17 KL

							var alertType = response.push_provider.update_type;

							if(typeof alertType == "string" && alertType == "forced"){
								if(typeof clientRunningScript != "undefined"){

									if(clientRunningScript == "webapp"){//webapp specific behavior
										alert(getLanguageSpecificText("forced_app_update_available", globalDefaultLanguage));
										reloadAppForUpdate({
											current_version: pushProvider,//client push provider
											new_version: serverPushProvider,//value passed by server
											update_type: updateType
										});
										
									} else if (clientRunningScript == "CRX-NEW"){
										sendThisMessageToAllContentScripts({
											backgroundPageHasReloaded: true,
											trigger: "push-provider-change"
										}, function(){window.location.reload()});
									} else {
										//this is unaccounted for.  Should be the CRX/Desktop app
									}
									
								}
							}
							
						}

					}
				}				
			} catch(err){
				
			}
		},
		complete: function(jqXHR, textStatus){//executed AFTER sucess/error callbacks according to jquery documentation 12.11.17 KL
			console.info("Inside of complete callback for /app-info request", textStatus);
			if(attemptCount === 0){//only if this is the first attempt
				setupPushSocket(data);				
			}

		}
	});
	
	setTimeout(function(){
		fetchUserAppInfo({//incrementing the attempt count
			attempt: ++attemptCount
		});
	}, timeBetweenCheckIns);
	
}

function generateBabysitterIntervalInMS(){
	var interval = 600000;//default to 10 min, in case there is an issue generating the rand int

	try{
		interval = getRandomInt(480000, 720000);//randomly setting the interval between 8-12 mins 1.4.17 KL
	} catch(err){
		console.error("An error occurred while generating rand push babysitter interval", err);
	}
	
	pushServiceLogger("Setting Push Babysitter Interval to: " + interval);
	
	return interval;
}

function processPushPayload(data = {}){//added 102517 by KL for FRD integration 
	var message = data;
	
	userIsDefaultPushServiceCapable = true;//setting global to TRUE so that we can record that the user is push-service compatible
	
    globalTsLastPushRcvd = new Date(); //store the last time we got a successful CAPI
    
    if ((message.data.indexOf("CAPI_HEALTH") == -1) && (message.data.indexOf("USER_UPDATED_SETTINGS_IN_WEBAPP") == -1)) {
        var dataObject = jQuery.parseJSON(message.data);
        
        console.log("content of CAPI that just came in: " + new Date());
        console.log(dataObject);
        
        if(tabsRunningContentScriptByID.length > 0)//only want to process capi's if there is a tab running our content script
            processIncomingPush(dataObject);
    }
	
}

//GText-specific push service code 1.22.18 KL
function reattemptToSetupPushSocket(options){
 
    var tokenRequestAttemptCount = options.num_attempts,
        tabToAlertCAPISocketOpened = options.tab_id,
        maxRequestAttempts = 3;
    
	tokenRequestAttemptCount++;
    
    if(tokenRequestAttemptCount < maxRequestAttempts){
        pushServiceLogger("PUSH setup request failed at: " + new Date() + ".  About to request another token in 5 seconds.");
        setTimeout(function(){
	        var newSetupOptions = $.extend(options, {num_attempts: tokenRequestAttemptCount});
            setupPushSocket(newSetupOptions);
        }, 5000);
        
    } else {
        pushServiceLogger("Setup request failed 3 times. Showing notif to user telling them to reload at: " + new Date());
        //alert the user of the issue.
        //we should display a chrome notif
        var dateString = new Date().toString();
        var currentDateInMS = new Date().getTime();
        var notifID = "unable-to-retrieve-capi-token-3-times",
	        showCAPIErrorNotifFlagKey = pushProvider + '-token-request-error-notif-shown';//making this push provider specific 1.22.18 KL
                
        var checkIfUserHasSeenThisNotifRecently = $.jStorage.get(showCAPIErrorNotifFlagKey, false),
	        notifErrorCode = "CRX-PS89";
	        
        if(pushProvider == "frd"){
	        notifErrorCode = "CRX-FS90";
        }
        
        var notifOptions = {
            type: "basic",
            title: "MightyText In Gmail",
            iconUrl: "img/error_icon.png",
            message: "There was an error loading this session. Please reload your Gmail or Facebook window. If this continues, please inform our team.",
            contextMessage: "(Error Code: " + notifErrorCode + ")",
            priority: 2
        };
                
        if(!checkIfUserHasSeenThisNotifRecently){

	        pushServiceLogger("Notif created w/ id: " + notifID + " at: " + new Date());

	        chrome.notifications.create(notifID, notifOptions, function(notifCreatedID){
	            
	            var timeTilWeShowCapiTokenRequestNotifAgain = 12 * 60 * 60 * 1000;//12 hours in milliseconds
	            $.jStorage.set(showCAPIErrorNotifFlagKey, "notif-shown", {TTL: timeTilWeShowCapiTokenRequestNotifAgain});
	            
	            pushServiceLogger("Time of " + notifID + " notif on create at: " + new Date() + "in current date in millseconds: " + new Date().getTime());
	            
	        });
	        
        }        
        
        _kmq.push(['record', pushProvider + '-Token-Request-Final-Failed-Attempt', {'num-attempts': maxRequestAttempts, trigger: options.trigger}]);
            
    }
    
    var failedAttemptTrigger = options.trigger;
    
    if(failedAttemptTrigger == "ajax-error"){
        _gaq.push(["_trackEvent", pushProvider + "-Gmail", pushProvider + "-Token-Request-Failed-Attempt", failedAttemptTrigger]);
    } else if (failedAttemptTrigger == "server-responded-without-valid-token"){
        _gaq.push(["_trackEvent", pushProvider + "-Gmail", pushProvider + "-Token-Request-Failed-Attempt", failedAttemptTrigger]);
    }
    
}