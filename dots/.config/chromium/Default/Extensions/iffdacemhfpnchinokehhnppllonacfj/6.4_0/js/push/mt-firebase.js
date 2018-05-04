function retrieveFRDClientLib(){

	$.ajax({
		type: "GET",
		url: "https://www.gstatic.com/firebasejs/4.1.3/firebase.js",
		dataType: "script",
		success:function(){
			pushServiceLogger("Success! Retrieved FRD JS Lib");
			getFRDToken();	
		},
		error: function(){
			pushServiceLogger("Unable to retrieve FRD JS Lib", "error");
		}
	});

}

/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param clientKey - a unique key for this user.
 * @param token - secure token passed from the server
 * @param channelId - id of the 'channel' we'll be listening to
 * @param initialMessage - message.
 */

function initFirebase(data = {}) {
	
	// This is our Firebase realtime DB path that we'll listen to for updates
	// We'll initialize this later in openChannel()
	var channel = null,
		clientKey = data.client_key,
		token = data.token,
		channelId = data.channel_id,
		numAttemptsThisSession = data.attempt;

	/**
	 * This method is called every time an event is fired from Firebase
	 * it updates the entire game state and checks for a winner
	 * if a player has won the game, this function calls the server to delete
	 * the data stored in Firebase
	 */
	function onMessage(newState) {

		try{//in case there is an error w/ the json parse.

			pushServiceLogger(`FRD on message event triggered message length: ${JSON.stringify(newState).length}`);
		
			if("message" in newState){
				handlePushSocketOnMessageForBabySitter(newState.message);
				frdMSGPayloadHandler(newState.message);
				pushServiceLogger(`FRD msg payload: ${JSON.stringify(newState.message)}`);
			}
			
		} catch(err){
			pushServiceLogger("!!! Error occurred in FRD on message handler: " + err, "error");
		}
				
	}

	/**
	 * This function opens a realtime communication channel with Firebase
	 * It logs in securely using the client token passed from the server
	 * then it sets up a listener on the proper database path (also passed by server)
	 * finally, it calls onOpened() to let the server know it is ready to receive messages
	 */
	function openChannel(optionalDoNotReattempt) {
		// [START auth_login]
		// sign into Firebase with the token passed from the server
// 		return false;//TEMPORARILY NOT OPENING THE CHANNEL

		if(typeof token == "string"){
// 			console.log("FRD Token",token);
			firebase.auth().signInWithCustomToken(token).then(function(){
				
				window.frdSocket = firebase.database();//reference to the FRD database.  equiv of CAPI socket obj
				
				pushServiceLogger("FRD socket opened.");
												
				//ongoing connection state change event listeners
				var connectedRef = frdSocket.ref(".info/connected");
				
				connectedRef.on("value", function(snap) {
					if (snap.val() === true) {//connected
						pushServiceLogger("FRD socket changed state: connected");
					} else {//disconnected
						pushServiceLogger("FRD socket changed state: disconnected");
					}
				});

				pushServiceLogger("FRD socket created.");
				
				// [START add_listener]
				// setup a database reference at path /channels/channelId
				channel = frdSocket.ref('channels/' + channelId);
				// add a listener to the path that fires any time the value of the data changes
				channel.on('value', function(data) {
					onMessage(data.val());
				});
				
				pushSocketOpenedActions(data);//common actions like an initial push babysitter, setting babysitter interval, and requesting phone notifs if socket open was triggered in PNLV
					
			}).catch(function(error) {
				if("code" in error){
					pushServiceLogger('Login Failed!', error.code, "error");
				} else if("message" in error){					
					pushServiceLogger('Error message: ', error.message, "error");
				} else{
					console.error("Error occurred while trying to auth to Firebase", error);
				}

				try{
					console.error(error);
					pushServiceLogger(`FRD Auth Error: "${JSON.stringify(error)}"`, "error");
				} catch(err){
					
				}
				
				recordPUSHHealthCheckEvent({push_type:"frd-socket-open", attempt: 1, success: 0, completion_time: 0});
				if (error.code === 'auth/invalid-custom-token') {//this is the only error according to the documentation, associated with this method of authentication 8.7.17
					setTimeout(function(){
						numAttemptsThisSession++;
						getFRDToken({attempt: numAttemptsThisSession});//SI and KL were seeing errors open a FRD socket in the wild, so we are going to reattempt opening a FRD socket 8.8.17
					}, 2000);
				}
				
			});
			
		} else {

			var unexpectedTokenStr = typeof token;

			setTimeout(function(){
				numAttemptsThisSession++;
				getFRDToken({attempt: numAttemptsThisSession});//SI and KL were seeing errors open a FRD socket in the wild, so we are going to reattempt opening a FRD socket 8.8.17
			}, 2000);
		}
		// [END auth_login]

		// [END add_listener]
	}

	setTimeout(openChannel, 100);
}

var firebaseApp;


function isPushLibLoaded(){
	var check = false;
	if(typeof firebase != "undefined"){//this is frd specific, but should be swapped out for any push provider we choose
		check = true
	}
	return check;
}

function getFRDToken(data = {}) {//SI and KL were seeing errors open a FRD socket in the wild, so we are going to add some retry logic

	var idOfTabToNotifyOfPushSocketOpen;//creating a var here to avoid exceptions being thrown when we attempt to pass a tab id that is NOT being passed during the socket re-establishment logic 1.16.18 KL
	
	if("tab_id" in data){
		idOfTabToNotifyOfPushSocketOpen = data.tab_id;
	}
	
	var setupReqUrl = baseUrl + "/setup?client=crx_new";
				
	$.ajax({
		type: "GET",
		url: baseUrl +"/setup",
		timeout: 10000,
		xhrFields: {
			withCredentials: true
		},
		success: function(response){

			if (response.error && response.error === "user_not_logged_in"){
// 				window.location = baseUrl + "/start";

                console.log("Server returned that the user is no longer signed in to MT at: " + new Date() + " in request for CAPI Token. About to tell all tabs running cs.js this and then reload bg.html");
                alertAllContentScriptsOfUserSignedOutThenReload({trigger: "capi-token-request"});

            } else if(
	            ("token" in response)&&//needed to OPEN the socket.  We pass this token to firebase
	            ("channel_id" in response)//needed to setup the onmessage listener, to know which channel to subscribe to
            ){
	            if("config" in response){//
		            try{
			            
			            if(typeof firebaseApp == "undefined"){//never defined a Firebase App
				            defineFirebaseApp({
					            attempt: data.attempt,//current attempt count
					            server_resp: response,
					            tab_id: idOfTabToNotifyOfPushSocketOpen
				            });
				            
			            } else {//this is likely triggered by retry logic.  KL 092617
				            
				            firebase.app().delete().then(function(){
					            
								defineFirebaseApp({
						            attempt: data.attempt,//current attempt count
						            server_resp: response,
						            tab_id: idOfTabToNotifyOfPushSocketOpen
					            });
				            }).catch(function(err){
					            console.error("Error occurred deleting the firebase app: \""+ err +"\"");
				            });					            
			            }
		            } catch (err){
			            console.error("Error reconfiging the firebase app:  \""+ err +"\"");
		            }
	            } else {
			        var initOptions = buildFirebaseInitOptions({
				        attempt: data.attempt,//current attempt count
				        server_resp: response,
			            tab_id: idOfTabToNotifyOfPushSocketOpen
			        });
			        initFirebase(initOptions);
	            }

            } else {//received an unexpected response from GAE

				reattemptToSetupPushSocket({
                    num_attempts: data.attempt, 
                    tab_id: data.tab_id,
                    trigger: "server-responded-without-valid-token"
                });

            }
		},
		error: function(err, err_str){
			//attempting a retry because the request to GAE failed				
			reattemptToSetupPushSocket({
                num_attempts: data.attempt, 
                tab_id: data.tab_id,
                trigger: "ajax-error"
            });
			
		}
	});
			
}

function defineFirebaseApp(data){
	try{
		var response = data.server_resp;//response of /setup request to GAE.  Wanted to consolidate the code to define the Firebase app obj, so we need to pass this along to function that opens the socket
		var config = response.config;
        firebaseApp = firebase.initializeApp(config);
        var initOptions = buildFirebaseInitOptions(data);
        initFirebase(initOptions);
        
        
		var randInt = Math.floor(Math.random() * 100);//generating a number 0-99
		if(randInt < 5){//1 in 5 sampling

		    if("apiKey" in config){
			    var keyID = config.apiKey.substr(config.apiKey.length - 2);		    
		    }

	    }
        
	} catch (err){
		console.error("Error occurred defining firebase app: " + err);
	}	
}

function frdMSGPayloadHandler(a){//copy of socket.onmessage (CAPI) as of 8.7.17

	processPushPayload(a);

}

function closeAndReAttemptOpenFRDSocket(){
	
	firebase.auth().signOut().then(function(){
		pushServiceLogger('Signed out of Firebase instance.  AKA Closing FRD Socket.');						
		recordPUSHHealthCheckEvent({push_type:"frd-socket-close", attempt: 0, success: 0, completion_time: 0});
		getFRDToken();//want to re-request a frd token in either case
	}).catch(function(err){
		getFRDToken();//want to re-request a frd token in either case	
		console.error("Error signing out the app!", err);
	});		
	
}

function buildFirebaseInitOptions (data = {}){
	var options = new Object;
	
	try{
		var serverResp = data.server_resp;
		options = {
			client_key: serverResp.client_key,
			token: serverResp.token,
			channel_id: serverResp.channel_id,
			attempt: data.attempt,
			tab_id: data.tab_id//this is GText specific 1.11.18 KL Need to know which tab running a content script needs to be notified that the push socket has been opened successfully.
		};
		
	} catch(err){
		console.error("An error occurred while generating the Firebase Init options", err);
	}
	return options;
	
}