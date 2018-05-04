var pusherActiveClientPollerID = 0;

function initPusherApp(data = {}){

	var app = data.app_details;
	
	//Pusher does not support CORS, had to do the following to ensure that the user's cookie is passed in the auth request to texty https://github.com/pusher/pusher-js/issues/62				
	Pusher.Runtime.createXHR = function () {
		var xhr = new XMLHttpRequest()
		xhr.withCredentials = true
		return xhr
	}				
	
	var pusher = new Pusher(app.app_key, {
		authEndpoint: `${baseUrl}/pusher-auth?client=crx_new&app_version=${manifest.version}`,
		excrypted: true,
		cluster: app.cluster,
		disableStats: true//prevents us from submitting stats events to the pusher server
	});
	
// 	pushServiceLogger("Pusher app created!");
	
	var channel = pusher.subscribe(app.channel);
	
	channel.bind(app.event, function(data) {//message event

		pushServiceLogger("Received pusher message on channel: " + app.channel);
		console.info("[PUSHER]", data);
		handlePushSocketOnMessageForBabySitter(data.message, "pusher");
		processPushPayload(data.message);

	});

	pusher.connection.bind('state_change', function(states) {//generic pusher socket state change listener.  only listening for states that are relevant ("connected", "failed", "disconnected") 11.29.17 KL

		var previousSocketState = states.previous,
			currentSocketState = states.current;
			
		pushServiceLogger("Socket state changed.  Previous state: \"" + previousSocketState + "\". Current state: \"" + currentSocketState + "\".");
		
		if(currentSocketState == "connected"){

			pushServiceLogger("Subscribed to pusher channel: \"" + app.channel + "\" and event: \"" + app.event + "\". Current pusher connection state \""+ pusher.connection.state + "\"");			
			pushSocketOpenedActions(data);//common actions to take
					
			startPusherActiveSessionPoller();//since this is a backup push provider as of 11.2.17, we need to let the server know that this session is still active, otherwise it will stop pushing paylods to pusher. KL
						
		} else if (currentSocketState == "failed"){

			//added event to keep track of users who are pusher incompatible 11.29.17 KL
			//documentation states that if Pusher is not supported, this event will fire. 11.29.17 KL
			recordPUSHHealthCheckEvent({push_type:"push-socket-open", sub_type:pushProvider, attempt: 1, success: 0, completion_time: 0});
			pushServiceLogger("Unable to subscribe to pusher channel: \"" + app.channel + "\".", "error");				
			
		} else if (currentSocketState == "disconnected"){
			//do we want to ALWAYS re-establish? What if we aren't the only ones to trigger this state? 11.29.17 KL
			//we had a similar implementation for CAPI. 
			pushServiceLogger("Socket closed!");
			pushSocketClosedActions();
			// not calling our own logic to trigger a socket open because pusher may automatically reconnect on their own.  so, we are only going to re-establish our socket manually
			
		}
		
	});
	
//example code to detect connection limits.  documentation states that paid plans will not be affected until they reach 120% of their connection limit. We should receive an email alert when over 100% 11.29.17 KL
/*
	pusher.connection.bind( 'error', function( err ) {
		if( err.error.data.code === 4004 ) {
			log('>>> detected limit error');
		}
	});
*/
	
	window.pusherSocketState = pusher.connection.state;
	window.closePusherSocket = function(){//exposing a global method to close and reestablish pusher socket 11.29.17 KL
		//want to avoid making the pusher connection a global var, so we are just going to expose this method to close the socket 11.29.17 KL
		pusher.disconnect();//this does not return any value, unfortunately.
		pushServiceLogger("Closing socket!");
	}

}

function closeAndOpenNewPusherSocket(){

	closePusherSocket();//unfortunately, there isn't a callback for the disconnect method, so we will just have to attempt to setup a new socket async.		
	
	setTimeout(function(){
		if(
			(typeof pusherSocketState != "undefined")&&
			(pusherSocketState != "connected")
		){//if the socket state is not connected, then it means that we were unable to disconnect the socket
			retrievePusherSetupInfo();
		}		
	}, 1000);//wait 2 seconds, then confirm that we successfully disconnected from the client before we attempt to refetch the pusher app details and recreate the socket 12.4.17 KL
	
}

function retrievePusherSetupInfo(data={}){

	$.ajax({
		type: "POST",
		url: `${baseUrl}/pusher-setup?client=crx_new&app_version=${manifest.version}`,
		dataType: "json",
		timeout: 10000,
		xhrFields: { 
			withCredentials: true
		},
		success: function(response){
			//need to check how the response looks when a user is not logged in!
			console.info("[PUSHER] Response from server for request to /pusher-setup: ", response);
			if("app" in response){
				var initOptions = $.extend({}, {app_details: response, tab_id: data.tab_id});
				initPusherApp(initOptions);				
			} else if(response.indexOf("LOGIN_REQUIRED") > -1){
                console.log("Server returned that the user is no longer signed in to MT at: " + new Date() + " in request for CAPI Token. About to tell all tabs running cs.js this and then reload bg.html");
                alertAllContentScriptsOfUserSignedOutThenReload({trigger: "capi-token-request"});
			} else {
				reattemptToSetupPushSocket({
                    num_attempts: data.attempt, 
                    tab_id: data.tab_id,
                    trigger: "server-responded-without-valid-token"
                });
			}
		},
		error: function(){
			
			pushServiceLogger("Connection error occurred while making request to get push setup info", "error")

			reattemptToSetupPushSocket({
                num_attempts: data.attempt, 
                tab_id: data.tab_id,
                trigger: "ajax-error"
            });

		}
	});
		
}

function retrievePusherJSLib(){//leaving this in for now, until we completely switch over to pusher in the webapp, so we'll have this has an include instead of the firebase js. 11.30.17 KL

	$.ajax({
		type: "GET",
		url: "https://js.pusher.com/4.1/pusher.min.js",
		dataType: "script",
		success:function(){
			pushServiceLogger("Success! Retrieved Pusher JS Lib");
			retrievePusherSetupInfo();	
		},
		error: function(){
			pushServiceLogger("Unable to retrieve Pusher JS Lib", "error")
		}
	});
	
}

function startPusherActiveSessionPoller(){//add recursive if we decide to keep the pusher "active" user logic on the server 11.29.17 KL
	
	var pollerInterval = 45 * 60 * 1000;//every 45 mins
	
	clearInterval(pusherActiveClientPollerID);
	
	var requestURL = baseUrl + "/pusher-keepalive?client=crx_new";
	
	if("version" in manifest){
		requestURL += "&app_version="+manifest.version;
	}
	
	pusherActiveClientPollerID = setInterval(function(){
		$.ajax({//intentionally no timeout, because it's important that complete this request.  ( to keep the kerver from stopping syncing ) 11.30.17 KL
			type: "GET",
			url: requestURL,
			xhrFields: { 
				withCredentials: true
			}
		});
	}, pollerInterval);
	
}