function checkGmailPageValid(){
//LOOK FOR THE VIEW=BTOP STRING TO PREVENT CONTENT SCRIPT FROM BEING INJECTED IN EMAIL POP OUT SCREEN.  THEN LOOK FOR VIEW=PT TO COMPENSATE FOR PRINT POPOUT
//Update 3/9/16 added the check for the substring "/mu/" which indicates the mobile version of gmail
//Update 3/10/16 added check for the substring "/h/" which indicates the basic HTML version of gmail
//Update 3/11/16 added check for pre populated compose gmail windows
    if((window.location.href.indexOf("view=btop") > -1) || (window.location.href.indexOf("view=pt") > -1) || (window.location.href.indexOf("ServiceLogin?service=mail") > -1) ||  (window.location.href.indexOf("?logout") > -1) || (window.location.href.indexOf("/mu/") > -1) || (window.location.href.indexOf("/h/") > -1) || (window.location.href.indexOf("/x/") > -1) || (window.location.href.indexOf("view=cm") > -1)){
        return false;
    }   
}

function disableConsoleLogs(check){
    if (check){
        console.log = function(){};
    } else {
        console.log = console.log;
    }
};

    if (checkGmailPageValid() != false) {//Check if we should run our app in this page.  If this checkGmailPageValid() function does not return false, then start initializing the app.  otherwise, do nothing.  KL 5/27/14  In prior versions we checked if the function returned false.  If it did, we would stop the content script at this point and return false out of the code.  However, after some research KL discovered that you are not supposed to return unless inside of a function.  Since we were not, it was throwing an error "illegal return statement"
        
        setTimeout(function(){
            tellBackGroundScriptInstructionsForCRXStart();
        }, 1000);

// 		if(getRandomInt(0, 100) < 10){//update 4.7.16 we are only going to parse the dom 10% of the time

	    	setListenerForWindowLoadToCheckDom();//checking the DOM for crucial elements that we need to append our own UI elements into the Gmail/Facebook DOM.
//     	}
    	//moved this function call here because we don't want to query for dom elems in Gmail on non valid pages
    	//disabled on 3/9/16 by KL because we're learned what we wanted to about Gmail/FB DOM

    }

    var manifest = chrome.runtime.getManifest();

    if(getRandomInt(0, 100) === 6){
        callGAInBackgroundPage("CRX-Gmail", "Startup-Content-Script-1pct-Sample", manifest.version);        
    }
    
    var autoContacts = new Array();
    var baseUrl = "https://textyserver.appspot.com";
    
    //IMG URLS
    var removeImgURL = chrome.extension.getURL('img/remove.png');
    var fbHeaderShareImgURL = chrome.extension.getURL('img/megaphone_48x48.png');
    var minImgURL = chrome.extension.getURL('img/minimize.png');
    var maxImgURL = chrome.extension.getURL('img/maximize.png');
    var popImgURL = chrome.extension.getURL('img/popout.png');
    var closeImgURL = chrome.extension.getURL('img/close.png');

    var fbCloseImgURL = chrome.extension.getURL('img/close-fb.png');

    var closeGreyImgURL = chrome.extension.getURL('img/close_grey.png');
    var checkImgURL = chrome.extension.getURL('img/checkmark-yes.png');
    var clockImgURL = chrome.extension.getURL('img/red-clock-waiting.png');
    var logoImgURL = chrome.extension.getURL('img/mightylogo.png');
    var sendImgURL = chrome.extension.getURL('img/mightysend.png');
    var loadGIFURL = chrome.extension.getURL('img/loading.gif');
    var attachImgURL = chrome.extension.getURL('img/attach-gm.png');
    var starredImgURL = chrome.extension.getURL('img/starred.png');
    var unstarredImgURL = chrome.extension.getURL('img/unstarred.png');
    var forwardImgURL = chrome.extension.getURL('img/icon-forward-1.png');
    var deleteImgURL = chrome.extension.getURL('img/trashcan.png')
    var chargingImgURL = chrome.extension.getURL('img/icon-charging-blue.png');
    var phoneImgURL = chrome.extension.getURL('img/phone_icon.png');
/*     var settingsImgURL = chrome.extension.getURL('img/settings.png'); */
    var settingsImgURL = chrome.extension.getURL('img/settings.png');
    var shareImgURL = chrome.extension.getURL('img/red_microphone.png');
    var gSendImgURL = chrome.extension.getURL('img/social/gmail_share2.png');
    var fbShareImgURL = chrome.extension.getURL('img/social/fb_share.png');
    var twitShareImgURL = chrome.extension.getURL('img/social/twit_share.png');
    var twitShare2ImgURL = chrome.extension.getURL('img/twit_bird.png');
    var googShareImgURL = chrome.extension.getURL('img/social/gplus_share.png');
    var backgroundImgURL = chrome.extension.getURL('img/bg-squares.png');
    var photosVideosImgURL = chrome.extension.getURL('img/gmailMMS.png');
    var composeImgURL = chrome.extension.getURL('img/composeNew.png');
    var settingsArrowImgURL =  chrome.extension.getURL('img/arrow_down.png');
    var settingsArrowWhiteImgURL =  chrome.extension.getURL('img/arrow_down_white.png');
    var mightyleftnavicon = chrome.extension.getURL('img/mightylogo2.png');
    var fbSignedOutImgURL =  chrome.extension.getURL('img/mt_fb_navlogo_signedout.png');
    var fbNavBarLogo =  chrome.extension.getURL('img/mt_fb_navlogo.png');
    var groupMMSWhiteImgURL =  chrome.extension.getURL('img/groupMMS.png');
    var sendIndividualWhiteImgURL =  chrome.extension.getURL('img/groupMMS_individual.png');
    var groupMMSImgURL =  chrome.extension.getURL('img/groupMMS.png');
    var sendIndividualImgURL =  chrome.extension.getURL('img/groupMMS_individual.png');
    var mightyLoadingGifURL = chrome.extension.getURL('img/green_spinner.gif');
    var smileImgURL = chrome.extension.getURL('img/smile.png');
    var imgPlaceHolderURL = chrome.extension.getURL("img/blank.gif");
    var mmsAttachRemove = chrome.extension.getURL("img/emojicontainer-remove.png");
    //SCHEDULER ICONS
    var scheduledMessageImgURL = chrome.extension.getURL("img/scheduled_message_clock.png");
    var cancelledScheduledMessageImgURL = chrome.extension.getURL("img/cancelled_scheduled_message.png");
    var successScheduledMessageImgURL = chrome.extension.getURL("img/success_scheduled_message.png");
    var SchedulerImgURL = chrome.extension.getURL("img/10-device-access-alarms.png");
    //END IMG URLS
    
    var optionsPageURL = chrome.extension.getURL('options.html');
    var currentHost = window.location.host;
    var currentLocation
    var capiHubInitializeCheck = false;
    var createNotifsInGmail = true;
    var currentAndroidAppVersion = 3.85;
    var mightyTextAccount
    var googleAccountMatch = true;
    var multipleAccountSupport
    var pageTitleToggle//is the toggle active?
    var listeningForChangeInPageTitle = false; //have we already extended our observer to listen for changes in the title?
    var isAProUser = false;
    var enterToSend = true;//defaulting to true, before we even get the value stored on MT's servers
    var currentWindowWidth,
        webappIframeContainer;

    if(currentHost.indexOf("facebook.com")> -1){
        currentLocation = "Facebook";
    } else if (currentHost.indexOf("mail.google.com")> -1){
        currentLocation = "Gmail";
    }
    
    
	var domManipulationContainerSelectors = {//1.22.18 KL implemented a global obj with common selectors for elems that we use to manipulate the dom in sub clients (Gmail/Facebook)
		"Gmail":{
			"left_nav": function(){
				return $("[role='navigation']").find(".n3 > *:eq(0) > .TK > *:eq(1)");
			}
		}
	}

//commented the interval below on 10.26.15 because it was causing any subclient tabs to crash after a user disabled the extension.
//It was meant to be a system to alert the user that the content script had an issue communicating with bg, and that they should reload that subclient tab
/*
    var bgConnectCheckInterval = setInterval(function(){
            //sending a message to make sure we are still able to communicate with BG
                        
            chrome.runtime.sendMessage({
                background_connection_check:true
            }, function(response){
                var lastError = chrome.runtime.lastError;

                if(lastError){//there was an error sending this message to the bg script
                    if((typeof globalMTGTextHelper != "undefined") && (globalMTGTextHelper.hasOwnProperty("bg_connection_notif")) && (globalMTGTextHelper.bg_connection_notif != false)){
        
                        var errorNotifBody = "MightyText in " + currentLocation + " is experiencing some connection issues. <br><br> Please <a href='#' onclick='window.location.reload()' >reload</a> this tab of " + currentLocation +".<br><br>If this problem continues, then please contact our support with error code: <strong>CSBGCONN23</strong>",
                            tsNotifDismiss = 999999;
        
                        if(currentLocation == "Facebook"){
                            initializeInfoModal({message: errorNotifBody, id:"closed_mighty_windows", ts_dismiss_override: tsNotifDismiss});
                        } else if (currentLocation == "Gmail"){
                            displayBootstrapAlertNotif({message: errorNotifBody, ts_dismiss: tsNotifDismiss, type: "error"});
                        }
        
                    }
                    
                    //attempt to make a serverside KM call. Since we are not able to communicate with bg, which is usually how we would make a KM
                    var kmEventPropertyJSON = JSON.stringify({Subclient: currentLocation, Client: 'CRX-New'});
                    makeServerSideKMEventCall({event_name: "Unable-To-Communicate-To-Background", event_properties_json: kmEventPropertyJSON});
                    
                    clearInterval(bgConnectCheckInterval);//once we know that we are unable to communicate with bg, we should clear this interval.
                    bgConnectCheckInterval = 0;
                    console.error(e);
                    
                    return;
                }
                
            });  
    }, 60000);
*/
    
    function makeServerSideKMEventCall(options){
        
        if(typeof mightyTextAccount == "undefined"){
            return false;//don't bother with this request because we need the user's email that is tied to their mt cookie to properly attribute this KM.
        }
        
        var requestData = options;
            requestData.username = mightyTextAccount;
        
        $.ajax({
            type: "POST",
            url: "https://mightytext.net/tools/km_script/tracker-new-km.php",
            data: requestData,
            timeout: 10000,
            success: function(response){
                console.info(response);
            },
            error: function(requestObj, textStatus){
                console.error("error in request send a dispatch about cs => bg communication error");                
            }
        });
        
    }
        
    if(getRandomInt(0, 100) === 12){
        callGAInBackgroundPage("CRX-Gmail", "Subclient-Content-Script-Load-1pct-Sample", currentLocation);
    }
        
    function initializeApp(userStatus, optionalRetryAttemptCount) {   
        //alert("initialize App Start, UserStatus: " + userStatus + ", Location: "+ optionalFunctionOrigin + " Current Domain:" + currentLocation); 
        var composeParent = determineComposeParentPerSubClient();

        var smsButtonContainerLoaded = checkIfSmsButtonContainerHasLoaded(userStatus, composeParent, optionalRetryAttemptCount);
                
        if(smsButtonContainerLoaded){
            insertMightyButton(userStatus, composeParent);
        }    
        
    };
    
    function determineComposeParentPerSubClient(){
	    
	    var composeParent = false;
	    
	    if(currentLocation == "Facebook"){

		    var numElemsInTopNavBar = $('#pagelet_bluebar [role="navigation"]').children().length;
		    
		    if(numElemsInTopNavBar === 3){//this is the most common dom structure
			    composeParent = $('[name="requests"]').parent().parent().parent();
		    } else if (numElemsInTopNavBar === 6){//this is the second most common.  
			    //if we find this class then we know it's a different version of the gmail UI
			    //we need traverse down one level in the DOM in this case.
			    composeParent = $('[name="requests"]').parent().parent().addClass("ftext-v2");//adding a class to the parent elem of the compose button so that we can have custom CSS for this case.
			    
		    } else {//unrecognized num children of the top nav bar
				//calling a GA event if we don't recognize the num children of the top nav bar in the DOM to get a sense of the different structures of FB DOMs out in the wild.
				callGAInBackgroundPage("FB-Checker", "Num-Top-Nav-Bar-Children", numElemsInTopNavBar.toString());
			    composeParent = false;
			    
		    }
		    
	    } else if (currentLocation == "Gmail"){
		    //we currently aren't using this in gmail
		    composeParent = $(document).find('div.aic');
		    
		    if(composeParent.length < 1){
			    //3/9/16 Unable to find the elem we want to append our compose new button into.  GA-ing the user's current URL to see if we are missing any substrings in checkGmailPageValid()
				callGAInBackgroundPage("Gmail-Checker", "Compose-New-Not-Found-Current-User-Page-Url", window.location.href);
		    }		    

		    
	    } else if ( currentLocation == "Outlook"){//currently not in use. 3/8/16
            $('<div class="dw" id="outlookNotifs"><div id="insertedNotifContainer" style="float:right; margin-right:12px;"><div class="nH nn"></div><div class="nH nn"></div></div></div>').appendTo('div#Middle');
        
        
            composeParent = $(document).find("div#c_header ul.c_cc");
        } else {
		    console.error(new Date() + " unrecognized subclient in determine compose parent : " + currentLocation);
	    }
	    
	    return composeParent;
	    
    }

    function checkIfSmsButtonContainerHasLoaded(userStatus, composeParent, optionalAttemptToFindComposeButtonParentElemCount){//In this function we are checking if the html element where we are appending the compose button exists, if not then we check again by calling initializeApp again in a second to run through this entire process again. 7/23/14 KL
        var value2,
	        attemptToFindComposeButtonParentElemCount;
        
        if(typeof optionalAttemptToFindComposeButtonParentElemCount == "undefined"){
	        attemptToFindComposeButtonParentElemCount = 0;
        } else {
	        attemptToFindComposeButtonParentElemCount = optionalAttemptToFindComposeButtonParentElemCount;
        }
        
        if (composeParent.length < 1) {
//             console.log("The initial check failed! the SMS compose button is not working because the Parent div of this clients's compose button could not be found.");            
            if(attemptToFindComposeButtonParentElemCount < 10){
	            setTimeout(function() {
    	            attemptToFindComposeButtonParentElemCount++;
	                initializeApp(userStatus, attemptToFindComposeButtonParentElemCount);
	            }, 1000);	            
            }            
        } else {
            value2 = checkIfGmailNotifContainerExists();            
        }            
        
        return value2;
        
    }

    function insertMightyButton(userStatus, composeParent) {

        if (userStatus == "userLoggedIn") {
            if(currentLocation == "Facebook"){
            
                insertFacebookMenu(userStatus, composeParent);                
                          
            } else if ( currentLocation == "Gmail"){
                composeButtonHTML = '';
                //CLEAR ANY EXISTING BUTTONS.
                $("#gText").remove();
                
                
                //CLEAR ANY PRE-EXISTING MODALS
                var multiAccountsModalCheck = $("#multiAccountsModal");
                
                if(multiAccountsModalCheck.length > 0){
                    $(multiAccountsModalCheck).remove();
                }
                
                //INSERT COMPOSE SMS BUTTON, SETTINGS PANE, SOCIAL SHARE BUTTONS.
                
                $('<div id="gText" class="mightyClearfix"><button id="composeSMS" class="composeButton">Compose SMS</button><div class="settingsButtonContainer"><img id="settingsButton" height="18" width="22" src="' + settingsImgURL + '"/></div><div class="shareButtonContainer"><img id="shareButton" height="18" width="18" src="' + shareImgURL + '"/></div><div><img style="display:none" height="1" width="1" class="sprite" src="' + imgPlaceHolderURL + '"/><img style="display:none" height="1" width="1" class="spriteEMOJI" src="' + imgPlaceHolderURL + '"/></div><i class="fa fa-save fa-preload"></i><i class="fa fa-file-text fa-preload"></i><i class="fa fa-caret-down fa-preload"></i>').appendTo(composeParent).each(function(){
//pre load font-awesome icons

    
                    setSettingsAndSocialShareClickHandlers();
                    
                });
                
                //append non pro user modal
                buildNonProUserModal();

                //INSERT IFRAME
                                
                insertMightyTextIntoGmail();
                
                //INSERT BAT STAT BAR
                insertBatStatBar();
                
//                updateBatteryStatusDisplay(20, '<div id="chargingIcon"><img src="' + chargingImgURL + '"/></div>', null, null, "insert dummy stat");

            } else if ( currentLocation == "Outlook"){
            
                $('<button id="composeSMS" class="composeButton">Compose SMS</button>').insertAfter(composeParent).each(function(){
    
                    setSettingsAndSocialShareClickHandlers();
                    
                });
                
                insertMightyTextIntoGmail();

            }
            
            //initialize Noble Count
            setNobleCountSettings();

            //SET CLICK HANDLER FOR COMPOSE BUTTON
            setComposeButtonClickHandler();
            
            //set user signature value
            //adding a delay so that bg can relay the message that the user is PRO
            setTimeout(function(){
                getAndSetUserSignature();
            }, 1000);
                                    
        } else if (userStatus == "userNotRegistered") {
            if(currentLocation == "Gmail"){
                $("#gText").remove();
                $(composeParent).append('<div id="gText" class="mightyClearfix"><button id="installApp">Install<img class="installAppImg" src="' + logoImgURL + '"></button></div>').find("#gText").each(function() {
                    $(this).on("click", function() {
                        chrome.runtime.sendMessage({
                            GoToInstall: true
                        }, function(response) {
                            console.log(response.confirmation);
                        });
                    });
                });                
            } else if (currentLocation == "Facebook"){

                insertFacebookMenu(userStatus, composeParent);                

            }
            
        } else if (userStatus == "noGoogleAuth") {
            if( currentLocation == "Gmail"){
                $("#gText").remove();
                $('<div id="gText" class="mightyClearfix"><button id="installApp">Authorize<img class="installAppImg" src="' + logoImgURL + '"></button></div>').appendTo(composeParent).each(function() {
                    $(this).on("click", function() {
                        chrome.runtime.sendMessage({
                            GoToGoogleAuth: true,
                            origin: "Gmail"
                        }, function(response) {
                            console.log(response.confirmation);
                        });
                    });
                });
            } else if (currentLocation == "Facebook"){
            
                insertFacebookMenu(userStatus, composeParent);                
            
            }
            
        } else if (userStatus == "extraUserLoggedIn"){
            composeParent = $(document).find('div.aic');
            var buttonHTML = '<div id="gText" class="mightyClearfix"><button id="installApp">MightyText<img class="installAppImg" src="' + logoImgURL + '"></button></div>';
            var modalHTML = '<div id="multiAccountsModal" class="modal hide fadeMighty"><span class="mightyClose close" data-dismiss="modal">x</span><div class="mightyMultiAccount"></div></div>';
            
            $("#gText").remove();
                        
            var multiAccountModalMessage = ' MightyText for Gmail will currently only load in Gmail windows of <b>' + mightyTextAccount + '</b> <br></br> To enable MightyText in all Gmail windows, update the MightyText setting in the Gmail window of <b>' + mightyTextAccount + '</b>';
            $(modalHTML).appendTo('body');
            
            $(buttonHTML).appendTo(composeParent).each(function() {
                $(this).on("click", function() {
                    $('.mightyMultiAccount').html(multiAccountModalMessage);
                    
                    $('#multiAccountsModal').modal({
                       keyboard: true
                    });
                });
            });
        } else if (userStatus == "signBackIn"){
            
            if(currentLocation == "Gmail"){
                //since the user is current logged out, we should hide the leftnav links.
                $("div.mightyLinkWrapper").remove();
                //hide the iFrame, and then set the src to nothing.
                $("div.myMightyText").remove();
                //$("#mightyIframe").attr("src", "");\            
                $("div.newbatterywrap").remove();  

                replacementComposeButtonHTML = '<button id="installApp">Sign In To<img class="installAppImg" src="' + logoImgURL + '"></button>';
                //"sign back in" is triggered after a user already has an existing compose Button.  Therefore, we can just find that div and replace the html.

                //append signbackin button inplace of the compose button                
                $("div#gText").html(replacementComposeButtonHTML).off("click").on("click", function() {
                    chrome.runtime.sendMessage({
                        logBackIn: true,
                        origin: "Gmail"
                    }, function(response) {
                        console.log(response.confirmation);
                    });
                });
              
            } else if (currentLocation == "Facebook"){
                //insert code for removing facebook stuff.
                
                insertFacebookMenu(userStatus, composeParent)
                
            }
        } else if (userStatus == "extraUserLoggedInEnabled"){
            var composeButtonCheck = $("button#composeSMS");
            
            if(composeButtonCheck.length < 1){
                //alert("composeButton does not already exist");
                initializeApp("userLoggedIn");
            } else {
                //alert("composeButton already exists");
            }
            
        } else if (userStatus == "appNotEnabled"){//right now this is facebook specific
            if(currentLocation == "Gmail"){
                
            } else if (currentLocation == "Facebook"){
                insertFacebookMenu(userStatus, composeParent)
            }
        }
        
        //SHOULD WE ALERT THE USER OF THE TOUR?
        checkIfUserHasRunThroughTour();
                
        //when the window resizes, adjust the height of the composer parent.
        $(window).resize(function() {
            currentWindowWidth = $(this).width();            
            updateWindowContainerHeights();
            dynamicallySetHeightOfMightyFrame();
        });

    };

    function checkIfGmailNotifContainerExists(){
        var hangoutsEnabledCheck = $('div#talk_roster');
        var gchatEnabledCheck = $('div.akc.aZ6');
        var newGmailComposeCheck = $('div.dw');
        var value = false;
                
        if (hangoutsEnabledCheck.length > 0){
            console.log(new Date() + " hangouts is enabled.");
            value = true;
        } else if(gchatEnabledCheck.length > 0){//on 3.9.16 KL found that this elem is always being appended to the DOM even if a user disabled gChat, which means that a notif container will always be there as well.
            console.log(new Date() + " gchat is enabled");
            value = true;
        } else if (newGmailComposeCheck.length > 0){
            console.log(new Date() + " gchat is not enabled. But the new email compose is.")
            value = true;
        } else {
            if(currentLocation == "Gmail"){
                console.log(new Date() + " Neither gchat nor new email compose are enabled.  Guess we're gonna have to position absolute in the bottom right.");
                var mtCustomNotifContainerHTML = '<div class="dw">';
	                mtCustomNotifContainerHTML += '<div id="insertedNotifContainer" style="float:right; margin-right:12px;">';
	                mtCustomNotifContainerHTML += '<div class="nH nn"></div>';
	                mtCustomNotifContainerHTML += '<div class="nH nn"></div>';
	                mtCustomNotifContainerHTML += '</div>';
	                mtCustomNotifContainerHTML += '</div>';
                $(mtCustomNotifContainerHTML).appendTo('body');
            }
            value = true;
        }
        
        return value;
    }
    
    function insertFacebookMenu(userStatus, composeParent){
        var mightyFBSettingsImgUrl = chrome.extension.getURL('img/fb_settings_icon.png');
    
        var mightyJewelHTML = '<div class="mightyJewelWrapper" id="navAccount"><a class="jewelButton mightyJewelBtn"><i class="fa fa-caret-down" id="composeLogo" style="font-size:14px;line-height: 34px; color: #fff;"></i></a><div class="mightyButtonDivider"></div></div>';
        
        //clear any existing buttons
        $(".mightyJewelWrapper").remove();

        $(mightyJewelHTML).prependTo(composeParent).each(function(){//
/*         $(mightyJewelHTML).appendTo(composeParent).each(function(){ */
            console.log(new Date() + " appended settings caret into FB top nav bar");
            listenForChangesInFBDom();
			            
            setSettingsAndSocialShareClickHandlers({
	            fb_settings_menu_destination: $(composeParent).find("#navAccount")
            });
            
            if(userStatus == "appNotEnabled"){
            
                var appNotEnabledImgURL = chrome.extension.getURL('img/mightylogo3.png');

                $(".mightyJewelBtn").html('<img id="composeLogo" class="appNotEnabled" height="24" width="auto" style="margin-top: 5px;" src="'+appNotEnabledImgURL+'" />');            
/*                 $("#composeLogo").attr("src", appNotEnabledImgURL); */
                $(".fbComposeButton").remove();
                
                setupFBJewelClickHandler(userStatus, this);

            } else{
	            
                if(userStatus != "userLoggedIn"){
                    
                    var utilLinkText
            
                    var messageObj
                    
                    if(userStatus == "noGoogleAuth"){
                        utilLinkText = 'Authorize';
                        messageObj = {
                            GoToGoogleAuth: true,
                            origin: "Facebook"
                        }
                    } else if (userStatus == "userNotRegistered"){
                        utilLinkText = 'Install App';
                        messageObj = {
                            GoToInstall: true
                        }
                    } else if (userStatus == "signBackIn"){
                        utilLinkText = 'Sign In';
                        messageObj = {
                            logBackIn: true,
                            origin: "Facebook"
                        }                
                    }    
                    
                    var signBackInHTML = '<li class="settingsLink fb" id="signInTrigger">' + utilLinkText + '</li>';
                    $(".fbComposeButton").remove();

                    //disable signout link in the dropdown.
                    $("li#signOutTrigger, li#settingsTrigger").addClass("disabled");
                    //replace dropdown logo with signed out version. 
/*                     $("#composeLogo").attr("src",fbSignedOutImgURL); */
                    $(".mightyJewelBtn").html('<img id="composeLogo" height="24" width="auto" style="margin-top: 5px;" src="'+fbSignedOutImgURL+'" />').each(function(){
                        
                    });
                    
                    $("#userAccountDisplay").replaceWith(signBackInHTML).each(function(){
                    //addhover effect some how.
                        
                        $("#settingsPane.fb").addClass("userSignedOut");
                        
                        $("#signInTrigger").on("click", function(e){
                            e.stopPropagation();
                            chrome.runtime.sendMessage(messageObj, function(response) {
                                console.log(response.confirmation);
                            });
                        });
                        
                    });
                    
                
        //ACCOUNT FOR THE CASE WHERE A USER NEEDS TO INSTALL THE MT APP ON THEIR PHONE. AND LOST INTO GMAIL.                      
                } else {
                    setupFacebookModal(composeParent);
                }
                
                setupFBJewelClickHandler(userStatus, this);
        
            }             
        });            
    }

    function setupFacebookModal(composeParent){

        var fbComposeButtonHTML = '<div id="fbCompose" data-step="1" data-intro="Compose a New Message from here." data-position="right" class="fbComposeButton composeButton"><img height="24px" width="auto" alt="fbCompose" src="' + composeImgURL + '"/></div>';
        
        $(".fbComposeButton").remove();
        
        //append fbcomposebutton
        $(fbComposeButtonHTML).prependTo(composeParent).each(function(){
            console.log("successfully appended composeButton");
            
            //we know that the user is logged in, and the button has been appended.  let's build the nonprousermodal
            
            buildNonProUserModal();
        });
                
    };
    
    function setupFBJewelClickHandler(userStatus, fbJewelHTML){
        
        var existingFBDropdowns = $("div.uiToggle.flyoutMenu");
        
        var fbJewelButton = $(fbJewelHTML).find(".mightyJewelBtn");
        
        //toggle fb Mighty Settings Pane.
        $(fbJewelButton).on("click", function(e){
//            $(".mightyJewelBtn").tooltip("destroy");
            e.stopPropagation();
            if(userStatus == "appNotEnabled"){   
                var teaserImgURL = chrome.extension.getURL("img/fb_teaser_img.png");     
                var teaserModalHTML = '';
                teaserModalHTML += '<div id="teaserModal" class="modal hide fadeMighty mightyModal teaserModal" ><div class="modal-header">MightyText in Facebook<span class="mightyClose close" data-dismiss="modal">x</span></div>';
                teaserModalHTML += '<div class="modal-body">';
        		teaserModalHTML += '<div class="featTextWrapper">';
        		teaserModalHTML += '<p><span id="featText">Send & receive text messages directly from Facebook</span></p>';
        		teaserModalHTML += '</div>';
        		teaserModalHTML += '<div class="featImgWrapper">';
/*         		teaserModalHTML += '<a href="#" class="featImgWrapper">'; */
        		teaserModalHTML += '<img id="featPrev" src="' + teaserImgURL + '" alt="featImage"/>';
/*         		teaserModalHTML += '</a>'; */
        		teaserModalHTML += '</div>';
        		teaserModalHTML += '</div>';
        		teaserModalHTML += '<div class="modal-footer">';
        		teaserModalHTML += '<div class="learnMoreContainer">';
        		teaserModalHTML += '<a id="learnAboutPro" class="btn btn-success">Try it now';
        		teaserModalHTML += '</a></div>';
                teaserModalHTML += '</div>';

                var teaserCheck = $("body").find("#teaserModal");

                if(teaserCheck.length < 1){
                    $(teaserModalHTML).appendTo("body").each(function(){
                        $("#learnAboutPro").on("click", function(){
                            userEnabledFromFacebookTeaserModal();
                        });                        
                    })
                }

               $("#teaserModal").modal("show");
                
            } else {
                $("div#settingsPane.fb").toggle();
                //loop through each of fb's buttons to see if there an another dropdown open.
                $(existingFBDropdowns).each(function(){
                   var checkIfDropdownIsOpen = $(this).hasClass("openToggler");
                   
                   if (checkIfDropdownIsOpen) {
                       $(this).removeClass("openToggler");
                   } else {
                       //do nothing, because they don't have dropdown open!
                   }
                    
                });                
            }
        });                
        
    };
    
    function userEnabledFromFacebookTeaserModal(){
        //! send message to bg script to enable this in facebook. 
        $("#teaserModal").modal("hide");
        
        chrome.storage.local.set({
            fb_preference: "1"
        }, function() {
            // Notify that we saved.
            console.log('Local settings saved');
        });                
        
        tellBackGroundScriptAppIsEnabled();
        initializeInfoModal({message: '<strong>MightyText in Facebook:</strong> To get started, click <a class="composeButton" id="openNewMessageComposer">here</a> to compose a new text message.', id: "first_time_enabled_mt_in_fb"})
        
    };
    
    function setComposeButtonClickHandler(){

        $('.composeButton').on('click', function(){
            buildNewMessageComposer(false);
        });
    };
    
    function buildNewMessageComposer(checkIfForTour){

            var gmailChatWindowContainer = $("div.dw").find(".nH.nn").first();
	        var fbChatWindowContainer = $('#ChatTabsPagelet').children().children().children(".fbNubGroup");

            var composerDestination = '';
            var mms_HTML = buildHTMLButtonCanvasMMS("4444444");
            
            var baseComposerHTML = '';
            
            baseComposerHTML += '<div class="notificationWrapper" data-context="Compose New">';
            baseComposerHTML += '<div class="mightyno">';
            baseComposerHTML += '<div class="composeOuterContainer">';

            if(checkIfForTour){
                baseComposerHTML += '<div class="composeInnerContainer mightyClearfix composeNew tourComposer">';                
            } else {
                baseComposerHTML += '<div class="composeInnerContainer mightyClearfix composeNew">';
            }

            baseComposerHTML += '<div class="composeHeader composeNew mightyClearfix">';
            baseComposerHTML += '<div class="mightyLogo"><img src="' + logoImgURL + '"/></div>';
            baseComposerHTML += '<p class="title">New Message</p>';
            baseComposerHTML += '<div class="mightbtnholder">';
            baseComposerHTML += '<div class="mighthbtn fbShareMighty"><img src="' + fbHeaderShareImgURL + '"/></div>';
            baseComposerHTML += '<div class="mighthbtn minMighty"><img src="' + minImgURL + '"/></div>';
//             baseComposerHTML += '<div class="mighthbtn openMighty" action="pop_out"><img src="' + popImgURL + '"/></div>';

            var buttonImgUrl;            
            if(currentLocation == "Facebook"){
                buttonImgUrl = fbCloseImgURL;
            } else {
                buttonImgUrl = closeImgURL;
            }
            baseComposerHTML += '<div class="mighthbtn closeCompose" action="close"><img src="' + buttonImgUrl + '"/></div>';                

            baseComposerHTML += '</div>';
            baseComposerHTML += '</div>';
            baseComposerHTML += '<div class="composeBody composeNew mightyClearfix">';
            
            
            
            //SEND CONTACTS
            baseComposerHTML += '<div class="sendTo mightyClearfix" class="mightyClearfix">';
            baseComposerHTML += '<div class="sendContacts" class="mightyClearfix"><span>To:</span><input class="numberToSendTo typeahead" data-autosize-input="{ \'space\': 40 }">';
            baseComposerHTML += '</div>';
/* GROUPMMS */ // it is now a dropdown, not dropup.
            baseComposerHTML += '<div class="groupMMSContainer mightyClearfix"><div class="dropdown mightyDropup mightyClearfix" data-selection="SendAsGroup">';
            baseComposerHTML += '<a class="dropdownToggler" data-toggle="dropdown"><div class="groupTriggerContainer mightyClearfix"><img class="groupMMSIcon" height="24" width="24" src="' + groupMMSWhiteImgURL + '" alt="groupMMS"/><p class="dropdownTrigger mightyTrigger" href="#">Group</p><img width="6" height="3" class="groupMMSDropdownCaret" src="' + settingsArrowImgURL + '" alt="settingsCaret"/></div></a>';
            baseComposerHTML += '<ul class="dropdown-menu pull-right"><li><a class="dropdownOption mightyClearfix" data-selection="SendAsGroup" href="#"><img class="groupMMSIcon" height="16" width="16" src="' + groupMMSWhiteImgURL + '" alt="groupMMS"/>Group</a></li><li><a class="dropdownOption mightyClearfix" data-selection="SendIndividually" href="#"><img class="groupMMSIcon" height="16" width="16" src="' + sendIndividualWhiteImgURL + '" alt="groupMMS"/>Individually</a></li></ul>';
            baseComposerHTML += '</div></div>';
/* GROUPMMS */
            baseComposerHTML += '</div>';
            
            baseComposerHTML += buildResponseAreaHTML({clean_num: "newSMS"});
            
            baseComposerHTML += '</div></div></div>';            

            var existingNewMessageComposer = $(".composeNew");
            
            if(existingNewMessageComposer.length < 1){
                                                   
                if (currentLocation == "Facebook"){
                    composerDestination = fbChatWindowContainer;
                    
                    //adding domain specific classes before the string is appended as html
                    var adjustedComposerHTML = baseComposerHTML.replace("notificationWrapper", "notificationWrapper mightyFB fbNub _50-v _50mz _50m_ _5238 opened");
    
                    var fbChatNotifDockFull = checkIfFBDockIsFull(false);
                    
                    if(fbChatNotifDockFull != false){
                        
                        initializeInfoModal({message: "<strong>MightyText in Facebook:</strong> Sorry, you have too many Facebook Messenger windows open. Please close them and try again.", id: "compose_new"});
                        
                        return false;
                    }
                    
                    
                    
                    $(adjustedComposerHTML).prependTo(composerDestination).each(function() {
                        //adding composer click handlers
                        setupNewComposer(this);
                    
                        //adding classes to various elements for css changes.
                        addAdaptionClasses(this, "notif");
                
                    });
    
                } else if (currentLocation == "Gmail"){
    
                    composerDestination = gmailChatWindowContainer;  
    
                    //adding domain specific classes before the string is appended as html
                    var adjustedComposerHTML = baseComposerHTML.replace("notificationWrapper", "notificationWrapper nH aJl nn mightynH");
    
                    $(adjustedComposerHTML).insertAfter(composerDestination).each(function() {
                        //adding composer click handlers
                        setupNewComposer(this);
                                                                                                                    
                    });
                    //css hack for gmail
                    resetWindowParent(gmailChatWindowContainer[0]);
                } else if (currentLocation == "Outlook"){
                            
                    composerDestination = gmailChatWindowContainer[0];  
    
                    //adding domain specific classes before the string is appended as html
                    var adjustedComposerHTML = baseComposerHTML.replace("notificationWrapper", "notificationWrapper nH aJl nn mightynH");
    
                    console.log(adjustedComposerHTML);
                    
                    $(adjustedComposerHTML).insertAfter(composerDestination).each(function() {
                        //adding composer click handlers
                        setupNewComposer(this);
                        
                        addAdaptionClasses(this, "notif");
                                                                                                                    
                    });
                    //css hack for gmail
                    resetWindowParent(gmailChatWindowContainer[0]);                
                    
                }
                
            } else if(checkIfForTour){//if there is already an existing compose new window, and this function was triggered for the purpose of a tour then we need to add the tourcomposer class so that the tour logic knows what this is for. KL 5/27/14
            
                $(existingNewMessageComposer).addClass("tourComposer");
                
            } else if ($(existingNewMessageComposer).find(".composeHeader").hasClass("minimized")){
                //if there is a minimized compose new in the dom, then open it.
                $(existingNewMessageComposer).find(".minMighty").trigger("click");
                $(existingNewMessageComposer).find(".numberToSendTo").focus();
                
            }
            
    }
    
    function setupNewComposer(composer){
          	
        setupProFeatures("newSMS", "compose_new", "", composer);
        updateWindowContainerHeights(); //update height of outer most container so that it displays the textwindow
        addBasicComposerFunctionality(composer, "Compose New");
        getTypeAheadArray(composer);
        addGroupMMSFunctionality(composer);
                        
        $(composer).find('.numberToSendTo').focus();

    };
    
    function addGroupMMSFunctionality(composer){
        var groupMMSDropdown = $(composer).find("a.dropdownOption");
/*         var groupMMSDropdown = $(composer).find(".groupMMSContainer"); */
        $(groupMMSDropdown).on("click", function(e){
            e.preventDefault();
            var selectionOption = $(this).data("selection");
            var groupMMSDropupParent = $(this).closest(".dropdown"); 
            var groupMMSDropupTrigger = $(groupMMSDropupParent).find(".mightyTrigger");
            var groupMMSIcon = $(groupMMSDropupParent).find(".groupTriggerContainer .groupMMSIcon");
            var selectedText = $(this).text();
            var selectedIcon = $(this).find("img").attr("src");
            
			var draftIcon = $('#newSMS_save-draft');
            
            console.log(selectionOption);
            console.log(groupMMSDropupParent);
            
            $(groupMMSDropupParent).attr("data-selection", selectionOption);
            $(groupMMSDropupTrigger).text(selectedText);
            $(groupMMSIcon).attr("src", selectedIcon);
            
			toggleDraftSaveState(draftIcon, true);
            
        });

    };
            
    function setupProFeatures(id, context, optionalFullPhoneNum, optionalNotifToUpdate){
        
        if((context == "compose_new") || (context == "conversation")){
              
            $(".schedulerContainer").show();   
            setInstructionsForInThreadTemplates(id + "_templatesDropDown");
          	setInstructionsForScheduler(id + "_Scheduler");
          	setInstructionsForSaveDraftButton(id + "_save-draft");

            if(context == "conversation"){//If this pro check was triggered via a conversation thread, and not a compose new, then we should try to build the draft ui.
                if(isAProUser){
      				fetchDraftsAndAppendFlagIfUserHasDraftsForThisThread(0, 10, optionalFullPhoneNum, id);                                    
                }
            } else {//context is compose_new
                if(isAProUser){
                    appendUserSignature(optionalNotifToUpdate);
                }
            }

        }
  
    }
    
    function setSettingsAndSocialShareClickHandlers(options){
                        
        setupSettings(options);
        
        //disable the function below because sharing is being moved over to the settingsPane.
        setupSharing();
    
    };


    
    function insertMightyTextIntoGmail(){
//        ""insertMightyTextIntoGmail");
        //To ensure that we never have duplicate groups of links, we always remove any existing mightylinkwrappers before we check if the user has enabled either Texts or Photos/Videos from being displayed in their gmail leftnav.
        $(".mightyWrapper").remove();
                
        //Check if EITHER setting for Texts or Photos/Videos is enabled  AND if there is a google account match.
/*
        if(googleAccountMatch){

*/

        if(currentLocation == "Gmail"){
            listenForChangesInGmailDom();            
        } else if(currentLocation == "Outlook"){
            listenForChangesInOutLookDom();
        }

		//set mtGTextHelper global var in context of bg.html
		getMTGTextHelper();

        insertMightyLeftNavLinks();
            
/*
        } else {
            //this user does not match, but multiple account support is enabled
            if (multipleAccountSupport){
                insertMightyLeftNavLinks();
                listenForChangesInGmailDom();
            } else {
                //do nothing
            }
            //The user has disabled both Texts & Photos/Videos from being displayed in their gmail.
        }
*/        
        
    };
        
    function insertMightyLeftNavLinks(){
    
        var linkDestination = domManipulationContainerSelectors[currentLocation].left_nav();//referencing a common variable to 
        
//         console.info("Inserting mighty left nav links", linkDestination, "Common selector", domManipulationContainerSelectors[currentLocation].left_nav);
        
        var mightyWrappersRemoved = removeAnyExistingMightyWrappers();
        var mightyLinkWrapperHTML = '<div class="mightyLinkWrapper"></div>';
        var mightyLinkToDisplayClassicWAInIframe = '<div class="aim mightyAim mightyMenuItem" data-appview="classic"><div class="TO leftNavElement"><div class="TN"><div class="aio mightyClearfix"><span class="nU mightynU">Texts</span><img class="mightyLeftNavTextLogo" src="'+ mightyleftnavicon +'"/></div></div></div></div>';
        var mightyLinkToDisplayMediaWAInIframe = '<div class="aim mightyAim mightyMenuItem" data-appview="media"><div class="TO leftNavElement"><div class="TN"><div class="aio mightyClearfix"><span class="nU mightynU">Photos/Videos</span><img class="mightyLeftNavPhotoLogo"  src="'+ mightyleftnavicon +'"/></div></div></div></div>';    
        //NOTE: We are wrapping the link after "inbox" in a div, that we later prepend our MightyLinks to.  Can't wrap "inbox" and append the links there because I found that when an incoming mail causes gmail to ?re-apply? the selecte class in the leftnav, it removes my wrapper, and all the elements (the links) contained in it.  I did however test the method where I prepend it to the wrapper around the second link.  To test this, I starred mail from my mobiel app, and waited for the web interface to update.  For some reason this time the links stayed.  BUT, there is an issue if the user happens to go into settings and hide the link I append my wrapper to, the links will disappear until the page is reloaded again.
                                        
        if(mightyWrappersRemoved){
/*             console.log(linkDestination); */
            if(currentLocation == "Gmail"){
            
                webappIframeContainer = $(".ar4");
                
                $(linkDestination).wrap('<div class="mightyWrapper"></div>').each(function(){

                    //prepend mightyLinks to this wrapper
                    $(mightyLinkWrapperHTML).prependTo(".mightyWrapper").each(function(){  
                        $(this).append(mightyLinkToDisplayClassicWAInIframe + mightyLinkToDisplayMediaWAInIframe).each(function(){
                        });
                        
                        checkIfUserIsDisplayingLeftNavLinks();
                                    
                        setClickHandlerForMightyLeftNavLinks();
                       
                    });
                });
            } else if (currentLocation == "Outlook"){
                linkDestination = $("ul#folderListControlUl").children();
                webappIframeContainer = $('div#messageListScrollableContainer');
                
                var linkHTML = '';
                linkHTML += '<div class="mightyMenuItemWrapper">';
/*                 linkHTML += '<li class="lnav_item mightyMenuItem" data-appview="classic">'; */
                linkHTML += '<li class="lnav_item mightyMenuItem" data-appview="classic">';
                linkHTML += '<a class="lnav_itemLnk t_s_hov" href=#">';
                linkHTML += '<span class="Caption t_urtc t_qtc">';
                linkHTML += '<span class="FolderLabel t_urtc t_qtc">Texts</span>';
                linkHTML += '</span>';
                linkHTML += '</a>';
                linkHTML += '</li>';
                linkHTML += '<li class="lnav_item mightyMenuItem" data-appview="media">';
                linkHTML += '<a class="lnav_itemLnk t_s_hov" href=#">';
                linkHTML += '<span class="Caption t_urtc t_qtc">';
                linkHTML += '<span class="FolderLabel t_urtc t_qtc">Photos/Videos</span>';
                linkHTML += '</span>';
                linkHTML += '</a>';
                linkHTML += '</li>';
                linkHTML += '</div>';
                
/*                 console.log(linkDestination); */
                
                var existingLinksCheck = $(".mightyMenuItem");
                
                if(existingLinksCheck["length"] < 1){
/*                     alert("length check"); */
                    
/*                     console.log(linkHTML);     */

                    $(linkHTML).insertAfter(linkDestination[0]).each(function(){
                                                
                        $(".mightyMenuItem").unwrap();                                    
                        
                        setClickHandlerForMightyLeftNavLinks(webappIframeContainer);
                    
                    });
                    
                }
                                
            }            
        } else {
            //do nothing
        }                    
     
    };

    function removeAnyExistingMightyWrappers(){
        //search the dom for the mightywrapper, and then grab it's first child for the unwrap method in the next line.
        var existingMightyLinkWrapper = $(".mightyLinkWrapper");
                
        //$.unwrap is supposed to remove the parent element in the selector.  Leaving the element in the selector alone. After removing the wrapper, we also need to remove the element itself. 
        if(existingMightyLinkWrapper.length > 0){
            $(existingMightyLinkWrapper).unwrap().remove();
        } 
        
//        console.log(existingMightyLinkWrapper);
        
        return true;
    
    };

    function setClickHandlerForMightyLeftNavLinks(){
                    
        $(".mightyLeftNavLinkRemove").on("click", function(e){
            var linkToRemove = $(this).closest("div.mightyAim");
            var linkSetting = $(linkToRemove).data("appview");
            
            e.stopPropagation();
            
            console.log(linkSetting);            
            
            if(confirm("Press OK to remove this from the left side of Gmail.  You can re-enable it in GText settings.")){
                if(linkSetting == "classic"){
                    chrome.storage.local.set({
                        displayMTLinks_texts: "0"
                    }, function() {
                        // Notify that we saved.
                        console.log('Local settings saved');
                    });                
                    callGAInBackgroundPage("CRX-Gmail", "displayMTLinks_texts_user_updated", "disabled");
                } else if (linkSetting == "media"){
                    chrome.storage.local.set({
                        displayMTLinks_media: "0"
                    }, function() {
                        // Notify that we saved.
                        console.log('Local settings saved');
                    });
                    callGAInBackgroundPage("CRX-Gmail", "displayMTLinks_media_user_updated", "disabled");
                }
            } else {
                //do nothing.  User did not confirm that they wanted to remove the link from their gmail leftnav
            }            
                        
        });
        
        //MIGHTYMENU CLICK HANDLERS
        
/*         alert("setting click handler"); */
        
        $(".mightyMenuItem").on("click", function(e){
        
            $(".lnav_item").removeClass("ItemSelected").find(".t_sel").removeClass("t_sel");
        
            $(this).addClass("ItemSelected").find("a.lnav_itemLnk").addClass(".t_sel");
                                        
            var selectedMightyTextView = $(this).data("appview");
            var gaAction = "LeftNav-" + $(this).text() + "-Click";
            var gTextTitle;
            
            //track this in GA
            callGAInBackgroundPage("CRX-Gmail", gaAction, "Click");
                                            
            if(selectedMightyTextView == "classic"){
                gTextTitle = "Texts";
            } else if (selectedMightyTextView == "media"){
                gTextTitle = "Photos & Videos";
            }
            //change the title element of the page when they are viewing the iframe.                    
            $("title").text(gTextTitle);                
            
            addSelectedStateToLeftNav(this);
                                                
            //READJUST THE HEIGHT OF THE IFRAME CONTAINER
            dynamicallySetHeightOfMightyFrame();
            
            var additionalViewCheck = $(this).attr("add-view"),
                showProFeatureList = false;
            
            if((typeof additionalViewCheck != "undefined") && (additionalViewCheck == "promo")){
                showProFeatureList = true
            }

            $(".composeHeader").not(".minimized").find(".minMighty").trigger("click");
           
           //THE FUNCTION BELOW INSERTS THE IFRAME AND THEN LOOKS AT THE DATA-APPVIEW ATTR OF THE MIGHTYLINK JUST CLICKED AND WILL CHANGE THE PAGE TITLE, IFRAME SRC, AND WINDOW.LOCATION.HASH DEPENDING ON IT.  
           //THE WINDOW.LOCATION.HASH TRIGGERS SEVERAL CSS CHANGES. THIS INCLUDES: REMOVING THE CSS SELECTED STATE FROM GMAIL LEFTNAV LINKS (WHEN A MIGHTYLINK IS CLICKED), HIDING THE GMAIL FOOTER, AND HIDING/SHOWING THE DIVS THAT CONTAIN ALL OTHER GMAIL APP VIEWS (INBOX, SENT, FAVORITES, ETC.);               
            smartInsertMightyIframe(selectedMightyTextView, showProFeatureList);
            
            callGAInBackgroundPage("CRX-Gmail", "GText-Webapp-Iframe", "Link-Clicked");
                                    
        }).hover(function(){
            $(this).find("div.TO").addClass("NQ"); 
            $(this).find(".mightyLeftNavLinkRemove").show();
        }, function(){
            $(this).find("div.TO").removeClass("NQ"); 
            $(this).find(".mightyLeftNavLinkRemove").hide();
        });
               
        $(".mightyMenuItemWrapper").on("click", function(e){
/*             alert("link wrapper click"); */
        });        
                                                                         
        //KL check the leftnav UI of the user every minute to see if the Mighty LeftNav Links are visible.
        if(currentLocation == "Gmail"){
//             setInterval(areMightyLeftNavLinksVisible, 300000);            
            //LISTEN FOR THE ONHASHCHANGE EVENT TO DETERMINE WHEN A USER IS TRYING TO LOAD A NEW VIEW IN GMAIL.  BECAUSE GMAIL HAS AN "AJAXY" UI, THEN ANY GMAIL CHANGES THE USER TRIGGERS, WILL SUBSEQUENTLY CAUSE A CHANGE IN WINDOW.LOCATION.HASH
            listenForHashParamsInGmail();

        }
    
    };
    
    function smartInsertMightyIframe(webAppView, optionalProViewOverride){
            
        var mightyIframeHTML = '<div class="myMightyText active BltHke nH oy8Mbf" role="main"><div class="G-atb"><div class="nH aqK mightyClearfix"><div class="Cq aqL"><div class="mightyToolBar"><div><div class="G-Ni J-J5-Ji"><div class="T-I J-J5-Ji nu T-I-ax7 L3"  id="refreshIframe"><div class="asa"><div class="asf T-I-J3 J-J5-Ji"></div></div></div></div></div></div></div></div></div><div class="mightyIframeContainer"><iframe id="mightyIframe" src="" seamless></iframe></div></div>';
        var checkIframeExists = $("div.myMightyText");
        
//         console.log(checkIframeExists)

        if(checkIframeExists.length < 1){
/*             alert("no iframe"); */

            if(currentLocation == "Outlook"){
                $(webappIframeContainer).empty();
                
                $("div.PaginationContainer").hide();
            }
						
            //THEY'RE (STREAK) NOT USING CSS SELECTORS.  THEY COULD JUST BE USING $.SIBLINGS();
            $(mightyIframeHTML).prependTo(webappIframeContainer).each(function(){
                                
                console.log("insertedIframe");
                
                //READJUST THE HEIGHT OF THE IFRAME CONTAINER BASED OFF OF CURRENT WINDOW HEIGHT.
                dynamicallySetHeightOfMightyFrame();   
                setClickHandlerForIframeRefresh();
                //SET THE SRC OF THE IFRAME AND CHANGE THE HASH PARAM OF THE GMAIL PAGE
                setSrcOfMightyIframe(webAppView, optionalProViewOverride);
                     
            });
            
        } else {
            //THE IFRAME IS ALREADY THERE, JUST CHANGE THE HASH AND THE SRC.SET THE SRC OF THE IFRAME AND CHANGE THE HASH PARAM OF THE GMAIL PAGE
/*             alert("there is an iframe"); */
                setSrcOfMightyIframe(webAppView, optionalProViewOverride);
            //do nothing.
        }
    };
    
    function listenForHashParamsInGmail(){                    
        window.onhashchange = function(){                                    
            //IS THE USER DOING SOMETHING MIGHTYTEXT RELATED?
            if(window.location.hash == "#media" || window.location.hash == "#texts"){
                                                                    
                //ADJUST THE HEIGHT OF THE FOOTER THAT GMAIL PLACES AT THE BOTTOM OF THE PAGE.
                $("#\\:rq").find(".l2.ov").addClass("mightyFooter");
                //HIDE ALL OTHER GMAIL APP VIEWS. EX: INBOX, FAVORITES, SENT, ETC.
                var gmailFrames = $(webappIframeContainer).children().not(".myMightyText");
                               
                //$(gmailFrames).hide();
                $(gmailFrames).addClass("mightyHide");
                                                
                //REMOVE ANY ACTIVE CSS FROM OTHER LEFTNAV LINKS
                $(".aim").not(".mightyAim").removeClass("ain inboxsdk__navItem").find(".TO").removeClass("nZ").removeClass("aiq");
                
                //THE FUNCTION BELOW ACCOUNTS FOR SITUATIONS IN WHICH GMAIL APPENDS NEW DOM ELEMENTS THAT MAY EFFECT ANY OF THE HTML I APPEND. IT INVOLVES A HTML5 WEBKIT LIBRARY CALLED MUTATION SUMMARY.JS.  It has been commented out below and moved up into insertMightyIframe();  It is called at the same time as insertMightyLeftNavLinks.
/*                 listenForChangesInGmailDom(); */

            } else {
                
                //REMOVE ANY ACTIVE CSS FROM ANY MIGHTYMENUITEM LINKS IN THE LEFTNAV
                $(".mightyMenuItem").removeClass("ain inboxsdk__navItem").find(".TO").removeClass("nZ").removeClass("aiq");
                //SHOW THE GMAIL FOOTER AGAIN
                $("#\\:rq").find(".l2.ov").removeClass("mightyFooter");
                //HIDE MIGHTYIFRAMECONTAINER
                $("div.myMightyText").remove();
                //SHOW ALL OF THE .MYMIGHTYTEXT SIBLINGS.  HAD TO MAKE THIS A SEPARATE LINE BECAUSE WHEN THE USER SIGNS OUT, I REMOVE DIV.MYMIGHTYTEXT.  THEREFORE, THERE IS NO ELEMENT TO GRAB THE SIBLINGS OF TO SHOW.  INSTEAD, I SELECT THE PARENT AND GRAB ALL OF ITS CHILDREN EXCLUDING MYMIGHTYTEXT (ESSENTIALLY THE SAME AS $(MYMIGHTYTEXT).SIBLINGS();
                $(webappIframeContainer).children().not(".myMightyText").removeClass("mightyHide");
                
            }                    
        } 
    }
    
    function setClickHandlerForIframeRefresh(){
    
        $("#refreshIframe").on("click",function(){
            
            function getCurrentIFrameSrc() {
                
                var currentIframeSrc = $("#mightyIframe").attr("src");
                var value
                
                if (currentIframeSrc.indexOf("webappFrameWrapper") > -1){
                    value = currentIframeSrc;
                } else {
                    value = false;
                }
            
                return value;
            
            };
            
            var iFrameSrc = getCurrentIFrameSrc();
                            
            callGAInBackgroundPage("CRX-Gmail", "GText-Webapp-Iframe", "Reload-Btn-Clicked");
                            
            if(iFrameSrc){
            //set the src to blank,
            $("#mightyIframe").attr("src","");
            //delay a quarter of a second, and set the src back to the currentIframeSrc
                setTimeout(function(){$("#mightyIframe").attr("src", iFrameSrc);}, 250);
            }
                            
        }).tooltip({
            trigger: "hover",
            title: "Refresh MightyText",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }      
        });  
        
    };

    function checkIfThisIncomingNotifWillBeTooMany(numWindowsWidth){
                        
/*         var math = (currentWindowWidth - 220) - numWindowsWidth - (265); */
        var math = (currentWindowWidth - 220) - numWindowsWidth;
        //the first part of the equation subtracts the width of the left nav sidebar in facebook.
        
        //the second part of the equation subtracts the width of any existing chat windows
        
        //the third part of the equation subtracts the width of the window that is about to be appended, if there is room for it.
        
        console.log({
            "currentWindowWidth": currentWindowWidth,
            "existingWindowsWidth": numWindowsWidth,
            "solution": math
        });
                 
        return math;
        
    }
    
    function checkIfFBDockIsFull(fbNotifInserted){
    
//         var legacyFullFBDockIndicator = $("div.uiToggle").hasClass("hidden_elem");
//not in use as of 1.9.17 KL
        //updated logic for new dom change detected 1/5/16
	    var updatedNotFullFBDockIndicator = $("div#fbDockChatBuddylistNub").is(":visible");//KL added this check on 1.9.17 because The legacy full dock indicator above became obsolete around 12/15/16.  This new elem is the smaller version of the chat widget on the bottom right of the fb app when the viewport is < 1280px wide
	    //this new elem becomes visible after the viewport is < 1280px.  We DO NOT want to add our own DOM elems to the window if this is triggered KL 1.9.17
        
        var currentFBChatWindows = monitorFacebookChatWindows();
        var leftOverDockSpace = checkIfThisIncomingNotifWillBeTooMany(currentFBChatWindows, fbNotifInserted);
        var minSpaceNeeded = 350;
        var value = false;// default to dock being full
        
        if(fbNotifInserted){
            minSpaceNeeded = 0;
        }
        
        if(leftOverDockSpace < minSpaceNeeded){
            value = true;
        } 
        
        return value;
    }
    
    function listenForChangesInGmailDom(){
    //THE CODE IN THIS FUNCTION LISTENS FOR ELEMENTS THAT FIT THE QUERIES DEFINED IN THE SUMMARYOBSERVER VARIABLES.  THE DIV ELEMENTS I'M LOOKING FOR SHOULD BE EXPLAINED BY THE NAME OF THE CALLBACK FUNCTIONS THEY ARE CALLING.  DIV.AIN IS THE ELEMENT THAT HAS GMAIL'S SELECTED CSS APPLIED TO IT.  SPAN.ATA-ASJ IS THE 
        
        var summaryObserver = new MutationSummary({
            callback: hideGmailLeftNavSelectedCSS,
            queries: [{ element: 'div.ain' }]
        }); 
        
        var summaryObserver2 = new MutationSummary({
            callback: removeReplyToCurrentGmailThreadComesInWhenViewingIFrame,
            queries: [{ element: 'span.ata-asJ' }]
        });
        
        var summaryObserver3 = new MutationSummary({
            callback: ensureMightyWrapperStaysBelowInbox,
            queries: [{ element: 'div.aim' }]
        });
        
        //trying to determine when facebook begins to hide their chat windows
                
        function hideGmailLeftNavSelectedCSS (summary) {
/*                 console.log(summary); */
            if(summary.length > 0){
                $(summary).each(function(){
                    if(this.added.length > 0){
/*
                        console.log("a div with the class ain was added to the dom. Here it is:");
                        console.log(this.added);
*/
                        $(this.added).each(function(){
                            var myLinkCheck = $(this).hasClass("mightyAim");
                            if( !myLinkCheck ){
                                var testing = window.location.hash;
                                if((testing == "#media") || (testing == "#texts")){
                                    console.log("remove this div:");
                                    console.log(this);
                                    $(this).removeClass("ain inboxsdk__navItem").find(".TO").removeClass("nZ").removeClass("aiq");                                       
                                }
                            } else {
                                //user is switching between mightytext views.
                            }
                        });
                    } else {
                        //do nothing for now
                    }
                });
            }
        };
        
        function removeReplyToCurrentGmailThreadComesInWhenViewingIFrame(summary){

            $(summary[0].added).each(function(){
                
                var threadNotifContainer = $(this).parent();
                var checkCurrentGmailHashParam = window.location.hash
                
                if((checkCurrentGmailHashParam.indexOf("#media") > -1 )||(checkCurrentGmailHashParam.indexOf("#texts") > -1)){
                    $(this).parent().hide();
                } else {
                    //do nothing
                }

            });
        };
            
        function ensureMightyWrapperStaysBelowInbox(summary){
        
            var linksShown = summary[0].added;
            var linksHidden = summary[0].removed;
            
            if(linksShown.length > 0|| linksHidden.length > 0){
	            
                //this statement is supposed to catch anytime a user edits their gmail leftnav settings from gmail settings under the "labels" tab.
                var topGroupOfGmailLeftNavLinks = domManipulationContainerSelectors[currentLocation].left_nav();
                
                console.info("ensure mighty wrapper is below the inbox", topGroupOfGmailLeftNavLinks);
                
                var checkIfMightyWrapperIsSecondElement = $(topGroupOfGmailLeftNavLinks).hasClass("mightyWrapper");
                
                if (!checkIfMightyWrapperIsSecondElement) {                    
                    console.error("error: Links are not positioned correctly below Inbox!");
                    insertMightyLeftNavLinks();
                } else {
                    //mightyWrapper is still below "Inbox". no worries.
                }                
                                                
            } else {
                //nothing was added or removed from the leftnav.
            }
            
        };
                
    };
    
    function listenForChangesInOutLookDom(){
    
        var summaryObserver = new MutationSummary({
            callback: reAppendMightyMenuItems,
            queries: [{ element: '.ItemSelected' }]
        }); 
        
/*
        function reAppendMightyMenuItems(summary){
            console.log(summary);
            $(summary).each(function(){
//                alert("stop");
                if(this["added"].length > 0){
                    console.log(this["added"]);
                    alert("state removed");
//                    insertMightyLeftNavLinks();
                }
            });
        }
*/
        
        function reAppendMightyMenuItems(summary){
        
            var linksShown = summary[0].added;
            var linksHidden = summary[0].removed;
            
            if(linksShown.length > 0 || linksHidden.length > 0){
                //this statement is supposed to catch anytime a user edits their gmail leftnav settings from gmail settings under the "labels" tab.
                var topGroupOfGmailLeftNavLinks = $("ul#folderListControlUl").children();
                var checkIfMightyWrapperIsSecondElement = $(topGroupOfGmailLeftNavLinks[1]).hasClass("mightyWrapper");
                
                if (!checkIfMightyWrapperIsSecondElement) {

                    insertMightyLeftNavLinks();
                    
                } else {
                    //mightyWrapper is still below "Inbox". no worries.
                }                
                                                
            } else {
                //nothing was added or removed from the leftnav.
            }
            
        };

    
    }

        
    function areMightyLeftNavLinksVisible(){
        var gmailLeftNav = $("div.aeO").offset();
        var compared = $('[data-appview="classic"]').offset();
        
        if(gmailLeftNav.length < 1){
            //KL check to see if the div in Gmail that we are comparing our LeftNav links to, exists. If not, we look for it again in 10 seconds.
            console.log("couldn't find it. trying again in 10 seconds");
            setTimeout(areMightyLeftNavLinksVisible, 10000);
            if(getRandomInt (0, 100) === 20){
                callGAInBackgroundPage("CRX-Gmail", "LeftNav-MT-Links-NEW-1pct-Sample", "Error");
            }

        } else {
//                console.log("gmail div offset is: " + testing["top"]);
//                console.log("my link's offset is: " + compared["top"]);
            if(gmailLeftNav["top"] < compared["top"]){
                console.log("!!!! MIGHTYLINKS ARE HIDDEN !!!!");
                if(getRandomInt (0, 100) === 20){
                    callGAInBackgroundPage("CRX-Gmail", "LeftNav-MT-Links-NEW-1pct-Sample", "Hidden");
                }
                //Put GA call here later to alert us of when the links are hidden.
            } else {
                if(getRandomInt (0, 100) === 20){
                    callGAInBackgroundPage("CRX-Gmail", "LeftNav-MT-Links-NEW-1pct-Sample", "Shown");
                }
                //mightyleftnav links are visible, do nothing.
            } 
        }
    };
    
    
    function monitorFacebookChatWindows(summary){
        
        var chatWindowWidth = 0;
        
/*         console.log(summary); */

        if(typeof summary != "undefined"){//if a "summary" is being passed in as an argument, then this function is being triggered from the mutation summary

            $(summary).each(function(i,v){
                var change = this;
                
                if(this["added"]["length"] > 0){
/*                     alert("opened chat window"); */
                    var ourNotif = $(this["added"]).hasClass("mightyFB");
                    
                    if(!ourNotif){

                        var check = checkIfFBDockIsFull(true);
                        
                        if(check != false){
                            
                            var gtextNotifs = $(".mightyFB");
                            
                            if(gtextNotifs.length > 0){
                                $(gtextNotifs).remove();
                                initializeInfoModal({message: "<strong>MightyText in Facebook:</strong> You had too many MightyText windows open so we closed them to make room for this new Facebook Messenger window.", id:"closed_mighty_windows"});
                            }
                            
                        }
                        
                    }
                    
                }                
            })        
            
        } else {//counting the current number of FB Chat Windows in the DOM, to determine the amount of space left for us to inject our own UI

// 			var currentWindows = $("#ChatTabsPagelet .uiToggle").siblings(".fbNubGroup").children();
//commented on 1.9.17 by KL because 
            var currentFBChatWindows = $("#ChatTabsPagelet .fbNub");
            
            $(currentFBChatWindows).each(function(){
	                            
                var isThisTabOpened = $(this).hasClass("opened");
                var isThisAPlaceHolderForMightyTextNotifs = $(this).hasClass("convoWindowPlaceHolder")
                
                if(isThisTabOpened != false){
                    chatWindowWidth = chatWindowWidth + 269;
                } else if(isThisAPlaceHolderForMightyTextNotifs){
                    chatWindowWidth = chatWindowWidth;
                } else {
                    chatWindowWidth = chatWindowWidth + 172;
                }
                
            });
                            
        }
            
/*
        console.log({
            "chatWindowWidth":chatWindowWidth,
            "window": $(window).width()
        });
*/
        
        currentWindowWidth = $(window).width();//updating global viewport width variable;
                        
        return chatWindowWidth;            
        
    }
    
    function changeZIndexOfModalBackdrop(summary){
        $(summary).each(function(e){
            if(this["added"].length > 0){
/*                 console.log(this); */
                $(this["added"]).addClass("fb");
            } 
        });
    }
    
    function listenForChangesInFBDom(){
/*
        var summaryObserver = new MutationSummary({
            callback: changeZIndexOfModalBackdrop,
            queries: [{ element: 'div.modal-backdrop' }]
        }); 
*/
        var summaryObserver2 = new MutationSummary({
            callback: monitorFacebookChatWindows,
            queries: [{ element: 'div.fbNub._50-v'}]
        })
    }

    function setSrcOfMightyIframe(selectedMightyTextView, optionalPromoOverride){
    
        var urlToIframeHTMLWrapperFile = chrome.extension.getURL("webappFrameWrapper.html");
    
        if(currentLocation == "Gmail"){
            //find the selected leftnav class "ain" get the borderleft and font weight css properties.
            var gmailLeftNavSelectedStateCSS = $("div.ain").css(["borderLeft","fontWeight"]);
                gmailLeftNavSelectedStateCSS["color"] = $("div.ain span.nU").css("color");
            //tr.yO are the elements associated with the emails in inbox container.  Get the background css value.
            var gmailInboxBackground = $("tr.yO").css("backgroundColor");
            
        }
        

        if (selectedMightyTextView === "media"){

            window.location.hash = "media";

        } else if (selectedMightyTextView === "classic"){

            window.location.hash = "texts";

        } else {

            console.error("error establishing which appview to display");

        }

        urlToIframeHTMLWrapperFile += "#" + selectedMightyTextView;
        
        if((typeof optionalPromoOverride != "undefined") && (optionalPromoOverride != false)){
            urlToIframeHTMLWrapperFile += "&promo=true";
        }

        $("#mightyIframe").attr("src", urlToIframeHTMLWrapperFile);
        
/*
        $("#mightyIframe").on("load", function(){
            
            console.log(selectedMightyTextView);
            
            chrome.runtime.sendMessage({
                openThisWebViewInIframe: selectedMightyTextView
            }, function(response) {
                console.log(response["confirmation"]);
            });
            
        });
*/
                        
    };
    
    function addSelectedStateToLeftNav(target){
        //REMOVE ANY SELECTED STATE FROM PREVIOUSLY SELECTED MIGHTYMENU ITEMS
        $(".mightyMenuItem").removeClass("ain inboxsdk__navItem").find(".TO").removeClass("nZ").removeClass("aiq");
        //ADD THE SELECTED STATE FOR THIS GMAIL THEME TO OUR MIGHTYMENUITEM LINKS
        $(target).addClass("ain inboxsdk__navItem").find(".TO").addClass("nZ").addClass("aiq");                    
    };
    
    function checkIfUserHasRunThroughTour(){
        chrome.storage.local.get(null, function(data) {
            var settingToCheck
            if(currentLocation == "Gmail"){
                settingToCheck = "first_time_gmail";
            } else if (currentLocation == "Facebook"){
                settingToCheck = "first_time_facebook";
            }
        
            if (!data[settingToCheck]) {
                    console.log("first time user launched CRX Content Script in " + currentLocation + ". Run them through the product tour.");
                    initializeGTextOnboarding();

            } else {
                    console.log("productTourGiven already given.");
                    //console.log(data);
            }
        });
    };
        
    function insertBatStatBar(){
        var googleNavBar = $(document).find("#gbzw");
        var batStatExistCheck = $("div.newbatterywrap");
        
        if(googleNavBar.length < 1){//USER IS IN NEW GMAIL UI WITHOUT TOP NAV BAR
            newGmailUICheck = true;
            var googleNavBarNew = $(document).find("#gb").children().first().children().first();
                        
            if(batStatExistCheck.length < 1){
                $('<div id="batstatInitial" class="newbatterywrap newBatStatLocation mightyClearfix"></div>').appendTo(googleNavBarNew).each(function() {
	                console.log(new Date() + "inserted batstat into new Google UI");
                    startGetPhoneStatusCycle();
                });            
            } else {
                //batstat placeholder has already been inserted, don't do anything.
            }
            
        } else {//USER IS IN OLD UI
        
            if(batStatExistCheck.length < 1){
                $('<div id="batstatInitial" class="newbatterywrap"></div>').insertAfter(googleNavBar).each(function() {
                    startGetPhoneStatusCycle();
                });            
            } else {
                //batstat placeholder has already been inserted, don't do anything.
            }
        
        }
        
    };

    
    function dynamicallySetHeightOfMightyFrame(){
        var targetHeight = (window.innerHeight * .8)
        var targetHeight2 = window.innerHeight - ($("div.nH.oy8Mbf.qp").height() + $("div.aeH").height() + 15);

//        console.log("smartHeight:" + targetHeight2);
//        console.log("set the height to: " + targetHeight); 
        
        $(".mightyIframeContainer").css({
            "height": targetHeight
        }); 
    };
    

    function handleMutations(summary){
        if(summary.length > 0){
            console.log(summary);                    
            
            $("div.dw").hide();
            
            setTimeout(function(){
                // Gmail UI click is generated by MouseUp and MouseDown events
                var evt1 = document.createEvent("MouseEvents");
                var evt2 = document.createEvent("MouseEvents");
                evt1.initMouseEvent("mousedown", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, null);
                evt2.initMouseEvent("mouseup", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, null);
                
                // Here jQuery('.T-I.J-J5-Ji.nu.T-I-ax7.L3') is the gmail refresh button
                $('td.Hm img.Ha').each(function(d,element){
                    element.dispatchEvent(evt1);
                    element.dispatchEvent(evt2);
                });
                $("div.dw").show();  
                console.log(new Date() + " Successfully triggered and closed Composer in order to append the container for notifications.");                                 
            }, 100);
            
        }
    };

    function checkIfGChatIsEnabled(){

        document.location.hash = "#inbox?compose=new";
        
        var summaryObserver = new MutationSummary({
           callback: handleMutations,
           queries: [{ element: "div.dw" }] 
        });
        
    }
    
    function setupSettings(options){
        var signoutConfirmationText
        var settingsPaneCheck = $("div#settingsPane");
        
        var settingsPaneHTML = '';
    
        settingsPaneHTML += '<div id="settingsPane" class="mightyDropdown">'
        settingsPaneHTML += '<div id="mightyLogoHeader" class="mightyClearfix"><img src="' + logoImgURL + '" alt="mightyText Logo"/><span></span></div>';
        
        settingsPaneHTML += '<div id="userAccountDisplay" class="mightyClearfix">' + mightyTextAccount + '</div>';
        settingsPaneHTML += '<ul>';
        
        if(currentLocation == "Facebook"){//only add share link into html if this is fb.
            settingsPaneHTML += '<li class="settingsLink fb" id="fbSocShare">Share</li>';
        }
        
        settingsPaneHTML += '<li class="settingsLink" id="settingsTrigger">Settings</li>';
        settingsPaneHTML += '<a target="_blank" href="http://help.mightytext.net/knowledgebase"><li class="settingsLink J-N" id="helpTrigger">Help</li></a>';
        settingsPaneHTML += '<li class="settingsLink" id="startTour">Take a Tour</li>';
        settingsPaneHTML += '<a target="_blank" href="https://chrome.google.com/webstore/detail/gtext-from-mightytext-sms/iffdacemhfpnchinokehhnppllonacfj/reviews"><li class="settingsLink" id="cwsTrigger">Rate Us</li></a>';
                settingsPaneHTML += '<a target="_blank" href="https://mightytext.net/web"><li class="settingsLink" id="cwsTrigger">Launch App</li></a>';
        settingsPaneHTML += '<li class="settingsLink" id="signOutTrigger">Sign Out</li>'
        settingsPaneHTML += '</ul>'
        settingsPaneHTML += '</div>';

        
        //append the HTML here.        
        $('body').append('<div id="optionsModal" class="modal hide fadeMighty mightyModal" ><span class="mightyClose close" data-dismiss="modal">x</span><iframe id="optionsIframe" src=""></iframe></div>');

        
        if(currentLocation == "Gmail"){
        
            settingsPaneDestination = $("div.settingsButtonContainer");

            signoutConfirmationText = 'Are you sure you want to sign out of MightyText?\r\n(You will stay signed in to Gmail)';
            
        } else if (currentLocation == "Facebook") {
            
            signoutConfirmationText = 'Are you sure you want to sign out of MightyText?\r\n(You will stay signed in to Facebook)';
            
			settingsPaneDestination = $(options.fb_settings_menu_destination);
            
            //append the settings pane.
                                    
        }
        if(settingsPaneCheck.length < 1){

            $(settingsPaneHTML).appendTo(settingsPaneDestination).each(function(){
                addAdaptionClasses(this, "settings")
                //console.log("successfully appended mightyflyout");
                
                setSettingsPaneClickHandler(signoutConfirmationText);
    
            });        
            
        }           
    };
    
    function setSettingsPaneClickHandler(signoutConfirmationText){
        
        var additionalOptionsModalClass = '';
        
        if(currentLocation == "Gmail"){
             
            $('body').not("#settingsButton").not(".shareButtonContainer").on("click", function(){
                $("#settingsPane").hide();
                $("#socialPane").hide();
    
            });
            
            
            $(".settingsButtonContainer").on("click",function(e){
                e.stopPropagation();  
                $("div#settingsPane").toggle();
                $("#socialPane").hide();
                callGAInBackgroundPage("CRX-Gmail", "LeftNav-Dropdown-Click-Toggle", "Click");  
            });
            
        } else if (currentLocation == "Facebook"){
        
            additionalOptionsModalClass = "fb";
                    
            var existingFBDropdowns = $("#pageHead .navItem div.uiToggle");
        
            //toggle fb Mighty Settings Pane.
            $("#composeLogo").on("click", function(e){
                e.stopPropagation();
    /*             console.log(e.target); */
                $("div#settingsPane.fb").toggle();
                $(existingFBDropdowns).removeClass("openToggler");
            });
            //loop through each of fb's buttons to see if there an another dropdown open.

           //hide fb settings when user clicks outside of the dropdown      
            $("*").not('#composeLogo').on("click", function(e){
/*                 console.log("ayo"); */
                $("div#settingsPane").hide();
            });

        }
        
        $("#settingsTrigger").on("click", function(){
            $("#optionsIframe").attr("src", optionsPageURL);
            $('#optionsModal').addClass(additionalOptionsModalClass).modal({
                keyboard: true
            });
        });
        
        $("#helpTrigger").on("click", function(){
            callGAInBackgroundPage("CRX-Gmail", "LeftNav-Help-Click", "Click");
        });

        $("#cwsTrigger").on("click", function(){
           callGAInBackgroundPage("CRX-Gmail", "LeftNav-RateApp-Click", "Click"); 
        });
        
        $("#signOutTrigger").on("click", function(){
            callGAInBackgroundPage("CRX-Gmail", "LeftNav-Signout-Click", "Click"); 
            
            triggerCustomConfirm(signoutConfirmationText, function(){signOutOfMightyText();})
            
        });

        
        $("#startTour").on("click", function(){
            startIntroJSTour();
            callGAInBackgroundPage("CRX-Gmail", "LeftNav-Start-Tour-Click", "Click"); 
        });


    }
    
    function setupSharing(){
        var sharePageURL = chrome.extension.getURL('mt-share.html');
        var settingsButtonSelector
        
        if(currentLocation == "Gmail"){
            settingsButtonSelector = $('div.shareButtonContainer');
        } else if (currentLocation == "Facebook"){
            settingsButtonSelector = $('li#fbSocShare');
        }
        
        console.log(settingsButtonSelector);
        
        $('body').append('<div id="shareModal" class="modal hide fadeMighty mightyModal" ><div class="modal-header">Tell People about MightyText<span class="mightyClose close" data-dismiss="modal">x</span></div><div class="modal-body"><iframe id="shareIframe" src=""></iframe></div></div>');

        $(settingsButtonSelector).on("click", function(e){
            e.stopPropagation();

           $("#shareIframe").attr("src", sharePageURL);
           $('#shareModal').modal({
               keyboard: true
            });
            callGAInBackgroundPage("CRX-Gmail", "LeftNav-Settings-Click", "Click"); 

            callGAInBackgroundPage("CRX-Gmail", "LeftNav-PromoteMT-Click-Toggle", "Click"); 
            $("#settingsPane").hide();
/*             $("div#shareModal").toggle(); */
        });        

    };
    
    function signOutOfMightyText() {
//ajax call to the signout servlet    
        $.ajax({
            type: "GET",
            url: baseUrl + '/logout?function=clear',
            dataType: "json",
            timeout: 5000,
            tryCount: 0,
            retryLimit: 1,
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                console.log(response);
                if(response.user == "user logged out"){
                    //we know that the user is logged out.
                    console.log("user successfully logged out");

                    //If we know that the user successfully signed out, we should send a message to the background page to clear global intervals since the user is not signed in anymore. 10/14/14 KL
                    //the bg script will send a message to all content scripts, and then reload itself.  When the content script gets this message, it will remove all UI in the user's subclient tab, and display a bootstrap notif instructing them to reload that tab
                    notifyBGOfSignOut();

                } else {
                    console.error("Error: server returned unrecognized string in when calling /logout servlet.");
                }
            },
            error: function(response) {
                //if there was an error logging out, we should display a notif to the user, telling them to try again
                var errorNotifBody = "An error occurred while trying to sign out of MightyText.<br><br>Please check your internet connection and try again.",
                    notifTsDismiss = 10000;
                if(currentLocation == "Gmail"){
                    displayBootstrapAlertNotif({message: errorNotifBody, ts_dismiss: notifTsDismiss, type: "error"});
                } else if (currentLocation == "Facebook"){
                    initializeInfoModal({message: errorNotifBody, ts_dismiss_override: notifTsDismiss, id: "user-unable-to-sign-out"});
                }

                console.error("User was unable to sign out.  Request to sign out failed at: " + new Date());
                console.error(response);
            }
        });
    };


    function startGetPhoneStatusCycle() {
        if (capiHubInitializeCheck) {
            console.log("We know the CAPI is opened already, requesting Phone Status Cycle");
            setTimeout(getPhoneStatus, 1000);
            //no longer setting an interval in the content script, we set it in the background.js after we determine that the user is logged in and that there are tabs open currently running the content script.
            setInterval(checkForStaleBatteryStatus, 5000);
        } else {
            console.log("CAPI not opened yet, requesting phone status in 1 second.")
            setTimeout(startGetPhoneStatusCycle, 1000);
        }
    };
    
    function checkForStaleBatteryStatus(){
        var existingBatStat = $(".gTextBattery");
        if(existingBatStat.length > 0){
            var timeStampOfLastStat = $(".newbatterywrap").attr("id");
            var currentUnixTimeStamp = new Date().getTime();
            var timeSinceLastUpdate = currentUnixTimeStamp - parseInt(timeStampOfLastStat);
/*
            console.log("this is the difference between now and the last time the bat stat was updated.");
            console.log(currentUnixTimeStamp - parseInt(timeStampOfLastStat));
*/
/*             if(timeSinceLastUpdate > 10000){ */
            if(timeSinceLastUpdate > 600000){
                console.log("remove bat stat");
                $(".newbatterywrap").empty().tooltip('destroy').hide();
            }
        } else {
            console.log("there is no battery status to check");
        }
    };

    function resetWindowParent(targetDiv) {
        //toggle Display:None on overall Container.
        var targetParent = $(targetDiv).parent();
        $(targetParent).toggleClass("visible");
        setTimeout(function() {
            $(targetParent).toggleClass("visible");
        }, 250);
    };
    
    function addBasicComposerFunctionality(composer, context, optionalGroupMMSCheck) {
        var closeCompose = $(composer).find(".closeCompose");
        var composerHeader = $(composer).find("div.composeHeader");
        var composerHeaderDisplayName = $(composer).find("span.title");
        var sendButton = $(composer).find(".sendSMS");
        var composeBody = $(composer).find(".composeBody");
        var messageField = $(composer).find(".messageToSend");
        var contactsContainer = $(composer).find(".sendTo");
        var contactsInput = $(composer).find(".numberToSendTo");
        var contactsToSendSMSTo = $(composer).find(".sendContacts")
        var mightyShortCut = $(composer).find(".openMighty");
        var mightyMin = $(composer).find(".minMighty");
        var characterCountHolder = $(composer).find("span.count");
        var mmsButton = $(composer).find("#upload-image-mms");
        var phoneNumCleanContainer = $(composer).find(".composeInnerContainer");
        var emojiSelectorButton = $(composer).find(".emojiButtonHolder");
        var responseArea = $(composer).find(".responseArea");
        var fbShareButton = $(composer).find(".fbShareMighty");//ONLY VISIBLE IN FTEXT

        $(closeCompose).on('click', function(e) {
            e.stopPropagation();
            var closeBtn = this;
            callGAInBackgroundPage("CRX-Gmail", "ChatWindow-Close", "Click");
            verifyThatUserWantsToCloseComposeNew({
                compose_window: composer, 
                contacts: contactsToSendSMSTo, 
                message: messageField, 
                close_context: context, 
                button_clicked: closeBtn
            });
        });

        $(composerHeader).on('click', function(e) {
            $(this).toggleClass("minimized");
            $(composeBody).toggle();
            if ($(this).hasClass("minimized")) {
                $(mightyMin).children("img").attr("src", maxImgURL);
                callGAInBackgroundPage("CRX-Gmail", "ChatWindow-Minimize", "Click");
            } else {
                $(mightyMin).children("img").attr("src", minImgURL);
                callGAInBackgroundPage("CRX-Gmail", "ChatWindow-Maximize", "Click");
                setEndOfContenteditable(messageField);
            }
        });
        
        $(sendButton).on('click', function(e) {
//             console.log(messageField);
            callGAInBackgroundPage("CRX-Gmail", "Compose-New-SMS-Button-Click", "Click");
            sendSMS(composer, context, sendButton, messageField, optionalGroupMMSCheck);
        });
        
        //Enter to send function
        if (
	        (enterToSend)||
	        (currentLocation == "Facebook")
        ){
            console.log('send on enter enabled');
            $(messageField).on('keydown', function(e) {
			   if( (e.keyCode == 13) && (!(e.shiftKey)) ){ //unless Shift key is pressed!
                    e.stopPropagation();
                    e.preventDefault();
                    sendSMS(composer, context, sendButton, messageField, optionalGroupMMSCheck);
                }
            });
        }	        

        $(messageField).on('input', function(e) {
    		var draftIcon = $(this).parent().siblings('.save-draft-button-holder').children('.save-draft-icon');
			toggleDraftSaveState(draftIcon, true);
        });
        
        $(messageField).on("focus", function() {
            var currentContactsToSendToVal = $(contactsInput).val();
            if (currentContactsToSendToVal != '') { 
                processContactForComposeSingleText(currentContactsToSendToVal, currentContactsToSendToVal, contactsInput, contactsToSendSMSTo, true);
            }
        });

        $(mightyShortCut).on("click", function(e) {
//the stopPropagation makes it so that the click event on this button does not also trigger the minimize functionality of the conversation window header.
            e.stopPropagation();
            var expandBtn = this;
                
            verifyThatUserWantsToCloseComposeNew({
                compose_window: composer, 
                contacts: contactsToSendSMSTo, 
                message: messageField, 
                close_context: context, 
                button_clicked: expandBtn,
                message_id: $(composer).find(".textWrapper").last().attr("id").replace('message-id-','')
            });
            
            callGAInBackgroundPage("CRX-Gmail", "ChatWindow-Expand", "Click");
                                
        });

        $(contactsContainer).keydown(function(e) {
            if (e.keyCode == 8) {
                if (!$(contactsInput).val()) {
                    $(contactsToSendSMSTo).children('.contact').last().remove();
                        checkNumberOfCurrentContactsToSeeIfGroupMMSOptionDisplays(contactsToSendSMSTo);
                }
            } 
        });
        
        $(contactsInput).keydown(function(e){
            var currentContactsToSendToVal = $(contactsInput).val();
            if (currentContactsToSendToVal != '') { 
                if (e.keyCode == 188 || e.keyCode == 13 || e.keyCode == 9){
            		e.preventDefault();
    	        	var findIfActiveMatchedTypeahead = $('ul.typeahead:visible').children('li.active').attr('data-value');
    	        	if(findIfActiveMatchedTypeahead === undefined)
    	        		{
                            var currentInputVal = $(contactsInput).val();
    		        		if(!currentInputVal){
    			        		return
    			        	}    
                            processContactForComposeSingleText(currentInputVal, currentInputVal, contactsInput, contactsToSendSMSTo);
    			        	$(contactsInput).val('');
    	        		}
    	        	else
    	        		{
    		        		$('ul.typeahead:visible').children('li.active').click();
    	        		}
                    $(contactsInput).val('').focus();
                }
            }
        }).focus();
        
        $(emojiSelectorButton).on("click", function(){

            var checkEmojiContainerExists = $(responseArea).find(".emojiContainer");
        
            if(checkEmojiContainerExists.length < 1){
                createEmojiSelectorModal(composer);                
            }

            smartToggleEmojiComposer(responseArea, composer, context);        

        });
        
        if(optionalGroupMMSCheck){
            addTooltipToComposeHeader(composerHeaderDisplayName);
        }
        
        $(fbShareButton).on("click", function(e){
            e.stopPropagation();
                window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fgtext-from-mightytext-sms%2Fiffdacemhfpnchinokehhnppllonacfj%3Futm_source%3Dchrome-ntp-icon','mywindow','location=1,status=1,scrollbars=0,left=180,top=100,width=620,height=300');
                callGAInBackgroundPage("CRX-Facebook", "Click-Share-Network-Button", "Facebook");            
        });
        
        var tooltipOptions = {
            trigger: "hover",
            title: "Share MightyText",
            placement: "top",
            delay: {
                show: 150,
                hide: 100
            }
        };

        $(fbShareButton).tooltip(tooltipOptions);

        
        addMMSButtonFunctionality(mmsButton);
        initializeNobleCount(messageField, characterCountHolder);
        
        $(".numberToSendTo").autosizeInput();
    };
    
    function smartToggleEmojiComposer(responseArea, composer, context){
        
        $(responseArea).toggleClass("emojiContainerOpen");
        
        var contentEditableDiv = $(responseArea).find(".messageToSend");
            
        if(context == "Conversation"){
            var conversationHolder = $(composer).find(".conversationHolder");
            $(conversationHolder).toggle();
        }
        
        //$(responseArea).find(".messageToSend").focus();
        
        setEndOfContenteditable(contentEditableDiv);
    }
    
    function checkNumberOfCurrentContactsToSeeIfGroupMMSOptionDisplays(contactsHolder){
                
        var currentLengthOfContacts = $(contactsHolder).children('.contact').length;
/*         var groupMMSFlag = $(contactsHolder).parent().siblings(".responseArea").find(".groupMMSContainer"); */
        var groupMMSFlag = $(contactsHolder).parent().find(".groupMMSContainer");

        if(currentLengthOfContacts > 1){            
            $(groupMMSFlag).show();
        } else {
            $(groupMMSFlag).hide();
        }
        
    };

    function addAdaptionClasses(commonHTML, context){
    
        var elemsToAppendClassesTo
        var classToAppend

        if(currentLocation == "Gmail"){
            if(context == "settings"){
                
                $(".settingsLink").addClass("J-N");
                $("#mightyLogoHeader").children("span").text("MightyText");

                
            }
        } else if(currentLocation == "Facebook"){
            
            if(context == "notif"){
                elemsToAppendClassesTo = '.holder-mms-image-preview, .mightynH, .composeHeader, .mightyLogo, .title , .mightbtnholder, .composeBody , .sendTo, .sendContacts, .numberToSendTo, .messageContainer, .messageToSend, .mightdcfoot, .sendSMS, .sendMMS, .emojiButtonHolder, .countContainer, .groupMMSContainer, .schedulerContainer, .fbShareMighty, .mighthbtn';
                
            } else if(context == "tour"){
                elemsToAppendClassesTo = '#tourNotif';
                $("#tourDescrip").html("Welcome to MightyText in Facebook. <br></br> Do you want to take a quick 20 second tour?");
            } else if (context == "settings"){
            
                elemsToAppendClassesTo = '#mightyLogoHeader, #userAccountDisplay, ul, .settingsLink';
                
                //console.log(this);
                
                $(commonHTML).addClass("fb");
                $("#mightyLogoHeader").children("span").text("MightyText");
                
            }
            
            classToAppend = 'fb';
        } else if (currentLocation  == "Outlook"){
            elemsToAppendClassesTo = '.schedulerButton, #setDateAndTimeButton';
            
            classToAppend = 'outlook';
        }
          
        console.log(elemsToAppendClassesTo);     
        
        $(commonHTML).find(elemsToAppendClassesTo).addClass(classToAppend);
    }

    function addMMSButtonFunctionality(mmsButton) {
       $(mmsButton).on("click", function(e) {

//            console.log("clicked sendMMS");
            var mmsDialogueExists = $("#mms-upload-dialog").length
            
            console.log(mmsDialogueExists);
            
            if(mmsDialogueExists < 1){
                $("body").append('<div id="mms-upload-dialog" class="mms-feature modal fadeMighty" tabindex="-1" role="dialog" style="display:none;"></div>');                
            }

            getImageUploadCode(this.parentNode);
        });
    };

    function getPhoneStatus() {
        chrome.runtime.sendMessage({
            //!request phone status
            requestPhoneStatus: true
        }, function(response) {
            console.log(response["confirmation"]);
        });
    }
    
    function handleC2DM_GCM_Errors(which_c2dm_gcm_action,reply_server,optionalMessagesDiv){
        
        var errorMessage='';
        
        if (reply_server.indexOf('LOGIN_REQUIRED') > -1){
            callGAInBackgroundPage("CRX-Gmail", "C2DM-Error", "LOGIN_REQUIRED");
            errorMessage='Error: Not logged in to MightyText. (Gtext Content Script)';
        } else if (reply_server.indexOf('DEVICE_NOT_REGISTERED') > -1){
            callGAInBackgroundPage("CRX-Gmail", "C2DM-Error", "DEVICE_NOT_REG");
            errorMessage='Error: Android Phone not registered with MightyText with this Google Account, or MightyText Android App not installed properly on your phone.';
        } else if (reply_server.indexOf('DeviceQuotaExceeded') > -1){
            callGAInBackgroundPage("CRX-Gmail", "C2DM-Error", "DEVICE_QUOTA_EXCEEDED");
            errorMessage='Android Phone Quota Exceeded.  Error Code: DeviceQuotaExceeded (C2DM)';
        
        } else {
            errorMessage='C2DM/GCM Error.  Please retry. \r\n\r\n Error Info: \r\n\r\n' + reply_server;
            callGAInBackgroundPage("CRX-Gmail", "C2DM-Error", "GENERAL C2DM ERROR");
        }
    
        alert(errorMessage);
    
        if ( (which_c2dm_gcm_action=='send_sms') || (which_c2dm_gcm_action=='send_mms') ){
            //resetFocusOnEntryBoxAfterC2DMProblem(optionalMessagesDiv);
        }
    
    }

    function getTextsForThisNumber(messageObj){  
        
        console.info("Inside of getTextsForThisNumber. Message details obj:", messageObj);
        
        var messageType = messageObj["type"];
    
        if((messageType == 10)||(messageType == 11)){

            var contactObj = messageObj["sender"];  
            var contactName = createHTMLEquivalentOfMessageBody(contactObj["contactName"], "YES");            

        } else if ((messageType == 20)||(messageType == 21)) {

            var num = messageObj["fullPhoneNum"];            
            var contactName = createHTMLEquivalentOfMessageBody(messageObj["contactHeaderNames"], "YES");  

        }        

        if(currentLocation == "Facebook"){

            var fbChatNotifDockFull = checkIfFBDockIsFull(false);
            
            if(fbChatNotifDockFull != false){
            
                initializeInfoModal({message: '<strong>MightyText in Facebook:</strong> You have a new text message, but since you have lots of Facebook messenger windows, there\'s not enough room to show it. Click <a class="fbIncomingConfirm">here</a> to open it in a new window', id: "incoming_message_" + messageObj["id"], message_id: messageObj["id"]});
                
                return false;
            }
            
        }
        
        var textThreads = new Array();
        var numberOfMessagesToGet = 10;
        var numClean = messageObj.phone_num_clean;
        var phoneNumToSendToServlet = messageObj.phone_num;//updated to be full num, instead of phone num clean on 1.18.18 by KL
                
        if(String(num).indexOf("|") > -1){
        //IF GETTING MESSAGES FOR GROUP MMS THREAD, THEN WE SHOULD SEND THE git  SERVLET THE PHONENUM FULL INSTEAD OF THE PHONENUMCLEAN BECAUSE WHEN THE PHONE NUM CLEAN IS A NEGATIVE INTEGER, IT WILL CAUSE THE SERVER TO RETURN THE INCORRECT THREAD'S MESSAGES
            phoneNumToSendToServlet = num
        }
        
        var postVarBuilder = 'function=GetMessages&start_range=0&end_range=' + numberOfMessagesToGet + '&phone_num=' + phoneNumToSendToServlet;
        
        var getDataFromServer = $.ajax({
            type: "POST",
            url: baseUrl + '/api',
            dataType: "json",
            data: postVarBuilder,
            timeout: 5000,
            tryCount: 0,
            retryLimit: 1,
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
/*
                if(optionalGroupMMSContactHeaders != undefined){
                    contactName = optionalGroupMMSContactHeaders;
                }
*/
//                var sanitizedContactName = createHTMLEquivalentOfMessageBody(contactName, 'YES');


                if ((response.user) && (response.user.indexOf('user not logged in') > -1)) {
                    //this should not happen as of 10.27.15 because of logic implemented that will reload BG if a CAPI was rcvd alerting us that the user signed out from a client.
                    //Once bg reloads, No CAPI should be forwarded to this tab until its reloaded.
                    notifyBGOfSignOut();

                    removeChatWindowPlaceHolderIfItExists({phone_num_clean: numClean});

                } else {
                    console.log('============ MESSAGES FOR ' + numClean + ' ===============');
                    console.log(response.messages);
                    $(response.messages).each(function() {
                        textThreads.push(this);
                    });
    
                    numClean = response.messages[0].phone_num_clean;
                    num = response.messages[0].phone_num;
    
                    getContactPhotoForThisContactFromBG(numClean, num, contactName, textThreads);
                }

            },
            error: function(jqXHR, status, error) {
                removeChatWindowPlaceHolderIfItExists({phone_num_clean: numClean});
                console.log({
                    request: jqXHR,
                    text_status: status,
                    err: error
                });
                console.error("Got an error in getMessages");
            }
        });
    }

    function checkIfUserHasEnabledIncomingMessageChatWindows(options){
        //triggered on incoming new_content CAPI, and when we want to toggle the page title.
        if(isUserViewingWebappIframe()){//if the iframed webapp is in view, then don't bother to check incoming message setting
            return false;
        }
        
        console.log("Inside of check if user has enabled incoming msg chat windows", options);
        
        var subClientNotifPrefName
        
        if(currentLocation == "Gmail"){
            subClientNotifPrefName = 'gmail_notifs';
        } else if(currentLocation == "Facebook"){
            subClientNotifPrefName = 'fb_notifs';
        }
        
        chrome.storage.local.get(subClientNotifPrefName, function(data){
        
            console.log(data);
                
            if(data[subClientNotifPrefName] == "1"){
                
                if(options.hasOwnProperty("page_title_toggle")){
                    options.page_title_toggle();
                } else {
                    //check again if this is the only placeholder in the dom.
                    //
                    var existingPlaceHolders = $('.convoWindowPlaceHolder[data-number="' + options.capi.phone_num_clean + '"]');
                    
                    if(existingPlaceHolders.length < 1){//we have to check for placeholders again because the lookup for this message setting takes too long.  If the user receives too many messages from the same phone num clean, multiple chat windows will be created.
                        $(options.notif_container).append('<div class="convoWindowPlaceHolder" data-number="'+ options.capi.phone_num_clean +'"></div>');
                        getTextsForThisNumber(options.capi);                        
                    }

                }

            } else if (data[subClientNotifPrefName] == "0"){
                
                console.log("incoming message received, but user opted to not receive any notifications in this subclient");
            }
        });
    }

    function removeChatWindowPlaceHolderIfItExists(options){

        var existingPlaceHolder = $('[data-number="' + options.phone_num_clean + '"].convoWindowPlaceHolder');
        
        if(existingPlaceHolder.length > 0){
            $(existingPlaceHolder).remove();
        } else {
            console.log("The placeholder for this convo window has already served its purpose and been removed.");
        }            

    };

    function displayNotificationOfNewContent(scCleanNum, scNum, scName, userTexts, contactPhoto) {

        var checkIfWebappIframeIsInView = isUserViewingWebappIframe();

        if((createNotifsInGmail) && (!checkIfWebappIframeIsInView)){    
            var scNameLength = scName.length;
            var displayName = scName;
                        
            var mms_HTML = buildHTMLButtonCanvasMMS(scCleanNum);

            var textNotificationHTML = '';
            textNotificationHTML += '<div class="notificationWrapper" data-context="Conversation">';
            textNotificationHTML += '<div class="mightyno"><div class="composeOuterContainer">';
            textNotificationHTML += '<div class="composeInnerContainer mightyClearfix conversation" data-number="' + scCleanNum + '">';
            //HEADER
            textNotificationHTML += '<div class="composeHeader mightyClearfix">';
/*             textNotificationHTML += '<div class="mightyLogo"><img src=' + logoImgURL + '></div>'; */
            textNotificationHTML += '<div class="mightyLogo"><img src=' + contactPhoto + '></div>';
            textNotificationHTML += '<span class="title">New MightyText</span>';
            textNotificationHTML += '<div class="mightbtnholder">';
            textNotificationHTML += '<div class="mighthbtn fbShareMighty"><img src="' + fbHeaderShareImgURL + '"/></div>';
            textNotificationHTML += '<div class="mighthbtn minMighty"><img src=' + minImgURL + '></div>';
            textNotificationHTML += '<div class="mighthbtn openMighty" action="pop_out"><img src=' + popImgURL + '></div>';
            
            var buttonImgUrl;            
            if(currentLocation == "Facebook"){
                buttonImgUrl = fbCloseImgURL;
            } else {
                buttonImgUrl = closeImgURL;
            }
            textNotificationHTML += '<div class="mighthbtn closeCompose" action="close"><img src="' + buttonImgUrl + '"/></div>';                

            textNotificationHTML += '</div></div>';
            //BODY
            textNotificationHTML += '<div id="' + scCleanNum + '_conversation"class="composeBody mightyClearfix conversation">';
            //SEND CONTACTS
            textNotificationHTML += '<div class="sendTo mightyClearfix"><div class="sendContacts" class="mightyClearfix"></div><input class="numberToSendTo typeahead" placeholder="New Contact" data-autosize-input="{ \'space": 40 }\'></div>';
            //CONVERSATION
            textNotificationHTML += '<div class="conversationHolder mightyClearfix" data-message-count="' + userTexts.length + '"></div>';
            textNotificationHTML += buildResponseAreaHTML({clean_num: scCleanNum, full_num: scNum});
            textNotificationHTML += '</div></div>';
            
            var textNotificationDestination = '';
            //PLACEHOLDER IS PART OF THE SOLUTION FOR DUPLICATE THREADS.            
    
            //remove any placeholders in the dom!
            
            removeChatWindowPlaceHolderIfItExists({phone_num_clean: scCleanNum});
            
            //Which subclient are we in?
            if(currentLocation == "Facebook"){

				textNotificationDestination = $('#ChatTabsPagelet').children().children().children(".fbNubGroup");
                var customNotifHTML = textNotificationHTML.replace("notificationWrapper", "notificationWrapper mightyFB fbNub _50-v _50mz _50m_ _5238 opened");

                $(customNotifHTML).prependTo(textNotificationDestination).each(function() {
                                        
                    setupProFeatures(scCleanNum, "conversation", scNum);
                                        
                    buildTextNotificationWindow(this, userTexts, scNum, displayName, textNotificationDestination);
                    
                    addAdaptionClasses(this, "notif");
                
                });

            } else if (currentLocation == "Gmail"){

                textNotificationDestination = $(".dw").find(".nH.nn").first();
                
                var customNotifHTML = textNotificationHTML.replace("notificationWrapper", "notificationWrapper nH aJl nn mightynH");

                $(customNotifHTML).insertAfter(textNotificationDestination).each(function() {
                    
                    buildTextNotificationWindow(this, userTexts, scNum, displayName, textNotificationDestination);
                    
                    setupProFeatures(scCleanNum, "conversation", scNum);

                });
            } else if (currentLocation == "Outlook"){

                textNotificationDestination = $("div#outlookNotifs").find(".nH.nn");
                
                var customNotifHTML = textNotificationHTML.replace("notificationWrapper", "notificationWrapper nH aJl nn mightynH");

                $(customNotifHTML).insertAfter(textNotificationDestination[0]).each(function() {
                    
                    buildTextNotificationWindow(this, userTexts, scNum, displayName, textNotificationDestination);
                    
                    setupProFeatures(scCleanNum, "conversation", scNum);

                    addAdaptionClasses(this, "notif");

                });
            }
        } else {
            removeChatWindowPlaceHolderIfItExists({phone_num_clean: scCleanNum});
            console.log('receiving notifications are not enabled.');
        }
        //}
    };
        
    function buildResponseAreaHTML(options){

        var mms_HTML = buildHTMLButtonCanvasMMS(options.clean_num);
        var html = '<div class="responseArea"><div class="messageContainer"'; 

            if(options.hasOwnProperty("full_num")){
                html += 'data-name="' + options.full_num + '"';                
            }

            html += '><div contenteditable="true" class="messageToSend" placeholder="Reply here..."></div></div>';
            
            html += buildSaveDraftButton(options.clean_num);
            
            html += buildTemplatesDropDownHTML(options.clean_num + "_templatesDropDown");
            
            html += '<div class="mightdcfoot mightyClearfix">';
            //SENDMESSAGE
            html += '<div class="sendSMS"><button class="btn btn-info"><img src=' + sendImgURL + '></button></div>';
            //MMS ATTACH
            html += '<div class="sendMMS ra-action-btn">' + mms_HTML + '</div>';
            //EMOJI COMPOSER
            html += '<div class="emojiButtonHolder ra-action-btn"><div id="newSMS_Emoji" class="emojiToggle"><img src="' + smileImgURL + '" alt="mightyEmojiSelector"/></div></div>';
            //SCHEDULER
            html += '<div class="schedulerContainer"><button id="' + options.clean_num + '_Scheduler" class="schedulerButton ra-action-btn" ><img src="' + SchedulerImgURL + '"/></button></div>';
            //COUNT CONTAINER
            html += '<div class="countContainer" style="float:right;"><span class="count"></span></div>';
            html += '</div></div>';
        
        return html;
    }
        
    function buildTextNotificationWindow(currentTextNotif, userTexts, scNum, displayName, gmailChatWindowContainer){
        var sendContacts = $(currentTextNotif).find(".sendContacts");
        var thisTitle = $(currentTextNotif).find(".title");
        var textHistory = $(currentTextNotif).find(".conversationHolder");
        updateWindowContainerHeights(); //update height of outer most container so that it displays the textwindow
        
        console.log(displayName);
        
        $(thisTitle).html(displayName);//SET THE DISPLAYNAME FOR THIS CONVERSATION NOTIF
        
        $('<div class="contact" data-number="' + scNum + '"><span class="contactName">' + displayName + '</span><img src="' + closeImgURL + '" class="removeContact"/></div>').appendTo(sendContacts).each(function() {
            var removeButton = $(currentTextNotif).find('.removeContact');
            $(removeButton).on('click', function() {
                var contact = $(currentTextNotif).parent();
                $(contact).remove();
                console.log('removed this: ' + currentTextNotif);
            });
        });
        //BELOW IS THE CODE TO CREATE THE WINDOW WHERE TEXT HISTORY IS DISPLAYED.
        $(userTexts).each(function() {
/*
            console.log("<-------------- Message Type ---------------------->");
            console.log(this.type);
*/
            var messageHTML = buildMessageHTML(this);
            var statusRoute = this.status_route;
            var thisText = this;

//            if ((this.type == 10) || (this.type == 20)) {
                $(messageHTML).prependTo(textHistory).each(function(index, text) {
                    addItemActionsEventHandlers(this, currentTextNotif, false);

                    var mmsCheck = $(this).find("a#fancyimagepopup");
                    
                    if((thisText.type == 20) || (thisText.type == 21)){//CHECKING IF IT IS A GROUP MESSAGE
                        if (thisText.inbox_outbox == 60){//CHECKING IF IT IS AN INCOMING MESSAGE         
            /*                 console.error(messageObj.inbox_outbox); */
                            getContactInfoFromBGScript(thisText.content_author, thisText.id);
                        }                
                    }    			
                    
                    if( mmsCheck.length > 0 ){//just appended an mms
                        $(mmsCheck).on("click", function(e){ e.preventDefault();}).fancybox({
                			type	: 'image',
                			overlay : {
                        		css : {
                            		'background': 'black',
                            		'max-height': '200px'
                        		},    // custom CSS properties
                        		locked : true   // if true, the content will be locked into overlay
                        	}
                		});

                    }
                    
                    var sentMessageStatusParent = $(this).find("div.textInnerWrapper");

                    if(((statusRoute === 2) || (statusRoute < -90)) && (!thisText.hasOwnProperty("event_list"))){

                        buildMessageStatusIndicator({capi:thisText, parent: sentMessageStatusParent});                    
                    }

                    //is this a scheduled message?
                    var scheduledMessCheck = $(text).find(".eventStatusIcon");
                    
                    if(scheduledMessCheck.length > 0){
                        var sentMessageStatus = $(text).find(".sendConfirmation, .cancelScheduledMess");
    				   	addToolTipToSentConfirmationIcon(sentMessageStatus);
    				   	addScheduledEventCancelCapability(text);
                    }
                    
                });        
        });
        //END TEXT HISTORY CODE
                
        setTimeout(function() {
            $(textHistory).scrollTo('max');
        }, 500); //the scrollTo function is set to a slight delay to account for the load of images.  Without the delay, the textwindow prematurely scrolls to what it thinks it is the bottom (sans images)
//        console.log('displaying notif on Gmail from: ' + displayName);
        //css hack for gmail
        resetWindowParent(gmailChatWindowContainer[0]);
        
        //DETERMINE WHETHER OR NOT THIS THREAD IS A GROUPMMS OR NOT.
        var groupMMSCheck = isThisConversationAGroupMessage(scNum);

        addBasicComposerFunctionality(currentTextNotif, "Conversation", groupMMSCheck);
    };
    
    function buildMessageHTML(messageObj){
        
//        console.log("inside of buildmessage html =========================>");
//        console.log(messageObj)
        
        var timeStamp = messageObj.ts_server + ' UTC';
        var momentDate = moment(timeStamp).format("MMM D, h:mm a"); 
//            var textMessage = checkMessageContentForURLs(messageObj.body);
        var textMessage = createHTMLEquivalentOfMessageBody(messageObj.body);
        var cleanNum = messageObj.phone_num_clean;
        var uniqueTextID = messageObj.id;
        var starredStatus = messageObj.is_starred;
        var favoriteLink = '';
        var statusRoute = messageObj.status_route;
    	var optionalSendFromWebAppImg = '';
		var eventWarningOptional = '';
		var eventHistoryIcon = '';
		var cancelEventOptional = '';
        var sentFromIcon = '';
        var messageStatusClass = '';

        //IF A TEXT MESSAGE IS FAVORITED, THEN CHANGE THE IMG SRC OF THE ICON AND CLASS
        var unstarredTextHTML = '<a id="starMessage" data-message-id="' + uniqueTextID + '" class="unstarred messageAction"><img class="unstarredIcon" src="' + unstarredImgURL + '"></a>';
        var starredTextHTML = '<a id="starMessage" data-message-id="' + uniqueTextID + '" class="messageAction starred"><img class="starredIcon" src="' + starredImgURL + '"></a>'
        
        if (starredStatus) {
            favoriteLink = starredTextHTML;
        } else { 
            favoriteLink = unstarredTextHTML;
        }
        
        //KL IS ABOUT TO STORE THE CONTACTS ARRAY IN BOTH THE CONTENT SCRIPT AND BACKGROUND SCRIPTS BECAUSE WE WILL NEED TO LOOK UP THE CONTACT NAMES OF T
        var incoming_outgoing_class_string;
        
        if (messageObj.inbox_outbox == 61) {
            incoming_outgoing_class_string = "outgoing";
            sentFromIcon = buildSentFromIcon(messageObj);
            if(messageObj.status_route < -90){
                messageStatusClass = "failedMessageSend";
            }
        } else {
            incoming_outgoing_class_string = "incoming"
        }

        var mmsHTML = '';
                
        if((messageObj.type == 11) || (messageObj.type == 21)){
            var mms_blob_url = baseUrl + '/imageserve?function=fetchFile&id=' + uniqueTextID;
            
            mmsHTML = '<div id="mms-scale-down"><a id="fancyimagepopup" href="' + mms_blob_url + '" data-blobkey="' + messageObj.mms_object_key + '"> <img class="mmsImage" src="' + mms_blob_url + '" alt="Photo in process"></a></div>';
        }
        
        	// IF MESSAGE WAS SCHEDULED THIS LOGIC WILL MAKE SURE WE CORRECTLY DISPLAY THE MESSAGE IN IT'S CURRENT STATE (PENDING, SENT, CANCELLED, ETC...)
    	var scheduledClass = '';
    	if(messageObj.event_id && (messageObj.event_id != 0)){
    	var wasThisMessageSentFromTheWebApp = '';
			if (messageObj.inbox_outbox == 61){    //outbound
				
					//CRV add a check to see if the message has acked yet.  We must also check the source_client to ensure that the text was sent from teh web app and not the phone as texts sent from the phone have no ack_phone_sent value.
				if(messageObj.status_route == 2)
					{
						wasThisMessageSentFromTheWebApp = 'no ack yet';
					}
				
/* 				console.log(wasThisMessageSentFromTheWebApp); */
				if(wasThisMessageSentFromTheWebApp){
					optionalSendFromWebAppImg = '<div id="'+ messageObj.id +'" class="sentMessageStatus" ><img class="eventStatusIcon sendConfirmation" src="' + scheduledMessageImgURL + '" tooltip-content="Scheduled to send" width="15" height="15" /></div>';
				}

                //adding sentfromicon
			} else {
			
			}
			eventHistoryIcon = '<i id="eventHistory_' + messageObj.event_id + '" class="icon-calendar eventHistoryIconInThread moreInfoStatus" data-eventid="' + messageObj.event_id + '"></i>';
			scheduledClass = 'scheduledMessage';
			var scheduledTSMessage = 'Scheduled to send at: ';
			
			if(messageObj.status_route == 10){
				scheduledTSMessage = '';
				scheduledClass += ' scheduledMessageSENT'; //CRV if this was a scheduled message, but it's already been sent, don't show it in the pending state. 
				optionalSendFromWebAppImg = '<div id="'+ messageObj.id +'" class="sentMessageStatus">'
				optionalSendFromWebAppImg += '<img class="eventStatusIcon sendConfirmation" src="' + successScheduledMessageImgURL + '" tooltip-content="Sent scheduled message" width="17" height="17" />'
				optionalSendFromWebAppImg += '</div>';
			} else {
				var eventInfo,
                    statusIcon = parseScheduledEventInfo(messageObj.event_list);
				
    			if(messageObj["event_list"]["event_update_notify"] != undefined){
    				eventInfo = messageObj.event_list.event_update_notify;
    			} else {
    				var eventJSON = jQuery.parseJSON(messageObj.event_list); 
                    eventInfo = eventJSON.eventlist_details;
    			}

				ts = eventInfo.ts_event_trigger
				momentDate = moment(ts).format("MMM D, h:mm a")
				momentDate = 'Scheduled to send at: ' + momentDate;
			
				if((eventInfo.status == 703) || (eventInfo.status == 706) || (eventInfo.status == 799)){//CRV something on the device has failed in association with this scheduled message
					var optionalToolTipClass = 'sentMessageStatus ';
					
					if(eventInfo.status == 799){
						optionalToolTipClass += 'scheduledEventFailed';
					} else if(eventInfo.status == 706) {
						optionalToolTipClass += 'scheduledEventSchedulingFailed';
					} else if(eventInfo.status == 703){
						optionalToolTipClass += 'scheduledEventCancellingFailed';
					}
					optionalSendFromWebAppImg = '<div id="'+ messageObj.id +'" class="' + optionalToolTipClass + '">'
					optionalSendFromWebAppImg += statusIcon.icon;
					optionalSendFromWebAppImg += '</div>';
				} else if(eventInfo.status == 701) {//CRV event scheduled in process
					scheduledClass += ' pendingScheduledMessage';
					momentDate = 'Scheduling in Process';
				} else if(eventInfo.status == 704) {//In the process of cancelling
					messageTimeStamp = 'Cancelling Event...';
				} else if(eventInfo.status == 705) {//CRV event was cancelled
				   	scheduledClass += ' scheduledMessageCancelled';
				   	momentDate = 'Cancelled';
				   	optionalSendFromWebAppImg = '<div id="'+ messageObj.id +'" class="sentMessageStatus">'
				   	optionalSendFromWebAppImg += statusIcon.icon;
				   	optionalSendFromWebAppImg += '</div>';
			   	} else if(eventInfo.status == 799) {//CRV scheduled event failed
				   	scheduledClass += ' scheduledMessageFailed';
				   	momentDate = 'Message Send Failed';
			   	} else {
    			   	scheduledClass += ' scheduledMessageSuccess';
			   		cancelEventOptional = '<i class="cancelScheduledMess fa fa-times-circle" tooltip-content="Cancel Scheduled Message"></i>'
                }                                
            }
        }

        var messageHTMLBody = '<div class="textWrapper ' + incoming_outgoing_class_string + ' ' + scheduledClass +' ' + messageStatusClass + '" id="message-id-' + uniqueTextID + '">' + mmsHTML + '<div class="textInnerWrapper mightyClearfix">'+ optionalSendFromWebAppImg + eventWarningOptional + cancelEventOptional + eventHistoryIcon +'<span class="textContent">' + textMessage + '</span></div><div class="itemActions"><a id="forwardMessage"  class="messageAction" data-message-id="' + uniqueTextID + '" data-message-type="' + messageObj.type + '"><img class="forwardMessage forwardMessageIcon" src="' + forwardImgURL + '"></a>' + favoriteLink + '<a id="deleteMessage" class="messageAction" data-message-id="' + uniqueTextID + '" data-message-type="' + messageObj.type + '" data-clean-num="' + cleanNum + '"><img class="deleteOneMessage deleteOneMessageIcon" src="' + deleteImgURL + '"></a><span class="textTimeStamp">' + momentDate + '</span>'+ sentFromIcon +'</div></div>';
        
        return messageHTMLBody;
        
    };
    
    function buildSentFromIcon(messageInfo){
/*         console.log(messageInfo); */
    
		var iconToUse = '';
		if(messageInfo.source_client == 30) //Phone
			{
				iconToUse = 'fa-mobile fa-lg';
			}
		else if(messageInfo.source_client == 33) //Tablet
			{
				iconToUse = 'fa-tablet';
			}
		else      //CRV some web variation
			{
				iconToUse = 'fa-laptop';
			}
		
		
		var html = '<div class="sentFrom sentFromIcon"><i class="sentFromIcon fa ' + iconToUse + '"></i></div>';
		return(html);
	}


    function getTypeAheadArray(window) {
        var contactInput = $(window).find(".numberToSendTo");
        var contactsToSendSMSTo = $(window).find(".sendContacts");
        chrome.runtime.sendMessage({
            getAutoContact: true
        }, function(response) {
            console.log('asking for typeahead array');
            if (response.typeAheadSource) {
                console.log({
                    "confirmation": response.confirmation,
                    "array": response.typeAheadSource
                });
                
                autoContacts = [];//empty the array each time before we are sent another from the background script.
                autoContacts = response.typeAheadSource;
                
/*
                $(autoContacts).each(function(index, item){
                    if(item.indexOf("Contact List") > -1){
                        console.info(item);
                    }
                });
*/
                
                $('.numberToSendTo').typeahead({
                    source: autoContacts,
                    items: 5,
                    updater: function(item){                        
                        handleTypeAheadUpdate({selected:item, input:contactInput, contacts_container:contactsToSendSMSTo, message_area: $(window).find(".messageToSend")});
                    }
                });
            } else {
                console.log('Error getting typeahead array');
            }
        });
    };
    
    function handleTypeAheadUpdate(options){

        var item = options.selected,
            contactInput = options.input,
            contactsToSendSMSTo = options.contacts_container;

        chrome.runtime.sendMessage({
            getContactInfo: true,
            typeaheadItem: item
        }, function(response) {

            console.info("Got response for get contact info");
            console.info(response);
            if(response.hasOwnProperty("contactInfo")){
                $(response.contactInfo).each(function(index, singleContactInfoFromBGScript){
                    processContactForComposeSingleText(singleContactInfoFromBGScript["contactName"], singleContactInfoFromBGScript["phoneNum"], contactInput, contactsToSendSMSTo);
                });
                if(response.contactInfo.length > 1){//if the user appended a contact list, we should bring the focus to the response area.
                    setEndOfContenteditable(options.message_area);                    
                }
            } else {//no contact info returned, there was an error
                var contactInfoError = response.error,
                    errorMessageToDisplay;
                if((contactInfoError == "no_contact_info_found") || (contactInfoError == "unable_to_retrieve_contact_list_details")){
                    errorMessageToDisplay = "Cannot add contacts from this contact list at this time. If this problem continues, please contact MightyText.";
                } else if(contactInfoError == "no_contacts_in_list"){
                    errorMessageToDisplay = "The contact group: " + response.list_name + " has no contacts in it.";
                }
                displayBootstrapAlertNotif({message: "An error occurred while retrieving this contact list's members.  Please try again.", ts_dismiss: 10000, type: "error"});                            
            }

        });
    
    };

    function getContactInfoFromBGScript(contentAuthorFullNum, msgID){
        
        var contentAuthorCleanNum = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(contentAuthorFullNum);
        var desiredContact;
        
        //testing out talking to the background script
        chrome.runtime.sendMessage({
            lookThisContactUp: true,
            numClean: contentAuthorCleanNum,
            fullNum: contentAuthorFullNum
        }, function(response) {
        
            console.log(response.confirmation);
            var contactObj = response.confirmation;
            var contactNameToBeDisplayed;
                                            
            if(msgID != undefined){//if we are passing a message id, then we know that this is being triggered within the context of updating an existing GROUP thread with the author's name. 8/26/14 KL

                if(contactObj != undefined){
                    contactNameToBeDisplayed = contactObj.contactName
                } else {
                    contactNameToBeDisplayed = contentAuthorFullNum;
                }
                
                var cleanContactName = createHTMLEquivalentOfMessageBody(contactNameToBeDisplayed, 'YES');
                if(cleanContactName != "self"){
                    var groupMessageIncomingContactHTMLStr = ' - <span class="contentAuthor">' + cleanContactName + '</span>';                    
                }
                
                //SINCE IT IS A GROUP MESSAGE, WE NEED TO APPEND THE CONTACT NAME (OR NUMBER) OF THE PERSON WHO AUTHORED THIS GIVEN MESSAGE.
                $("#message-id-" + msgID).find(".textContent").append(groupMessageIncomingContactHTMLStr);
                
            } else {
                
                
            }

        });
        
    };
    
    function insertContact(item, typeaheadCheck, contactName, contactNumber, contactInput){

        var contactClass = '';
        var contactsToSendSMSTo = $(contactInput).parent();
        //determine if we are on fb
        if(currentLocation == "Facebook"){
            contactClass = "contact fb";
            closeImgURL = chrome.extension.getURL('img/fbt-xicon.png');
        } else {
            contactClass = "contact";
        }
        
        var htmlContactNum = createHTMLEquivalentOfMessageBody(contactNumber, 'YES');
        var cleanContactName = createHTMLEquivalentOfMessageBody(contactName, 'YES');
        
        if (typeaheadCheck){
            $('<div class="' + contactClass + '" data-number="' + htmlContactNum + '"><span class="contactName">' + cleanContactName + '</span><img src="' + closeImgURL + '" class="removeContact"/></div>').insertBefore(contactInput).each(function() {
                setRemoveButtonClickHandlerOnContacts(this);
            });
        } else {
            console.log("user is entering a contact not found in typeahead");
            $('<div class="' + contactClass + '" data-number="' + htmlContactNum + '"><span class="contactName">' + cleanContactName + '</span><img src="' + closeImgURL + '" class="removeContact"/></div>').insertBefore(contactInput).each(function(){
                setRemoveButtonClickHandlerOnContacts(this);
            });
        }
        
	  	var draftIcon = $('#newSMS_save-draft');
	  	toggleDraftSaveState(draftIcon, true);
        //If the user adds a contact, then we should allow them to save this draft 6/10/14
                
        checkNumberOfCurrentContactsToSeeIfGroupMMSOptionDisplays(contactsToSendSMSTo);
    }
    
    function setRemoveButtonClickHandlerOnContacts(contact){

        var contactsToSendTo = $(contact).parent();
        var removeButton = $(contact).find('.removeContact');
        $(removeButton).on('click', function() {
            var contact = $(this).parent();
            $(contact).remove();
            
            checkNumberOfCurrentContactsToSeeIfGroupMMSOptionDisplays(contactsToSendTo);

        });
    
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
        if ((!do_not_zeropad_optional) && (phonenum_to_check.length < 7)) {
            phonenum_to_check = zeroPad(phonenum_to_check, 7) //last 7, and zeropadded.
        } else phonenum_to_check = phonenum_to_check.substring(phonenum_to_check.length - 7);
        //just last 7, no zeropad 
        return phonenum_to_check;
    }

    function zeroPad(num, count) {
        var numZeropad = num + '';
        while (numZeropad.length < count) {
            numZeropad = "0" + numZeropad;
        }
        return numZeropad;
    }

    function sanitizeTextResponse(element, removeBRTagsOptional){
		
		var responseAreaClone = $(element).clone(); //CRV We must clone the content in the message response area so that the edits we perform in the following each statement aren't reflected in the dom. 
		
//		console.log('textMessageContent BEFORE sanitization:');
//		console.log($(responseAreaClone).html());
		
		
		//CRV need to search for &nbsp characters and replace them with regular spaces.  The interesting issue here is that the content editable div sets all spaces to &nbsp initially and then replaces them with white space ONLY if a character follows the &nbsp.  So, in the case of double spaces and spaces at the end of message bodies, an &nbsp character will remain in the message body, complicating server side byte encoding. 
		$(responseAreaClone).html($(responseAreaClone).html().replace(/&nbsp;/g, ' '));
		
//		console.log($(responseAreaClone).html());
		
		var responseAreaCloneHTML = $(responseAreaClone).children();
		
		
		
		var numberOfEmojis = 0;
		$(responseAreaCloneHTML).each(function(){
			if($(this).is('img'))
				{
					if($(this).hasClass('emoji'))
						{//CRV increment the number of emoji imgs replaced with their encoded value if the image is an emoji and not an emoticon
							numberOfEmojis++;
						}
					var textValue = $(this).attr('data-textvalue');
					//console.log(textValue);
					$(this).replaceWith(textValue); //CRV if there are any images in the textResponse Area, we assume that they are either emojis or emoticons and we replace them with their text or encoded representation. 
					//console.log($(this));
					
				}
			if($(this).is('br'))
				{
					if(removeBRTagsOptional)//CRV this variable is set in the case that we are performing this 
						{
							$(this).remove();
						}
					else
						{
							$(this).replaceWith("\n"); //CRV if there are any breaks in the text response, we replace them with \n
						}				
				}
			if($(this).is('div')) //CRV added because users who don't have enter to send on, will add a BR wrapped in a div tag when the press enter while composing a text. In order to map those br's to \n, we must detect the div wrapper and explore its contents.  If any of the wrapper divs children are br's, we map them to \n
				{
					if($(this).children().is('br'))
					{
						if(removeBRTagsOptional)//CRV this variable is set in the case that we are performing this 
							{
								$(this).remove();
							}
						else
							{
								$(this).replaceWith("\n"); //CRV if there are any breaks in the text response, we replace them with \n
							}
											
						}
					else if($(this).text().length > 0)
							{

								$(this).replaceWith('\n' + $(this).text());
							}
		
				}
			
		});		
		
		var sanitizedText = $(responseAreaClone).text();
		
		if(numberOfEmojis > 0)
			{//CRV if there are any emojis in the message body, the ENTIRE msg body will be url encoded so we must replace the + sign with it's url encoded value
			
			sanitizedText = replacePlusCharactersWithSpacesUnlessLinkENCODE(sanitizedText);
			}
			
		return(sanitizedText); //CRV here, we must return the text value of the responseArea clone that we have just altered.  
		//return($(responseAreaClone).text());
	};
	
	function replacePlusCharactersWithSpacesUnlessLinkENCODE(body)
	{
		console.log('SANTIZING STRING WITH EMOJIS');
		var pieces = body.split(" ");  //CRV get each continuous string that makes up the message body 
		var bodyReplacedPlus = '';
		for (var i = 0; i < pieces.length; i++) {
			//console.error('piece');
			var piece = pieces[i];
			if(piece.search("http") < 0)
				{ //CRV This piece is NOT a link so replace any + characters with spaces
					piece = piece.replace('+', '%2B');
				}
			else
				{
					if(piece.search("http") > 0)
						{ //CRV we have detected a url, but the string segment doesn't start with the URL.  Thus, there may be some + characters that need to be replaced BEFORE the url begins.  This case arises when a user sends a message with body "text + link + emoji"
							piece = replacePlusCharactersBeforeLinkIfNecessaryENCODE(piece);
						}
				}
				
			bodyReplacedPlus += piece;
			
			if(i < (pieces.length - 1))
				{
					bodyReplacedPlus += ' ';
				}
			//console.error('body with another piece')	
			//console.error(bodyReplacedPlus);
		}

		
		return(bodyReplacedPlus);
	}
function replacePlusCharactersBeforeLinkIfNecessaryENCODE(piece)
	{
		var urlStartChar = piece.search("http");
		var lengthOfStr = piece.length;
		var preURL = piece.substring(0, urlStartChar);
		var url = piece.substring(urlStartChar, lengthOfStr);
		
		preURL = preURL.replace('+', '%2B'); //CRV replace all +'s ONLY in the part of the string that comes BEFORE the url. 
		
	//	alert(preURL);
	//	alert(url);
		var fullPiece = preURL + url;
		return(fullPiece);
	}

    function sendSMS(composeWindow, context, sendButton, messageTextArea, optionalGroupMMSCheck) {
        var textDestinationNotContact = $(composeWindow).find(".numberToSendTo");
        var messageTextArea = $(composeWindow).find(".messageToSend");
        var messageToSend = $(messageTextArea).html();
        var contacts = $(composeWindow).find(".contact");
        var sanitizedMessageToSend = sanitizeTextResponse($(messageTextArea));                
        var MMSBlobIDForThisThread = $(sendButton).closest(".mightdcfoot").find('#mms-blob-id-holder').text();
		var optionalDraftID = false;

        if ($(messageTextArea).hasClass("pendingMessage")) {
            console.log("text success has not been confirmed. don't try to send another message");
        } else {
        
/*
            $(composeWindow).find(".conversationHolder").addClass("pendingMessage");
            $(messageTextArea).addClass("pendingMessage");
*/
        
            if (MMSBlobIDForThisThread.length > 0) {
                is_sms = false;
            } else {
                is_sms = true;
            }
            //VALIDATETEXTMESSAGE
            console.log(sanitizedMessageToSend);
            if (validateMessageContentBeforeSend(is_sms, sanitizedMessageToSend, messageTextArea)) {
                if (contacts[0]) {
                    var currentNumTargetRecipients = $(contacts).length;
                    var numberToSendTo
                    var nameOfContact
                    var action_data
					var batchID = getRandomInt(1000, 9999); //MA: pick a random 4 digit # so we can assign a batch ID, so we can later identify a single alert so we can keep updating it as each HTTP response comes back in.
               		var tsScheduledMessageIfExists = 0;
               		
           				//CRV check to see if the message being sent was previously a draft.  If so, then pass the draft ID
            		var phoneNumClean = $(composeWindow).find(".composeInnerContainer").data("number");
            		
            		if($('#' + phoneNumClean + '_save-draft').attr('data-draftid'))
            			{
            				optionalDraftID = $('#' + phoneNumClean + '_save-draft').attr('data-draftid'); 
            			}
               		
/*
              		if(isAProUser)
              			{
            	  			tsScheduledMessageIfExists = getScheduledTimeIfExists(composeWindow);
              			}
*/

    	  			tsScheduledMessageIfExists = getScheduledTimeIfExists(composeWindow);

                    $(composeWindow).find(".conversationHolder").addClass("pendingMessage");
                    $(messageTextArea).addClass("pendingMessage");
                    $(messageTextArea).attr("contenteditable","false");
                    //only put the notification in pending status after we know the content is valid and that there is a contact to send to. KL 5/27/14
               		
					
//                  isThisConversationAGroupMessage(phoneNum)
                    
					if ((context == "Conversation") && (optionalGroupMMSCheck)){//WE KNOW THAT THE USER IS REPLYING TO A GROUP THREAD CONVERSATION
        				console.log("group mms sent from CONVERSATION");

                        numberToSendTo = $(composeWindow).find('.messageContainer').data("name");//THIS IS THE FULL PHONENUM WITH THE PIPES TO BE SENT W/ SENDC2DM
                        
                        nameOfContact = $(composeWindow).find("span.title").html();//THIS VAR IS FOR THE SUCCESSFULLY SENT NOTIF ON SUCCESS OF SENDC2DM();    										
                                    
    					if(is_sms){
        					//group reg MMS
                                                        
                            sendC2DM({
                                action: 'send_sms_multiple_group_mms', 
                                action_data: sanitizedMessageToSend, 
                                phone_num: numberToSendTo, 
                                contact_name: nameOfContact, 
                                context: context, 
                                window: composeWindow, 
                                message_text_area: messageTextArea, 
                                contacts:contacts, 
//                                 blob_id: 'not-an-mms', dont think we need this
                                batch_id: batchID, 
                                ts_event_trigger: tsScheduledMessageIfExists, 
                                draft_id: optionalDraftID
                            });

    					} else {
                            
                            sendC2DM({
                                action: 'send_mms_multiple_group_mms', 
                                action_data: sanitizedMessageToSend, 
                                phone_num: numberToSendTo, 
                                contact_name: nameOfContact, 
                                context: context, 
                                window: composeWindow, 
                                message_text_area: messageTextArea, 
                                contacts:contacts, 
                                blob_id: MMSBlobIDForThisThread, 
                                batch_id: batchID, ts_event_trigger: 
                                tsScheduledMessageIfExists, 
                                draft_id: optionalDraftID
                            });

    					}
    					
					} else if((context == "Conversation") && (!optionalGroupMMSCheck)){//WE KNOW THAT THE USER IS REPLYING TO A CONVERSATION TO A SINGLE CONTACT
                        $(contacts).each(function() {
                            numberToSendTo = $(this).data('number');
                            //sanitizing contact name w/ createHTMLEquivalentOfMessageBody below before we send the value to sendc2dm and the texty server as a parameter. implemented as of 8/27/13
                            nameOfContact = $(this).text();
//                                console.log("sending " + messageToSend + " to: " + numberToSendTo);   

     				  	    if (is_sms) {
                                action_data = 'send_sms';
                                
                                sendC2DM({
                                    action: 'send_sms',
                                    action_data: sanitizedMessageToSend,
                                    phone_num: numberToSendTo,
                                    contact_name: nameOfContact,
                                    context: context,
                                    window: composeWindow,
                                    message_text_area: messageTextArea,
                                    contacts: contacts,
//                                 blob_id: 'not-an-mms', dont think we need this
                                    batch_id: batchID,
                                    ts_event_trigger: tsScheduledMessageIfExists,
                                    draft_id: optionalDraftID
                                });

//                                 sendC2DM(action_data, sanitizedMessageToSend, numberToSendTo, nameOfContact, context, composeWindow, messageTextArea, contacts, 'not-an-mms', batchID, tsScheduledMessageIfExists, optionalDraftID);
                            } else {
                                action_data = 'send_mms';
//                                 sendC2DM(action_data, sanitizedMessageToSend, numberToSendTo, nameOfContact, context, composeWindow, messageTextArea, contacts, MMSBlobIDForThisThread, batchID, tsScheduledMessageIfExists, optionalDraftID);
                                
                                sendC2DM({
                                    action: 'send_mms',
                                    action_data: sanitizedMessageToSend,
                                    phone_num: numberToSendTo,
                                    contact_name: nameOfContact,
                                    context: context,
                                    window: composeWindow,
                                    message_text_area: messageTextArea,
                                    contacts: contacts,
                                    blob_id: MMSBlobIDForThisThread,
                                    batch_id: batchID,
                                    ts_event_trigger: tsScheduledMessageIfExists,
                                    draft_id: optionalDraftID
                                });
                                
                            }
                        });

					} else {//THE USER IS NOT SENDING FROM AN EXISTING CONVERSATION WINDOW, THEY'RE COMPOSING A NEW MESSAGE
					
					
						  	//CRV check to see if this new message is a saved draft
                	  	if($('#newSMS_save-draft').attr('data-draftid'))
                	  		{
                		  		optionalDraftID = $('#newSMS_save-draft').attr('data-draftid');
                	  		}
					
	                    var groupMMSSelectedState = $(composeWindow).find(".mightyDropup").data("selection");
                        //PLACEHOLDER#1
                        if((groupMMSSelectedState == "SendAsGroup") && (currentNumTargetRecipients > 1)){//THE USER IS TRYING TO COMPOSE A NEW GROUP MESSAGE
    					console.log("group mms from COMPOSE NEW");
    						nameOfContact = new Array();
        					numberToSendTo = new Array();
        					
        					$(contacts).each(function(){ //Loop through each recipient in list
        
        				  		numberToSendTo.push($(this).data('number'));
        				  		console.log('contact number testing');
        				  		nameOfContact.push($(this).text());
        				  		        				  		
        			  		});
        					
        					numberToSendTo = numberToSendTo.join("|"); //CRV created pipedelimited strings from our contact name and number arrays. 
        					nameOfContact = nameOfContact.join(", ");						

                            if (is_sms && groupMMSSelectedState){
                                action_data = 'send_sms_multiple_group_mms';
                                
                                sendC2DM({
                                    action: 'send_sms_multiple_group_mms',
                                    action_data: sanitizedMessageToSend,
                                    phone_num: numberToSendTo,
                                    contact_name: nameOfContact,
                                    context: context,
                                    window: composeWindow,
                                    message_text_area: messageTextArea,
                                    contacts: contacts,
//                                     blob_id: 'not-an-mms',
                                    batch_id: batchID,
                                    ts_event_trigger: tsScheduledMessageIfExists,
                                    draft_id: optionalDraftID
                                });
                                
//                                 sendC2DM(action_data, sanitizedMessageToSend, numberToSendTo, nameOfContact, context, composeWindow, messageTextArea, contacts, 'not-an-mms', batchID, tsScheduledMessageIfExists, optionalDraftID);
                            } else {
            					action_data = 'send_mms_multiple_group_mms';

                                sendC2DM({
                                    action: 'send_mms_multiple_group_mms',
                                    action_data: sanitizedMessageToSend,
                                    phone_num: numberToSendTo,
                                    contact_name: nameOfContact,
                                    context: context,
                                    window: composeWindow,
                                    message_text_area: messageTextArea,
                                    contacts: contacts,
                                    blob_id: MMSBlobIDForThisThread,
                                    batch_id: batchID,
                                    ts_event_trigger: tsScheduledMessageIfExists,
                                    draft_id: optionalDraftID
                                });

//                                 sendC2DM(action_data, sanitizedMessageToSend, numberToSendTo, nameOfContact, context, composeWindow, messageTextArea, contacts, MMSBlobIDForThisThread, batchID, tsScheduledMessageIfExists, optionalDraftID);
                            }

                        } else {
                            if (currentNumTargetRecipients > 4) { //warning to user, if they are sending more than 4 contacts 
                                var userConfirmLotsRecipients = confirm("MightyText sends SMS via your phone, so your mobile carrier will count an SMS sent for each recipient. \n\nPress OK to confirm sending these " + currentNumTargetRecipients + " messages now.");
                                if (!userConfirmLotsRecipients) {
                                    $(textDestinationNotContact).focus();
                                    return false;
                                }
                            }

                                                        
                            if(currentNumTargetRecipients > 3){
                                //trigger bootstrap growl alert                                
                                chrome.storage.local.get("ongoing_conversations", function(data){
                                    if((data.hasOwnProperty("ongoing_conversations")) && (data.ongoing_conversations == "1")){
                                        displayBootstrapAlertNotif({message: "Since this message had more than 3 recipients, ongoing chat windows won't be created.", ts_dismiss: 10000, type: "info"});                            
                                    }
                                });
                            }
                            
                            callGAInBackgroundPage("CRX-Gmail", "Compose-New-Contact-Count", currentNumTargetRecipients.toString())
                        
                            var contactCount = contacts.length;
                        
                            $(contacts).each(function() { //THE USER IS TRYING TO COMPOSE A REGULAR MESSAGE (SENT INDIVIDUALLY TO EACH CONTACT)
                                numberToSendTo = $(this).data('number');
                                //sanitizing contact name w/ createHTMLEquivalentOfMessageBody below before we send the value to sendc2dm and the texty server as a parameter. implemented as of 8/27/13
                                nameOfContact = $(this).find(".contactName").text();
    //                                console.log("sending " + messageToSend + " to: " + numberToSendTo);   
                                
         				  	    if (is_sms) {
                                    action_data = 'send_sms';

                                    sendC2DM({
                                        action: 'send_sms',
                                        action_data: sanitizedMessageToSend,
                                        phone_num: numberToSendTo,
                                        contact_name: nameOfContact,
                                        context: context,
                                        window: composeWindow,
                                        message_text_area: messageTextArea,
                                        contacts: contacts,
//                                         blob_id: 'not-an-mms',
                                        batch_id: batchID,
                                        ts_event_trigger: tsScheduledMessageIfExists,
                                        draft_id: optionalDraftID,
                                        contact_count: contactCount
                                    });
                                    
                                } else {
                                    action_data = 'send_mms';
                                    sendC2DM({
                                        action: 'send_mms',
                                        action_data: sanitizedMessageToSend,
                                        phone_num: numberToSendTo,
                                        contact_name: nameOfContact,
                                        context: context,
                                        window: composeWindow,
                                        message_text_area: messageTextArea,
                                        contacts: contacts,
                                        blob_id: MMSBlobIDForThisThread,
                                        batch_id: batchID,
                                        ts_event_trigger: tsScheduledMessageIfExists,
                                        draft_id: optionalDraftID,
                                        contact_count: contactCount
                                    });
                                }

                            });
                        }
                    }                        
                } else {
                    triggerCustomConfirm('Please choose contacts to send this message to.', function(){$(textDestinationNotContact).focus();});
                    return;
                }
/*                 $(sendButton).addClass("textInProgress"); */
            }
        }
    };
    
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function sendC2DM(options){    
    //reference obj will delete
/*
    options:{
        action: action,
        action_data: actionData,
        phone_num: targetPhoneNum,
        contact_name: targetContactName,
        context: context,
        window: thisWindow,
        message_text_area: messageTextArea,
        contacts: contacts,
        blob_id: optionsMMSBlobID,
        batch_id: optionalBatchID,
        ts_event_trigger, optionaltsEventTrigger,
        draft_id: optionalDraftID
    }
*/
    
        var sendUrlC2DMBase = baseUrl + '/client?function=send&deviceType=ac2dm&source_client=37'; //37 is the Gmail CRX client id
        var sendUrl = sendUrlC2DMBase + '&action=' + options.action + '&action_data=' + options.action_data;
        var postVarBuilder = '';
        var full_phone_num_derived;
        var textAreaToFocus = $(options.window).find(".messageToSend");
        
        if (options.action == 'send_sms') {
            postVarBuilder += 'phone=' + encodeURIComponent(options.phone_num) + '&type=10&source_client=37&deviceType=ac2dm' + '&action=send_sms&action_data=' + encodeURIComponent(options.action_data);
            sendUrl = sendUrlC2DMBase;
            full_phone_num_derived = options.phone_num;
            
			//CRV if this message was a draft, pass the draftID
			if(options.hasOwnProperty("draft_id")){
				postVarBuilder += '&draft_id=' + encodeURIComponent(options.draft_id);
			}
            
        } else if (options.action == 'send_mms') {
            postVarBuilder += 'phone=' + encodeURIComponent(options.phone_num) + '&type=11&deviceType=ac2dm' + '&action=send_mms&action_data=' + encodeURIComponent(options.action_data) + '&mms_object_key=' + encodeURIComponent(options.blob_id);
            sendUrl = sendUrlC2DMBase;
            full_phone_num_derived = options.phone_num;
            
			//CRV if this message was a draft, pass the draftID
			if(options.hasOwnProperty("draft_id")){
				postVarBuilder += '&draft_id=' + encodeURIComponent(options.draft_id);
			}            
            
        } else if(options.action == 'send_sms_multiple_group_mms'){
			postVarBuilder += 'phone=' + encodeURIComponent(options.phone_num) + '&deviceType=ac2dm' + '&action=' + options.action + '&action_data=' + encodeURIComponent(options.action_data); 
			sendUrl = sendUrlC2DMBase;
			full_phone_num_derived = options.phone_num;

    		//CRV if this message was a draft, pass the draftID
			if(options.hasOwnProperty("draft_id")){
				postVarBuilder += '&draft_id=' + encodeURIComponent(options.draft_id);
			}            
			
		} else if(options.action == 'send_mms_multiple_group_mms'){
			postVarBuilder += 'phone=' + encodeURIComponent(options.phone_num) + '&deviceType=ac2dm' + '&action=' + options.action + '&action_data=' + encodeURIComponent(options.action_data) + '&mms_object_key=' + encodeURIComponent(options.blob_id);
			sendUrl = sendUrlC2DMBase;
			full_phone_num_derived = options.phone_num;

    		//CRV if this message was a draft, pass the draftID
			if(options.hasOwnProperty("draft_id")){
				postVarBuilder += '&draft_id=' + encodeURIComponent(options.draft_id);
			}            
			
		}

    	if(options.hasOwnProperty("content_id")){
			postVarBuilder += '&replace_original_content_id=' + encodeURIComponent(options.content_id);
		}


        if((options.hasOwnProperty("ts_event_trigger")) && (options.ts_event_trigger > 0)){
            postVarBuilder += '&ts_event_trigger=' + options.ts_event_trigger;
        }

        var bodyContent = $.ajax({
            url: sendUrl,
            global: false,
            type: "POST",
            timeout: 6000,
            xhrFields: {
                withCredentials: true
            },
            //v important!
            data: postVarBuilder,
            //if browser supports CORS, then this is just blank
            success: function(reply_server, textStatus, jqXHR) {
                console.log('========reply_server return=====');
                
//                 reply_server = "SEND_LIMIT_ERROR";
                
                if (reply_server.indexOf('OK') > -1) {
                    if (reply_server.indexOf('sent to phone') > 0) {
                        callGAInBackgroundPage("CRX-Gmail", "Send-SMS-Success", "");
                                                
                        var messageType = '';
                        var infoMsgType
                        if(options.action == "send_sms"){
                            messageType = "SMS";
                            infoMsgType = 10;
                        } else if (options.action == "send_mms") {
                            messageType = "MMS";
                            infoMsgType = 11;
                        } else if (options.action == "send_sms_multiple_group_mms"){
                            messageType = "GroupSMS";
                            infoMsgType = 20;                            
                        } else if (options.action == "send_mms_multiple_group_mms"){
                            messageType = "GroupMMS";
                            infoMsgType = 21;                                                        
                        }
                        var location = '';
                        if(options.context == "Compose New"){
                            location = "Compose-New-Box";    
                        } else if (options.context == "Conversation"){
                            location = "In-Thread";
                        }
                        callKMInBackgroundPage("Send-Message",{'Type':messageType,'App-Action-Location':location,'Client':'CRX-New', 'Subclient' : currentLocation});

                        var successTimeStamp = new Date();
                        var reg_msgid_between_curly = /\{([^}]+)\}/;
                        var result_array_split = reply_server.split(reg_msgid_between_curly);
                        var msgid_just_created_on_server = (result_array_split[1]);
	         			var infoBlobKey = null;  //CRV set default values for SMS.  If MMS, they are changed in if statement below
                        var event_id = 0;	
                        var scheduledJsonRaw = 'no event info';
                        var scheduledJson = 'no event info';
                        var optionalContentAuthor = 'self';

		 				var messageInfo = {//FAKE MESSAGEOBJ SO THAT WE CAN OPEN A NEW WINDOW
    		 				"body": options.action_data, 
    		 				"id": msgid_just_created_on_server, 
    		 				"inbox_outbox": 61, 
    		 				"type": infoMsgType, 
    		 				"tempBlobKey": infoBlobKey, 
    		 				"source_client": 37, 
    		 				"event_id": event_id, 
    		 				"event_list": scheduledJson, 
    		 				"content_author": optionalContentAuthor,
    		 				"ts_server": successTimeStamp
		 				}; 
		 				
		 				if((options.action == "send_sms") || (options.action == "send_mms")){
    		 				messageInfo["phone_num_clean"] = options.phone_num;
    		 				messageInfo.phone_num = options.phone_num;//added 1.18.18 by KL because we should be sending the full phone num to the /getmessages call.  The line above is confusing, but leaving it in, in case changing it would break another area of the code (outside of /getMessages call)
    		 				messageInfo["sender"] = {"contactName": options.contact_name};
		 				} else if((options.action == "send_sms_multiple_group_mms") || ((options.action == "send_mms_multiple_group_mms"))){
    		 				messageInfo["fullPhoneNum"] = options.phone_num;
    		 				messageInfo["contactHeaderNames"] = options.contact_name;
		 				}
                        
                        if (options.context == "Compose New"){
                            
                            if((reply_server.indexOf("MULTIPLE_GROUP_MMS") > -1) || ((options.hasOwnProperty("contact_count")) && (options.contact_count < 4))) {//if this is a group mms, we always want to check the ongoing conversations setting
                                //START LOGIC FOR ONGOING CONVERSATIONS SETTING
                                var composeWindowContainer = '';
                                    if (currentLocation == "Gmail"){
                                        gmailChatWindowContainers = $(".dw").find(".nH.nn").first();//only selecting the first so that we ensure the $.parent() only returns 1 elem
                                        composeWindowContainer = $(gmailChatWindowContainers).parent();
                                    } else if (currentLocation  == "Facebook"){
//                                         gmailChatWindowContainers = $(document).find("div.fbNubGroup.clearfix").not("._56oy");		
                                        gmailChatWindowContainers = $('#ChatTabsPagelet').children().children().children(".fbNubGroup");
                                        composeWindowContainer = $(gmailChatWindowContainers);
                                    }
                            
                                checkIfUserHasEnabledOngoingConversations(options.window, messageInfo, options.phone_num, composeWindowContainer, options.contact_name, options.batch_id);
                                 
                            } else {

                                $(options.window).remove();                                
                            }
                                                                                                         
                        } else {
                            //PRE-KEV VARIABLES FROM MIGHTY.JS
                            var cleanNum = $(options.window).find(".composeInnerContainer").data("number");
                            var mmsButtonContainer = $(options.window).find('.sendMMS');
                            var imageUploadButton = $(options.window).find("#upload-image-mms");
                            var mmsButtonHTML = buildHTMLButtonCanvasMMS('4444444');
                            var thisResponseArea = $(options.window).find(".responseArea");
                            //PRE-KEV VARIABLES FROM MIGHTY.JS
                            
                            updateTextWindow(options.window, messageInfo);
 
                            if ((options.action == "send_mms") || (options.action == 'send_mms_multiple_group_mms')) {
                                        
                                $(mmsButtonContainer).html(mmsButtonHTML).find("#upload-image-mms").each(function() {
//                                    console.log(this);
                                    addMMSButtonFunctionality(this);
                                });
                            }
                            
                            
                            //If the user attempted to send a draft then we should update the count.
                            //and they are pro.
                            if((options.draft_id) && (isAProUser != false)){
                                callKMInBackgroundPage("Send-Draft-As-Message",{'Type':messageType,'App-Action-Location':location,'Client':'CRX-New', 'Subclient' : currentLocation});
                                setTimeout(function(){
         							fetchDraftsAndAppendFlagIfUserHasDraftsForThisThread(0, 10, options.phone_num, cleanNum);
                                }, 500);
                            }
                            
                            if($(thisResponseArea).hasClass("emojiContainerOpen")){
                            //CLOSE EMOJI COMPOSER AND SHOW CONVERSATION HOLDER AGAIN. 
                                smartToggleEmojiComposer(thisResponseArea, options.window, options.context);
                            }
                            
                        }
             			if(reply_server.indexOf('SCHEDULED_EVENT_DETAILS') > 0){//if this was a scheduled message, we should revert
	         				$(options.window).find(".scheduledLabel").fadeOut(350, function() {					       	 	
                                $(this).remove();
                                //make sure that the scheduler icon is shown
                                //if a user has just sent a message that was scheduled, we want to display the scheduler button again.
                                $(options.window).find(".schedulerButton").show();
					       	});
             			}

		                refreshConversationNotification(options.message_text_area, true);
		                
		                $(options.message_text_area).parent().siblings(".save-draft-button-holder").children(".save-draft-icon").removeAttr('data-draftid');

                    }
                } else {//the server did not return an "OK" response 5/27/14 KL
                  
                    var errorNotifMessage = "An error occurred while sending this message. Please try again. <br> If the problem persists please contact us with error code: GTXT509";
                    
                    if (reply_server.indexOf('LOGIN_REQUIRED') > -1) {
                        callGAInBackgroundPage("CRX-Gmail", "Send-SMS-Failure", "NOT_LOGGED_IN");
                        errorNotifMessage = 'Not logged in to MightyText.';
                        console.error(errorNotifMessage);
                        initializeApp("signBackIn");
    /*                     $(textAreaToFocus).focus(); */
    /*                     $(thisWindow).find(".sendSMS").removeClass("textInProgress"); */
    //                    return (false);
                        //resetFocusOnEntryBoxAfterC2DMProblem(messagesDiv);
                        //toggleSendButton(send_button_dom_element);
                    } else if (reply_server.indexOf('DEVICE_NOT_REGISTERED') > -1) {
                        callGAInBackgroundPage("CRX-Gmail", "Error_Device_Not_Registered", "");
                        //_gaq.push(["_trackEvent","WebApp","C2DM-Error","DEVICE_NOT_REG",1]);
                        errorNotifMessage = 'Android Phone not registered with MightyText with this Google Account, or MightyText Android App not installed properly.';
                        console.error(errorNotifMessage);
                        //toggleSendButton(send_button_dom_element);
                    } else if (reply_server.indexOf('DeviceQuotaExceeded') > -1) {
                        //_gaq.push(["_trackEvent","WebApp","C2DM-Error","DEVICE_QUOTA_EXCEEDED",1]);
                        
                        errorNotifMessage = 'Android Phone Quota Exceeded.  Error Code: DeviceQuotaExceeded (C2DM)';
                        console.error(errorNotifMessage);
                        //toggleSendButton(send_button_dom_element);
                    } else if (reply_server.indexOf('SEND_LIMIT_ERROR') > -1){
                        //the response in this case will return a comma delimited string.		   		   
                        var messageSentCountAndLimitString = reply_server.substring(reply_server.indexOf('{') + 1, reply_server.indexOf('}'));
                        var messageSentCountAndLimitArray = messageSentCountAndLimitString.split(',');//split the string into an array
                        
                        var messagesSentByUser = messageSentCountAndLimitArray[0];//num messages sent by user
                        var messagesQuota = messageSentCountAndLimitArray[1];//num message quota for this user based on their plan. 
                        
                        var warningMessage = '<b>Message Not Sent</b><br><br>';
                        warningMessage += '<span> You have sent ' + messagesSentByUser + ' messages this month, which is over the monthly limit (' + messagesQuota + ') for our free version.</span>';
                        warningMessage += '<br><br>';
                        warningMessage += '<span>To remove this limit, upgrade to MightyText Pro.</span>';
                        
                        
                        triggerCustomConfirm(warningMessage, function(){
                            if(currentLocation == "Gmail"){
                                openPromoWebappInIframe();                                
                            } else {
                                openWebAppPopup("pro_promo");
                            }
                        }, "Go Pro", function(){return(false);});
                        refreshConversationNotification(options.message_text_area);                                                
                        return(false);
                    } else {
                        
                        console.error('C2DM Error.  Please retry. \r\n\r\n Error Info: \r\n\r\n' + reply_server);
    /*                     $(textAreaToFocus).focus(); */
    /*                     $(thisWindow).find(".sendSMS").removeClass("textInProgress"); */
                        //_gaq.push(["_trackEvent","WebApp","C2DM-Error","GENERAL C2DM ERROR",1]);
                        //toggleSendButton(send_button_dom_element);
                        //listener(STATUS_GENERAL_ERROR,req);
                    }
                    
                    //REMOVE OPACITY NO MATTER THE RESPONSE FROM THE SERVER SO THAT THE USER CAN CONTINUE TO USE THE APP
                    displayBootstrapAlertNotif({message: errorNotifMessage, ts_dismiss: 7000, type: "error"});
                    refreshConversationNotification(options.message_text_area);


                }                 
                console.log('==================================');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert('Error in Ajax call: ' + errorThrown);
                callGAInBackgroundPage("CRX-Gmail", "Error_AJAX_C2DM_SendSMS", errorThrown);
                $(textAreaToFocus).focus();
                displayBootstrapAlertNotif({message: "An error occurred while sending this message. Please try again.", ts_dismiss: 7000, type: "error"});
/*
                $(thisWindow).find(".conversationHolder").removeClass("pendingMessage");
                $(messageTextArea).removeClass("pendingMessage");
*/
                //console.log(textStatus);
                //console.log(errorThrown);
                //_gaq.push(["_trackEvent","WebApp","AjaxError","sendC2DM-" + errorThrown,1]);	
                refreshConversationNotification(options.message_text_area);
            }
        });
    }
        
    function refreshConversationNotification(messageToSendDiv, clearContent){
        //! refresh conversation window
        var conversationWindow = $(messageToSendDiv).closest(".responseArea").siblings(".conversationHolder");
                                
        $(messageToSendDiv).removeClass("pendingMessage").attr("contenteditable","true");
        $(conversationWindow).removeClass("pendingMessage");
        
        var draftIcon = $(messageToSendDiv).parent().siblings(".save-draft-button-holder").children(".save-draft-icon");
        
        toggleDraftSaveState(draftIcon, false);
        
        if(clearContent){
            $(messageToSendDiv).empty();
            setEndOfContenteditable(messageToSendDiv);
        }

        
    }
    
    function checkIfUserHasEnabledOngoingConversations(thisWindow, messageInfo, targetPhoneNum, composeWindowContainer, targetContactName, optionalBatchID){
        chrome.storage.local.get("ongoing_conversations", function(data){

            if (data["ongoing_conversations"] == "1") {
        
                console.log("user has ongoing-conversations setting enabled");
                //KL CONVERTED THE PHONENUM THAT WE JUST SENT THE MESSAGE TO INTO A STRING, SO THAT IT CAN THEN BE PASSED INTO THE GETSANITIZEDPHONENUMBER.... FUNCTION.
                var phoneNumClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(String(targetPhoneNum));
                //KL SEARCH FOR ANY EXISTING WINDOWS IN THE SCREEN W/ THE NEW PHONENUMCLEAN YOU WERE JUST RETURNED ABOVE.
                var existingWindows = $(composeWindowContainer).find('[data-number="' + phoneNumClean + '"]');
                                                                                
                if (existingWindows.length < 1) {
            
                    $(thisWindow).remove();
                    getTextsForThisNumber(messageInfo);

                } else {
                    //the CAPI usually comes in first.
                    updateTextWindow(thisWindow, messageInfo);
                    $(thisWindow).remove();
                }
        
            } else if(data["ongoing_conversations"] == "0") {
            
                //ongoing convos not enabled.
                notifyUserSendConfirmation(targetContactName, "SMS/MMS", "successfully_sent_" + messageInfo["id"] , optionalBatchID);
                $(thisWindow).remove();
            
            } else {
                
                console.error("error with ongoing conversations setting.");
            
            }

        });
    }

    function updateTextWindow(textWindow, messageObj) {
        
        var messageDirection = messageObj["inbox_outbox"];
        var sourceClient = messageObj["source_client"];
        var messageHTML = buildMessageHTML(messageObj);
                
        var textContainer = $(textWindow).find(".conversationHolder");
        var existingMessage = $(textWindow).find("#message-id-" + messageObj["id"]);
        var currentComposeHeader = $(textWindow).find("div.composeHeader");
        var characterCountHolder = $(textWindow).find("span.count");
        var messageField = $(textWindow).find(".messageToSend");
        var incoming_outgoing = '';

        if (existingMessage.length > 0) {
            return false;
            console.log("message already exists");
        }

        var currentlyFocusedElement = document.activeElement; 

        //ADD BLINKING FUNCTIONALITY TO MINIMIZED WINDOWS WITH UNREAD TEXTS
        if (messageDirection == 61) {
        
        } else {
        
            flashComposeHeader(currentComposeHeader, messageDirection, textContainer, messageField, textWindow);        
        
        } 
        //STOP BLINK FUNCTION
        
        //INCOMING MESSAGE OR SENT FROM GTEXT. APPEND THEM TO CONVERSATION HOLDER AND MAKE IT FADE
        if (messageDirection != 61 || sourceClient === 30) {
            //console.log(window2Update);
            //console.log(textWindow);
            $(messageHTML).hide().appendTo(textContainer).fadeIn(750).each(function() {
//                $(this).find(".textContent").text(messageBody);
                addItemActionsEventHandlers(this, textWindow, false);
                if((messageObj.type == 20) || (messageObj.type == 21)){//CHECKING IF IT IS A GROUP MESSAGE
/*                     console.log(messageObj); */
                    getContactInfoFromBGScript(messageObj.content_author, messageObj.id);            
                }

            });
        } else if (messageDirection == 61) {
            $(messageHTML).appendTo(textContainer).each(function() {
                var sentMessageStatusParent = $(this).find("div.textInnerWrapper");
                if(messageObj["event_id"] == 0){//this is not a scheduled event
                    var messageStatusIcon = buildMessageStatusIndicator({capi: messageObj, parent: sentMessageStatusParent});
                } else {
                    addScheduledEventCancelCapability(this);
                }
                addItemActionsEventHandlers(this, textWindow, false);
            });
        }
        //SCROLL TO THE BOTTOM OF THE CONVERSATION HOLDER.
        setTimeout(function() {
            $(textContainer).scrollTo('max');
        }, 100);
        
        if (currentlyFocusedElement != messageField[0]) {
            flashComposeHeader(currentComposeHeader, messageDirection, textContainer, messageField, textWindow);
        } else {
            $(messageField).focus();
        }
        //RESET CHARCOUNT TEXT TO 500 EACH TIME THE CONVERSATION HOLDER IS UPDATED
        
        if($(messageField).text().length < 1){//only want to reset the char count if the user has not already typed something in the content editable div. KL 12/16/14
            $(textWindow).find(".count").text("1000");            
        }

    };
    
    function buildMessageStatusIndicator(options){
        var messageStatus = options.capi.status_route,
            statusIndicatorImgSrc = '',
            tooltipStatus = '',
            existingStatusToUpdate = $(options.parent).find(".sentMessageStatus"),
            html,
            statusClassStr = "sendConfirmation",
            whereToAppend = options.parent;
            
        if(existingStatusToUpdate.length > 0){
            html = '';
            whereToAppend = existingStatusToUpdate;
            $(existingStatusToUpdate).empty();
        } else {
            html = '<div class="sentMessageStatus">';
        }

        if (messageStatus < 0){//failed
//             html += '<i class="fa fa-warning ' + statusClassStr + '" tooltip-content="Message Failed"></i><i class="fa fa-location-arrow resendMessageFromThreadIcon ' + statusClassStr + '" tooltip-content="Resend"></i>';
            html += '<i class="fa fa-warning ' + statusClassStr + '" tooltip-content="Message Failed"></i><i class="fa fa-undo resendMessageFromThreadIcon ' + statusClassStr + '" tooltip-content="Resend"></i>';
            tooltipStatus = "failed"
        } else if((options.capi.hasOwnProperty("event_id")) && (options.capi.event_id != 0)){
            
            tooltipContent = "Sent Scheduled Message";
            
            html += '<img class="' + statusClassStr + '" src="' + successScheduledMessageImgURL + '" tooltip-content="' + tooltipContent + '"/>';
                
        } else {
            var tooltipContent;
             if (messageStatus === 10){//successfully sent

                    statusIndicatorClass = 'fa-check confirmed';
                    tooltipContent = "Phone Sent Message";                
             
            } else {//user just sent a message, still waiting for confirmation that it sent
                statusIndicatorClass = 'fa-clock-o pending';
                tooltipContent = "Waiting for Phone to Send Message";                
            }

            html += '<i class="fa ' + statusIndicatorClass + ' fa-fw" tooltip-content="' + tooltipContent + '"></i>';
        }

        if(existingStatusToUpdate.length < 1){
            html += '</div>';
        }
            
        $(html).prependTo(whereToAppend).each(function(){
            if($(this).find("." + statusClassStr).length > 0){
                var tooltipTarget = $(this).find("." + statusClassStr);
            } else {
                var tooltipTarget = this;
            }
            if(messageStatus < 0){
                setupResendIconInstructions(this);
            }
            addToolTipToSentConfirmationIcon(tooltipTarget);
        });
            
    };
    
    function setupResendIconInstructions(resendButton){
        $(resendButton).on("click", function(e){
            getMessageInfoAndTriggerResend(this);
        });
    };

    function flashComposeHeader(composeHeader, inboxOutbox, convoHolder, messageField) {
        $(composeHeader).each(function() {
            var alreadyFlash = $(this).hasClass("unread"),
                checkIfWebappIframeInView = isUserViewingWebappIframe();
            if ((inboxOutbox == 60) && (!alreadyFlash) && (!checkIfWebappIframeInView)) {
                $(this).addClass("unread");
                var blink = setInterval(function() {
                    $(composeHeader).toggleClass("flash");
                }, 750);
            }
            $(this).on("click", function() {
                revertToFocusedComposer(blink, convoHolder, composeHeader);
            });
            $(messageField).on("focus", function() {
                revertToFocusedComposer(blink, convoHolder, composeHeader);
            });
            $(convoHolder).on("click", function() {
                revertToFocusedComposer(blink, convoHolder, composeHeader);
            });
        });
    };

    function revertToFocusedComposer(blink, convoHolder, composeHeader) {
        clearInterval(blink);
        $(composeHeader).removeClass("flash").removeClass("unread");
        $(convoHolder).scrollTo('max');
    };

    function updateWindowContainerHeights() {
        //THIS DOES NOT DO ANYTHING TO CHANGE THE HEIGHT OF THE CONTAINER, BUT IT'S HERE AS A NECESSARY CSS CHANGE TO MAKE SMS WINDOWS STAY OPEN WHEN OTHER WINDOWS (EMIL & GCHAT) ARE CLOSED
        $(".dw").removeClass("np").css("z-index", 6);
        var windowHeight = $(window).height();
        $(".mightynH").css("height", windowHeight);
    };

    function isValidPhoneNum(phonenumber) {
        if (phonenumber != "") {
            var goodChars = "+- 1234567890()/][.";
            for (i = 0; i < phonenumber.length; i++) {
                var c = phonenumber.charAt(i);
                if (goodChars.indexOf(c) < 0) return false;
            }
            return true;
        } else {
            return false;
        }
    };

    function notifyUserSendConfirmation(ContactSentTo, type, notifID, batchID) {
        
        var sanitizedContact = createHTMLEquivalentOfMessageBody(ContactSentTo,'YES');
        var notifCopy
        var timeDelay = 10000;
        var webappIframeCheck = isUserViewingWebappIframe();
        
        if((type.indexOf("template") < 0) && (type.indexOf("draft") < 0) && (webappIframeCheck)){//if it's a template or draft related notif, then we should display the notif, because the webapp iframe won't know if these actions are taken from the gtext code.
            return false;
        }
        
        if (type == "SMS/MMS") {
            if(currentLocation == "Gmail"){
                var existingNotif = $(".mighty-alert-container").find('[data-batch="' + batchID + '"]');
                if(existingNotif.length < 1){
                    notifCopy = "Sent message to "+ sanitizedContact;
                } else {
        			$(existingNotif).append(', ' + sanitizedContact);
        			return;
                }                
            } else if (currentLocation == "Facebook"){
                if(typeof batchID != "undefined"){
                    var existingBatch = $("span#batch-"+batchID);
                    console.error(existingBatch);
                    if(existingBatch.length > 0){
                         console.error("appending: "+sanitizedContact);
            			$("span#batch-"+batchID).append(', ' + sanitizedContact);
                        return false;
                    } else {
                        notifCopy = "Sent message to "+ sanitizedContact;
                        initializeInfoModal({message: "<span id='batch-"+ batchID +"' ><strong>MightyText in Facebook:</strong> "+notifCopy+"</span>", id: notifID});
                        return false;
                    }
                    //no batch id found
                } else {
                    return false;
                }
            }
        } else if (type == "incomingPhoneCall") {
            notifCopy = "Incoming call from " + sanitizedContact + ".";
        } else if (type == "missedPhoneCall") {
            notifCopy = "Missed call from " + sanitizedContact + ".";        
        } else if (type == "incomingGroupMMS"){
            notifCopy = "Incoming group message from " + sanitizedContact + ".";
        } else if (type == "incomingPicMMS"){
            notifCopy = "Incoming picture message from " + sanitizedContact + ".";
        } else if (type == "template-created"){
            notifCopy = "Template Created";
        } else if (type == "draft-saved"){
            notifCopy = "Draft Saved";
        } else if (type == "draft-updated"){
            notifCopy = "Draft Updated";
        } else if (type == "draft-schedule-attempt"){
            notifCopy = "The draft you just saved contains a schedule time.  The message content and recipients were saved in the draft, but the scheduled date/time is not saved in the draft.";
/*
            if(currentLocation == "Gmail"){
                triggerBootstrapGrowl(type);
                //instead of popping the gmail notif, we are going to create a bootstrap growl. KL 6/14/14.
                return false;                
            }
*/
            
        } else if (type == "draft-deleted"){
            notifCopy = "Draft Deleted";
        } else {
            notifCopy = "Loading...";
            timeDelay = 1000;
        }
        
        if(currentLocation == "Gmail"){
            
            //display bootstrap alert
            
            console.log({
                location: "Gmail",
                content: notifCopy
            });
            
            displayBootstrapAlertNotif({message: notifCopy, ts_dismiss: timeDelay, type: "success", batch_id: batchID});

        } else if(currentLocation == "Facebook"){
                
            console.log({
                "contact":sanitizedContact,
                "type": type,
                "batchID": batchID
            });
        
            initializeInfoModal({message: "<strong>MightyText in Facebook:</strong> " + notifCopy, id:notifID, batch_id: batchID});
        }
    };
    
    function displayBootstrapAlertNotif(options){
        
        var alertContainerSelector = "mighty-alert-container";
        var alertContainerHTML = '<div class="' + alertContainerSelector + '"></div>',
            notifContent = options.message,
            alertContainer = $("." + alertContainerSelector),
            alertType;
        
        if(options.hasOwnProperty("type")){
            alertType = options.type;
        } else {//default to info
            alertType = "info";
        }
        
        if(alertContainer.length < 1){
            alertContainer = $(alertContainerHTML).appendTo("body");
        }
        
        var alertHTML = '<div class="mighty-alert-wrapper">';
            alertHTML += '<div ';
            
            if("id" in options){
				if($("#"+options.id).length < 1){
		            alertHTML += 'id="' + options.id + '"';
	            } else {//an ID was passed, but there is an existing notif with the same ID, don't recreate 1.24.18 KL
		            return false;
	            }
            }
            
            alertHTML += ' class="mighty-alert ' + alertType + '" >';
            alertHTML += '<div class="remove-mighty-alert"><i class="fa fa-times"></i></div>'
            alertHTML += '<div class="mighty-alert-content" data-batch="' + options.batch_id + '">';
            alertHTML += notifContent;
            alertHTML += '</div>';
            alertHTML += '</div>';
            alertHTML += '</div>';
            
        var thisAlert = $(alertHTML).appendTo(alertContainer).each(function(){
            var thisAlert = this;
            setupThisMightyAlert(thisAlert);
            if(!("do_not_dismiss" in options)){//only set this if the do_not_dismiss flag is not passed
	            setTimeout(function(){
	                removeMightyAlert(thisAlert);
	            }, options.ts_dismiss);	            
            }
        });
        
        if(options.hasOwnProperty("first_btn_selector")){
            $(thisAlert).find(options.first_btn_selector).on("click", options.first_callback);
        }
        
    }

    function setupThisMightyAlert(alert){
        var removeBtn = $(alert).find(".remove-mighty-alert");
        $(removeBtn).on("click", function(){
            removeMightyAlert(alert);
        })
    }

    function removeMightyAlert(alert){
        $(alert).fadeOut(function(){
            $(alert).remove()
        })
    }

    function conversationConfirmClientSent(windowChecked, messageObj) {
        //IN THE ACTIVE TAB THAT THE ORIGINAL TEXT WAS SENT FROM GTEXT, WE APPEND A CLOCK IMG URL AND THEN HERE WE DETECT IF IT EXISTS.  IF NOT THEN WE GO TO UPDATETEXTWINDOW AND ADD IT. IF IT DOES EXIST CHANGE THE ICON TO THE BLUE CHECKMARK
        console.log("!!received an ack!! inside of conversationConfirmClientSent()");
        //console.log(messageObj);
        
        var idOfTargetText = messageObj.id;
        var idStr = "#message-id-" + idOfTargetText;
        var textSentFromClient = $(document).find(idStr);
        var sentMessageStatusParent = $(textSentFromClient).find(".textInnerWrapper");
        
        if (textSentFromClient.length > 0) {
            buildMessageStatusIndicator({capi:messageObj, parent: sentMessageStatusParent});
            if(messageObj.status_route < 0){//this is a failed message
                $(textSentFromClient).addClass("failedMessageSend");
            }
            if(messageObj["event_id"] != 0){
                var newMessageHTML = buildMessageHTML(messageObj);
                $(textSentFromClient).fadeOut().replaceWith(newMessageHTML).fadeIn().each(function(){
                    addItemActionsEventHandlers(this, windowChecked, false);
                });
            }
        } else {
            console.error("error in function conversationConfirmClientSent.  This message ID was not found, there is no orange icon to change");
        }
        
    };

    function processContactForComposeSingleText(contactName, contactNumber, contactInput, contactsToSendSMSTo, optionalDontRefocusInTheContactsInput) {
        //CRV this is where we need to validate that to: number.
        
        var numContactsAllowed = 10;
          
        if(isAProUser){
            numContactsAllowed = 25;
        }        
        
        // CRV checks for max number of recipients 
        if ($(contactsToSendSMSTo).children('.contact').length < numContactsAllowed) {
            var manual_num_comma_stripped = contactNumber.replace(',', '');
            manual_num_comma_stripped = manual_num_comma_stripped.replace('\t', '');
            if (isValidPhoneNum(manual_num_comma_stripped)) {
                insertContact(null, false, contactName, contactNumber, contactInput);
                $(contactInput).val('');
            } else {
                triggerCustomConfirm(manual_num_comma_stripped + ' is not a valid phone number', function(){
                    $(contactInput).focus();
                });
                $(contactInput).val(contactNumber.replace('\t', '')); 
            }

        } else {
            
            
            if(isAProUser){
                
                triggerCustomConfirm("You already have selected the max number of recipients (" + numContactsAllowed + ")", function(){return false;})

	  		} else {
                displayNonProUserAlertModal('compose-new-greater-than-10');
                return(false);
            }
            
/*
            triggerCustomConfirm("You already have selected the max number of recipients (10)", function(){$(contactInput).focus()});
            return (false);
*/
        }
        
        if(!optionalDontRefocusInTheContactsInput){//KL added 1.18.18 because we should not refocus in the contacts input if the user is focusing into the message div (to compose the msg body)
	        $(contactInput).focus();	        
        }

    }

    function validateMessageContentBeforeSend(is_sms, messageContent, domElement) {
       
        var messageContent = messageContent.replace(/\n/g, ""); //CRV had to add this line to check if there is JUST <br> in contenteditable div.  This issue arose when we switched from textareas to contenteditable.
            
        if (is_sms) {
            if (messageContent.length < 1) //ok to send blank message on MMS
            {
                triggerCustomConfirm('Message is blank.');
                
                $(domElement).focus();
                                
                return (false);
            }
            if (messageContent.length > 1000) //ok to send blank message on MMS
            {
                triggerCustomConfirm('Message is to long.  Maximum characters is 1000.');
//                 alert('Message is to long.  Maximum characters is 1000');
                
                $(domElement).focus();
                
                return (false);
            }
            //CRV check message length to determine if this message is a good canidate for appending "Sent From MT" message
            return true;
        } else {
            return true;
        } 
    }
    function verifyThatUserWantsToCloseComposeNew(options) {
//     function verifyThatUserWantsToCloseComposeNew(thisComposeNewWindow, contactsToSendTo, messageToBeSent, windowContext) {
        //if the user is trying to close a conversation window, then just check to see if they're in the middle of a message.  So, set the length of contacts to zero for the purpose of this logic
        var thisComposeNewWindow = options.compose_window,
            contactsToSendTo = options.contacts,
            messageToBeSent = options.message,
            context = options.close_context,
            button_action = $(options.button_clicked).attr("action");
                        
        if(options.hasOwnProperty("message_id")){
            var messageID = options.message_id;
        }
            
        var contacts = $(contactsToSendTo).children(".contact").length;
        var message = $(messageToBeSent).html().length;
        var checkForUnsavedDraft = $(thisComposeNewWindow).find(".can-save");
        var attachment = $(thisComposeNewWindow).find("#mms-blob-id-holder").text().length;
        if (context == "Conversation") {
            contacts = 0;
        }
        
        if(checkForUnsavedDraft.length > 0){
            if(attachment > 0){

                if(button_action == "close"){                
            		triggerCustomConfirm('You haven\'t sent this picture message yet.<br></br>Are you sure you want to close this?', function(){$(thisComposeNewWindow).remove();}, 'Yes', function(){return(false);}, 'No', function(){saveAllDraftsInDom();}, 'Save as Draft');
                } else if (button_action == "pop_out"){
            		triggerCustomConfirm('You haven\'t sent this picture message yet.<br></br>Are you sure you want to open this thread in a new window?', function(){openWebAppPopup("quickview", messageID);}, 'Yes', function(){return(false);}, 'No');
                }
                
            } else if ((message > 0) || (contacts > 0)) {
                //there is text content or a contact is selected.
                if(button_action == "close"){
            		triggerCustomConfirm('You haven\'t sent this message yet.<br></br>Are you sure you want to close this?', function(){$(thisComposeNewWindow).remove();}, 'Yes', function(){return(false);}, 'No', function(){saveAllDraftsInDom();}, 'Save as Draft');                
                } else if (button_action == "pop_out"){
            		triggerCustomConfirm('You haven\'t sent this message yet.<br></br>Are you sure you want to open this thread in a new window?', function(){openWebAppPopup("quickview", messageID);}, 'Yes', function(){return(false);}, 'No');
                }
    
            } else {
                if(button_action == "close"){                
                    $(thisComposeNewWindow).remove();            
                } else if (button_action == "pop_out"){
                    openWebAppPopup("quickview", messageID);
                }    
            }           
        } else {
            //There are no contacts selected or text content.  Delete this new message window.
            if(button_action == "close"){
                $(thisComposeNewWindow).remove();
            } else if (button_action == "pop_out"){
                openWebAppPopup("quickview", messageID);
            }
        }
    };

    function setNobleCountSettings() {
        //alert('call function..');
        var max_num_chars = 1000;
        $.fn.NobleCount.settings = {
            on_negative: null,
            on_positive: null,
            on_update: null,
            max_chars: max_num_chars,
            block_negative: true,
            cloak: false,
            in_dom: false
        };
    }

    function initializeNobleCount(messageField, characterCountHolder) {
        //GENERATE A RANDOM INTEGER BETWEEN 1-100
        var randomnumber = Math.floor(Math.random() * 101);
        //assign each compose window's id to a matching pair of a number between 1-100.  The web app uses the generic class, and in place of threads, they use the cleanPhoneNum, but because the CRX allows multiple Compose New, then it is convenient to use it this way.
        $(characterCountHolder).attr("id", "textareaCount_" + randomnumber);
        $(messageField).attr("id", "nobleCount_" + randomnumber);
        var nobleCountTextEntryObject = $(messageField).attr("id");
        var nobleCountCharRemainingObject = $(characterCountHolder).attr("id");
        // build the string for the NobleCount Selector    
        $("#" + nobleCountTextEntryObject).NobleCount("#" + nobleCountCharRemainingObject);
    }

    function processIncomingPhotoTaken(msg, windowToAppendMMSTo) {
        var textWindow = $(windowToAppendMMSTo).find(".conversationHolder"); /*         console.log(msg); */
        var targetPhotoDom = 'photo-' + msg.id;
        var timeStamp = msg.ts_server + ' UTC';;
        console.log(timeStamp);
        var momentDate = moment(timeStamp).format("MMM D, h:mm a");
        console.log(momentDate);
        var textMessage = createHTMLEquivalentOfMessageBody(msg.body);
        var incoming_outgoing
        
        if(msg["inbox_outbox"] == 61){
            incoming_outgoing = "outgoing";
        } else {
            incoming_outgoing = "incoming";
        }
/*
        if (textMessage.length > 0) {
            textMessage = checkMessageContentForURLs(textMessage);
        }
*/
        if (msg.mms_object_key) //picture is now ready to show (uploaded from phone>cloud)
        { /*             alert("picture is now ready to show (uploaded from phone > cloud"); */
            var mms_blob_url = baseUrl + '/imageserve?function=fetchFile&id=' + msg.id;
            updatedDOMImageAtag = "#message-id-" + msg.id;
            if ($(updatedDOMImageAtag).length > 0) //look for the placeholder picture waiting.
            {
                console.log($(updatedDOMImageAtag));
                $(updatedDOMImageAtag).children('#mms-scale-down').children('#fancyimagepopup').attr("href", mms_blob_url).css("margin", "0px");
                $(updatedDOMImageAtag).children('#mms-scale-down').children('#fancyimagepopup').data("blobkey", msg.mms_object_key);
                $(updatedDOMImageAtag).children('#mms-scale-down').children('#fancyimagepopup').children("img").attr("src", mms_blob_url);
                $(updatedDOMImageAtag).find('.textContent').empty();
                $(updatedDOMImageAtag).find('.textContent').html(textMessage);

                var addNewMessageToThisElement = windowToAppendMMSTo;
/*
                addNewMessageToThisElement.animate({
                    scrollTop: addNewMessageToThisElement.prop("scrollHeight") - addNewMessageToThisElement.height()
                }, 1);
*/
                $(updatedDOMImageAtag).find("#forwardMessage").on("click", function() {
                    forwardTheMessage(msg.type, msg.id, textMessage);
                });
                setTimeout(function() {
                    $(addNewMessageToThisElement).scrollTo('max')
                }, 500);
            } else { // in the unlikely event that picture placeholder DOM is not found, append it to top.

/* 			var potentialmessageBody = buildMessageHTML(msg); */
			var potentialMessageBody = '<div class="textWrapper ' + incoming_outgoing + '" id="message-id-' + msg.id + '"><div id="mms-scale-down"><a id="fancyimagepopup" href="' + mms_blob_url + '" data-blobkey="' + msg.mms_object_key + '"> <img class="mmsImage" src="' + mms_blob_url + '" alt="Photo in process"></a></div><div class="textInnerWrapper mightyClearfix"><span class="textContent">' + textMessage + '</span></div><div class="itemActions"><a id="forwardMessage" class="messageAction" data-message-id="' + msg.id + '" data-message-type="' + msg.type + '"><img class="forwardMessage forwardMessageIcon" src="' + forwardImgURL + '"></a><a id="starMessage" data-message-id="' + msg.id + '" class="unstarred messageAction"><img class="unstarredicon" src="' + unstarredImgURL + '"></a><a id="deleteMessage" class="messageAction" data-message-id="' + msg.id + '" data-message-type="' + msg.type + '" data-clean-num="' + msg.phone_num_clean + '"><img class="deleteOneMessage deleteOneMessageIcon " src="' + deleteImgURL + '"></a><span class="textTimeStamp">' + momentDate + '</span></div></div>';

//			console.log('potentialmessagebody');
//			console.log(potentialmessageBody);

//        console.log(windowToAppendMMSTo);

		var addNewMessageToThisElement = $(windowToAppendMMSTo).find('.conversationHolder');
		
//		console.log(addNewMessageToThisElement);
		
		$(potentialMessageBody).appendTo(addNewMessageToThisElement).each(function(){   
            var sentMessageStatusParent = $(this).find("div.textInnerWrapper");             
            addItemActionsEventHandlers(this, windowToAppendMMSTo, false);
            if((incoming_outgoing == "outgoing") && (msg["source_client"] != 30)){//if it was an outgoing text sent from gtext then attach the sent confirmation icon

                $('<div class="sentMessageStatus"><i class="fa fa-clock-o pending" tooltip-content="Waiting for Phone to Send Message"></i></div>').prependTo(sentMessageStatusParent).each(function(){
                    var pendingStatusIcon = $(this).find('i.pending');
                    addToolTipToSentConfirmationIcon(pendingStatusIcon);
                });                
            }
            
            $(this).find("a#fancyimagepopup").on("click", function(e){ e.preventDefault();}).fancybox({
    			type	: 'image',
    			overlay : {
            		css : {
                		'background': 'black',
                		'max-height': '200px'
            		},    // custom CSS properties
            		locked : true   // if true, the content will be locked into overlay
            	}
    		});
            
        })
        
        if(msg["type"] == 21){
            console.log("this is a group mms pic");
            
            if (msg["inbox_outbox"] == 60){
                getContactInfoFromBGScript(msg["content_author"], msg["id"]);
            }
        
        }
    
        setTimeout(function() {
            $(addNewMessageToThisElement).scrollTo('max')
        }, 500);
        
            }
            //CRV set instructions for itemaction hover and fancybox
/*
            var domElement = $('#sms-line-item-msgid-' + msg.id);
            resetThreadResponseAreaAfterNewMessageHasBeenSentFromWebApp(domElement);
*/
        } else //only picture was taken -- not uploaded to server yet...
        { /*             alert("only picture was taken -- not uploaded to server yet"); */
            var addNewMessageToThisElement = textWindow; /*             $(addNewMessageToThisElement).append('<div class="textWrapper incoming" id="message-id-' + msg.id + '"><span class="newPhotoTextContent">Incoming Picture Message (Getting Photo)</span><div id="mms-scale-down" style="height: 60px"><a id="fancyimagepopup" style="margin-left:25px;" href=""><img src="img/loading.gif" alt="Photo in process" style="max-height: 60px;"></a></div></div>').scrollTo('max'); */
            var htmlForMMS = '<div class="textWrapper ' + incoming_outgoing + ' id="message-id-' + msg.id + '"><div class="textInnerWrapper mightyClearfix"><div id="mms-scale-down"><a id="fancyimagepopup" href="' + loadGIFURL + '" data-blobkey="image has not loaded, therefore this does not exist yet."> <img class="mmsImage" src="' + loadGIFURL + '" alt="Photo in process"></a></div><span class="textContent">Incoming Picture Message (Getting Photo)</span></div><div class="itemActions"><a id="forwardMessage" class="messageAction" data-message-id="' + msg.id + '" data-message-type="' + msg.type + '"><img class="forwardMessage forwardMessageIcon" src="' + forwardImgURL + '"></a><a id="starMessage" data-message-id="' + msg.id + '" class="unstarred messageAction"><img class="unstarredicon" src="' + unstarredImgURL + '"></a><a id="deleteMessage" data-message-id="' + msg.id + '" class="messageAction" data-message-type="' + msg.type + '" data-clean-num="' + msg.phone_num_clean + '"><img class="deleteOneMessage deleteOneMessageIcon" src="' + deleteImgURL + '"></a><span class="textTimeStamp">' + momentDate + '</span></div></div>';
            $(htmlForMMS).appendTo(addNewMessageToThisElement).each(function() {
                addItemActionsEventHandlers(this, windowToAppendMMSTo, true);
            });
            setTimeout(function() {
                $(addNewMessageToThisElement).scrollTo('max')
            }, 500);
/*		var image_holder_html = '<div id="' + targetPhotoDom + '" style="height:120px"><a id="fancyimagepopup" style="margin-left:25px;" href=""><img style="vertical-align:middle;height:100%" src="http://www.deckmaster.com.ph/images/loading52.gif" alt="Photo in process"></a></div>';	
    		$("#settingsPane").prepend(image_holder_html);    	*/
        }
    }
    //START OF COMPOSE MMS CODE

    function buildHTMLButtonCanvasMMS(phoneNumClean) {
        var mms_stuff = '';
        mms_stuff += '<div id="upload-image-mms" name="' + phoneNumClean + '" class="mms-feature" ><div class="dcattachicon"><img src="' + photosVideosImgURL + '" alt="attach new file"></img></div></div>'; 
        mms_stuff += '<div id="holder-mms-image-preview" class="mms-feature mightyClearfix" style="display:none;">';
        mms_stuff += '<a id="fancyimagepopup-MMS"><img id="mms-image-preview" class="mms-feature" style="display:none;" src=""></a>';
        mms_stuff += '<img id="mmsPreviewClose" data-window="' + phoneNumClean + '" src="'+ mmsAttachRemove +'" alt="close_preview" width="14" height="14">';
        mms_stuff += '</div>'; //closes holder-mms-preview-image
        mms_stuff += '<span id="mms-blob-id-holder" class="mms-feature" style="display:none"></span>'; //stores blobID to pass in C2DM call when sending MMS
        return mms_stuff;
    }

//NEW FILE UPLOAD CODE 7/1/14 KL
function getImageUploadCode(mmsCanvasAreaTarget){
	
	//$.blockUI({ message: '' });
	//console.error(whichMMSCanvasAreaTarget);
	var urlMighty = baseUrl + '/imageupload';

	$.ajax({
            type:"GET",
            url:urlMighty,
            //dataType: "json",
			xhrFields: { withCredentials: true},
           	timeout:5000,
            success: function(resp,textStatus,jqXHR) {
				
				console.log(resp);
				
				//$('#fileupload').attr('data-url', resp);				
				
				
//				setListenerForFileUploadEvent(resp);
									
				//loadXdmDynamicallyThenCallAjaxFileUpload(resp); //send the URL that we were given
	            //$.unblockUI();
	            invokeMMSDialogBox(mmsCanvasAreaTarget, resp);
            },
            error: function(jqXHR, textStatus, errorThrown){
	           // _gaq.push(["_trackEvent","WebApp","AjaxError","getImageUpload-" + errorThrown,1]);
	            alert('/imageupload error');
	            //$.unblockUI();
	            //console.log('error in getImageUploadCode');
            }

    });
	
	return false;
}


    function setListenerForFileUploadEvent(serverResponse){

		$('#mms-file-attach').fileupload({
        	url: serverResponse,
            dataType: 'json',
            headers: {'file-upload-method': 'new-library' },
            autoUpload: false,
            add: function (e, data) {
        		if(doesFileMeetSizeRequirements(data))
        			{
        				$('#file-upload-progress-indicator').show();
        				data.submit();
        			}            
                else
                	{
                    	return(false);
                	}
            },
            done: function (e, data) {

                console.log("UPLOAD SUCCEEDED!!!");
                console.log(e);
                console.log(data);
            
        		if (data["result"]["status"] != "success"){
                	alert("Error uploading attachment");            		
        		} else {
    
                    var blobID = data.result.blobID;
                                    
                    //console.log(response); 
    /*                         alert("success of local file upload"); */
                    $('#mms-dialog-button-ok').attr('disabled', false);
                    $('#mms-dialog-button-ok').show().focus();
                    $('#mms-dialog-button-ok').css('color', 'white').css('margin-left', '10px');
                    $('#file-upload-progress-indicator').hide();
                    $('#file-just-uploaded').attr("src", baseUrl + "/imageserve?function=viewFile&blob-key=" + blobID);
                    $('#file-just-uploaded').show();
                    $('#file-uploaded-temp-blobid-holder-in-dialog').text(blobID); // store in dialog first. if user clicks OK, then store it in DOM next to MMS send button

                	$('#mms-file-attach').hide();
    
                }

            }
        });

    }

    function invokeMMSDialogBox(whichMMSCanvasAreaTarget, dynamic_url_for_file_upload) {
        //domObjectOfAttachmentButtonClick -- so we know where to pass the MMS blob stuff back into (which thread)
        refreshMMSDialogBox(whichMMSCanvasAreaTarget, dynamic_url_for_file_upload);
        
/*         if(currentLocation == "Outlook"){ */
        $('#mms-upload-dialog').appendTo("body");

        
        $('#mms-upload-dialog').modal({
            keyboard: true
        });
        $('#mms-upload-dialog').on('shown', function() {
            $('#mms-dialog-button-ok').hide();
            $('#mms-dialog-button-ok').attr('disabled', true);
            $('#mms-dialog-button-ok').css('color', '#BFBFBF');
            $('#mms-dialog-button-ok').removeClass('hover');
        });
        //CRV if one of the side navigation icons is clicked, we must dismiss the modal
    }

    function refreshMMSDialogBox(whichMMSCanvasAreaTarget, dynamic_url_for_file_upload) {
        //domObjectOfAttachmentButtonClick -- so we know where to pass the MMS blob stuff back into (which thread)
        
        $('#mms-upload-dialog').empty();
        var buildMMSDOM = '';
        //DC Added close icon instead of "x"
        buildMMSDOM += '<div class="modal-header mightyClearfix"><h3 id="myModalLabel">Attach a Picture (MMS)</h3></div>'; //MA added BOOTSTRAP Modal
        /* buildMMSDOM += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button><h3 id="myModalLabel">Attach a Picture (MMS)</h3></div>'; */
        //MA added BOOTSTRAP Modal
        
        buildMMSDOM += '<form id="frmUpload" method="POST" target="upload_target" enctype="multipart/form-data"> <input id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="104" type="hidden" /><input id="mms-file-attach" type="file" name="myFile"/><input type="submit" id="btnSubmit" style="display:none" value="Upload file"/></form>'; 
        
        
        /* buildMMSDOM += '<form id="frmUpload" style="font-size:20px" method="POST" target="upload_target" enctype="multipart/form-data"> <input id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="104" type="hidden" /><input id="mms-file-attach" type="file" name="myFile" onchange="autoSubmitUploadButtonMMSFile();"/><input type="submit" id="btnSubmit" style="display:none" value="Upload file"/></form>'; */


        //DC Added class masterSpinner to control spinner with each theme
        buildMMSDOM += '<div id="file-upload-progress-indicator" style="display:none;" class="loadingMessages masterSpinner"><img src="' + mightyLoadingGifURL + '"/></div>'; /* buildMMSDOM += '<br><img id="file-upload-progress-indicator" style="display:none;margin-left:35px;margin-bottom:20px;" src="assets/green_spinner.gif">'; */
        buildMMSDOM += '<div id="mms-upload-image-preview-pane">'; /* buildMMSDOM += '<div id="mms-upload-image-preview-pane" style="max-height:200px;padding:20px;display:inline-block">'; */
        buildMMSDOM += '<img id="file-just-uploaded" style="display:none;" src="">';
        buildMMSDOM += '<span id="file-uploaded-temp-blobid-holder-in-dialog" style="display:none"></span>';
        buildMMSDOM += '</div>';
/*
buildMMSDOM += '<img id="file-just-uploaded" style="display:none;vertical-align:middle;float:left;margin-top:10px;max-height:inherit" src="">';
buildMMSDOM += '<span id="file-uploaded-temp-blobid-holder-in-dialog" style="display:none"></span>';
buildMMSDOM += '</div>';
*/
        //closes div mms-upload-image-preview-pane
        //DC Added class "btn" to "use this picture"
        buildMMSDOM += '<div class="modal-footer"> <button class="btn cancel" data-dismiss="modal" aria-hidden="true">Cancel</button><button id="mms-dialog-button-ok" class="mightyButton btn">Use this picture</button></div>'; /* buildMMSDOM +='<div class="modal-footer"> <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button><button id="mms-dialog-button-ok" class="mightyButton">Use this picture</button></div>'; */
/*
        console.log("------------------from inside refreshMMSDialogBox-----------------------");
        console.log(buildMMSDOM);
*/
        $('#mms-upload-dialog').html(buildMMSDOM).each(function(){
            //after we append the html, we have to set the event listener for the fileupload event.  so that when a user selects a file and the onchange event of input#mms-file-attach triggers the $.fileupload() method. 7/1/14 KL
    		setListenerForFileUploadEvent(dynamic_url_for_file_upload);
        
        });
        //MA added dec 11:
  
        if(currentLocation == "Facebook"){
            $("#mms-file-attach").addClass("fb");
        }
                
        $('#mms-dialog-button-ok').click(function() {
            //whichMMSCanvasAreaTarget is CRITICAL - it will tell us which MMS canvas area to push MMS content back to (in the case of PowerView)
/*             console.log(whichMMSCanvasAreaTarget); */
/*             yytest = whichMMSCanvasAreaTarget; */
            $(whichMMSCanvasAreaTarget).children('#mms-blob-id-holder').text($('#file-uploaded-temp-blobid-holder-in-dialog').text()); //move just uploaded Blob ID from dialog span to span in main page for preparing to send.
            var image_url_preview_from_mms_dialog_popup = $('#file-just-uploaded').attr("src");
            $(whichMMSCanvasAreaTarget).find('#mms-image-preview').show(); //we use FIND because it's a couple levels down
            $(whichMMSCanvasAreaTarget).find('#mms-image-preview').attr("src", image_url_preview_from_mms_dialog_popup);
            var objRelevantTextMessageBox = $(whichMMSCanvasAreaTarget).siblings('.textResponse');
            console.log(objRelevantTextMessageBox);
            //yytest = objRelevantTextMessageBox;
            var heightOfRelevantTextMessageBox = objRelevantTextMessageBox.height();
            var widthOfRelevantTextMessageBox = objRelevantTextMessageBox.width();
            
            console.log(this);
            
            $(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview').show();
            //reduce width of text message entry box by 20%
            objRelevantTextMessageBox.width(0.8 * widthOfRelevantTextMessageBox);
            $(whichMMSCanvasAreaTarget).find('div#upload-image-mms').hide(); //remove attach paperclip icon for this box now that we have set an image
            //$( this ).dialog( "close" );
                //! append mms image
            $(whichMMSCanvasAreaTarget).find("a#fancyimagepopup-MMS").attr("href", image_url_preview_from_mms_dialog_popup);
            $(whichMMSCanvasAreaTarget).find("a#fancyimagepopup-MMS").on("click", function(e){
                e.preventDefault();
            }).fancybox({
    			type	: 'image',
    			overlay : {
            		css : {
                		'background': 'black',
                		'max-height': '200px'
            		},    // custom CSS properties
            		locked : true   // if true, the content will be locked into overlay
            	}
    		});
    		
    		$("#mmsPreviewClose").on("click", function(e){
                removeMMSDraft(this);
    		});
    		
            $('#mms-upload-dialog').modal('hide');
        
    		//Update draft state if user attaches an image
    		var draftIcon = $(whichMMSCanvasAreaTarget).parent().siblings('.save-draft-button-holder').children('.save-draft-icon');
    		toggleDraftSaveState(draftIcon, true);
        
        });
        
        //KL ADDED CODE HERE
        $("#mms-file-attach").on("change", function() { 
            autoSubmitUploadButtonMMSFile();
        });
/*
        $("#btnSubmit").on("click",function(){
            autoSubmitUploadButtonMMSFile();
        });
*/    }

    function removeMMSDraft(removeMMSButton){
		//CRV if user clicks on the close button for an MMS draft, we need to clean, and revert the response area.  This code was taken from resetThreadResponseAreaAfterNewMessageHasBeenSentFromWebApp function. 

		var thisWindowID = $(removeMMSButton).data("window");
		
		$("div[data-window='" + thisWindowID + "']").remove();
		
		console.log($("div[data-window='" + thisWindowID + "']"));

    	//Update draft state if user attaches an image
    	var draftIcon = $(removeMMSButton).siblings('.save-draft-button-holder').children('.save-draft-icon');
    	toggleDraftSaveState(draftIcon, true);
		
		$(removeMMSButton).parent().parent().html(buildHTMLButtonCanvasMMS('4444444')).find("#upload-image-mms").each(function() {
            console.log(this);
            addMMSButtonFunctionality(this);
        });;		
	}

//OLD
/*
    function autoSubmitUploadButtonMMSFile() {
        //alert($('#mms-file-attach')[0].files[0].size);
        if ((typeof FileReader !== "undefined") && ($('#mms-file-attach')[0].files[0].size > 2097152)) //can only do in HTML5, hence FileReader check
        alert('File too large. File upload limit is 2MB');
        else { 
//            alert("about to submit form");
            $('#frmUpload').submit();
        }
    };
*/
//NEW
    function autoSubmitUploadButtonMMSFile() {
                
        $('#mms-file-attach').fileupload();
    
    };

    //END of MMS CODE

    function checkMessageContentForURLs(messageContent) {
        var s = messageContent;
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        textMessageContent = s.replace(exp, "<a href=\"$1\" target=\"_blank\">$1</a>");
        textMessageContent = textMessageContent.replace(/(^|\s)@(\w+)/g, "$1@<a href=\"http://www.twitter.com/$2\" target=\"_blank\">$2</a>");
        return textMessageContent;
    };

    function star_click(this_anchor) {
        //alert(msg_id_to_star);
        //alert($(this_anchor).attr("id"));
        $(this_anchor).tooltip('destroy');
        var msgid_star_update = $(this_anchor).data("message-id");
        // PREPENDED the <A id=> with STAR-, so get the message id after the prepend "STAR-"
        var urlMighty = baseUrl + '/api?function=updateMsgInfo';
        //urlMighty += '&id=' + encodeURIComponent(msgID);
        if ($(this_anchor).hasClass("starred")) {
            $(this_anchor).removeClass("starred");
            $(this_anchor).addClass("unstarred");
            //CRV moved these style changes to BEFORE the ajax call.  Now we change them back if the call has failed.
            $.ajax({
                type: "GET",
                url: urlMighty,
                dataType: "json",
                /*                 jsonpCallback: "make_unstarred", */
                data: {
                    id: msgid_star_update,
                    is_starred: 0
                },
                success: function(resp) {
                    //console.log(resp.updated);
                    if (resp.updated == false) {
                        //CRV if call is unsuccessful, revert the class changes.
                        $(this_anchor).removeClass("unstarred");
                        $(this_anchor).addClass("starred");
                        alert("Error - Message not Un-Favorited. Please report to MightyText team (Error Code: UNFAV7411)");
                        return;
                    }
                    //Once the request has succeed - change the icon.
                    $(this_anchor).find("img").attr("src", unstarredImgURL);
                }
            }).responseText;
        } else {
            $(this_anchor).removeClass("unstarred");
            $(this_anchor).addClass("starred");
            $.ajax({
                type: "GET",
                url: urlMighty,
                dataType: "json",
                /*                 jsonpCallback: "make_starred", */
                data: {
                    id: msgid_star_update,
                    is_starred: 1
                },
                success: function(resp) {
                    //console.log(resp.updated);
                    if (resp.updated == false) {
                        //CRV if the call has failed - revert the classes
                        $(this_anchor).removeClass("starred");
                        $(this_anchor).addClass("unstarred");
                        alert("Error - Message not Favorited. Please report to MightyText team (Error Code: FAV3985)");
                        return;
                    }
                    // CRV upon call success - change the image
                    $(this_anchor).find("img").attr("src", starredImgURL);
                }
            }).responseText;
        }
        $(".starred").tooltip({
            trigger: "hover",
            title: "Un-Favorite",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }
        });
        $(".unstarred").tooltip({
            trigger: "hover",
            title: "Favorite",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }
        });
    }

    function deleteSingleMessage(msg, msgID, clean_phone_num, msgType, composerWindow) {
        var urlMighty = baseUrl + '/api';
/*         urlMighty += '&id=' + encodeURIComponent(msgID) */
        
        var postVarBuilder = 'function=deleteMessagesByMsgID&id=' + encodeURIComponent(msgID);
        
        var bodyContent = $.ajax({
            url: urlMighty,
            global: false,
            type: "POST",
            data: postVarBuilder,
            dataType: "json",
            /*             jsonpCallback: "deleteOneMsg", */
            success: function(json_data) {
                console.log(json_data);
                console.log("-------------NUM DELETED------------");
                console.log(json_data.num_deleted);
                if (json_data.num_deleted != 1) {
                    alert("Error - Message not Deleted. Please report to MightyText team (Error Code: DT56)");
                    return;
                }
                //Get the the number of messages in the thread BEFORE the message was deleted
                var string_span_build_update_thread_count = $(composerWindow).find(".conversationHolder").data("message-count");
                if (string_span_build_update_thread_count == 1) {
                    //removeThreadFromThreadList(clean_phone_num);
                    $(composerWindow).remove();
                } else {
                    //decrement thread count in threadlist
                    if ((msgType == 10) || (msgType == 11)) //only change thread counter on left nav if it's an MMS or SMS getting deleted
                    {
                        string_span_build_update_thread_count = string_span_build_update_thread_count - 1;
                        $(composerWindow).find(".conversationHolder").data("message-count", string_span_build_update_thread_count);
                    }
                }
                console.log('single messsage Deleted');
/*
                if (threadDisplayModeGlobal == 'MEDIA') {
                    dom_item_to_remove_from_thread = '#media_item_' + msgID;
                }
*/
                $(msg).fadeOut(600, function() {
                    $(this).remove();
                });
            },
            error: function() {
                console.error("ERROR IN DELETE SINGLE MESSAGE");
            }
        }).responseText;
    }

    function forwardTheMessage(messageType, messageID, optionalContent) {
        console.log("--------------inside of forwardTheMessage-------------");
        console.log(messageType);
        
        console.log(optionalContent);
        
        var arrayOfComposeWindows = new Array();
        var messageContent = '';
        var cleanOptionalContent = createHTMLEquivalentOfMessageBody(optionalContent);
        
        $('.composeButton').trigger("click"); //Open New Message window first.
        $(".composeInnerContainer.composeNew").each(function() {
            arrayOfComposeWindows.push(this);
        });
        
        var currentMessageTextArea = $(arrayOfComposeWindows[0]).find(".messageToSend");
        var currentComposeHeader = $(arrayOfComposeWindows[0]).find(".title");
        
        console.log(cleanOptionalContent);

        if (messageType == 'share') {
            messageContent = cleanOptionalContent;
        } else if ((messageType == 10) || (messageType == 20)) {
            //10 = sms
            messageContent = 'Fwd: ' + cleanOptionalContent;
            //messageContent = removeAnchorTags(messageContent);
        } else if ((messageType == 70) || (messageType == 11) || (messageType == 21)) {
            //70 = mms
            messageContent = 'Fwd: ' + cleanOptionalContent;
            var srcMMS = $('#message-id-' + messageID).children('#mms-scale-down').children('#fancyimagepopup').attr('href');
            console.log(srcMMS);
            var blobID = $('#message-id-' + messageID).children('#mms-scale-down').children('#fancyimagepopup').attr('data-blobkey');
            console.log(blobID);
            var whichCanvasAreaTarget = $(arrayOfComposeWindows[0]).find(".sendMMS");
            console.log(whichCanvasAreaTarget[0]);
            sendMediaAsMMS(whichCanvasAreaTarget, blobID, srcMMS);
/*
        } else if (messageType == 80) {
            //80 = incoming call
            var contactName = $('#sms-line-item-msgid-' + messageID).parent().siblings('.contentPanelHeader').children('.contentPanelHeaderText').text();
            var timeStamp = $('#sms-line-item-msgid-' + messageID).children('.itemActions').children('.timestamp-msg').text();
            messageContent = 'Fwd: Incoming Call from ' + contactName + ' at ' + timeStamp;
        } else if (messageType == 81) {
            //81 = missed call
            var contactName = $('#sms-line-item-msgid-' + messageID).parent().siblings('.contentPanelHeader').children('.contentPanelHeaderText').text();
            var timeStamp = $('#sms-line-item-msgid-' + messageID).children('.itemActions').children('.timestamp-msg').text();
            messageContent = 'Fwd: Missed Call from ' + contactName + ' at ' + timeStamp;
        } else if (messageType == 83) {
            //83 = outgoing call
            var contactName = $('#sms-line-item-msgid-' + messageID).parent().siblings('.contentPanelHeader').children('.contentPanelHeaderText').text();
            var timeStamp = $('#sms-line-item-msgid-' + messageID).children('.itemActions').children('.timestamp-msg').text();
            messageContent = 'Fwd: Outgoing Call to ' + contactName + ' at ' + timeStamp;
*/
        } else {
            return (false);
        }

        $(currentComposeHeader).text('Forward Message');
        $(currentMessageTextArea).html(messageContent);
        
    }

    function sendMediaAsMMS(whichMMSCanvasAreaTarget, MediaBlobID, MediaSrc, media_type) { /* 		_gaq.push(["_trackEvent","WebApp","Fwd-Photo-As-MMS",media_type]); */
        //whichMMSCanvasAreaTarget is CRITICAL - it will tell us which MMS canvas area to push MMS content back to (in the case of PowerView)
        console.log(whichMMSCanvasAreaTarget);
        //yytest=whichMMSCanvasAreaTarget;
        $(whichMMSCanvasAreaTarget).children('#mms-blob-id-holder').text(MediaBlobID); //move just uploaded Blob ID from dialog span to span in main page for preparing to send.	
        //var image_url_preview_from_mms_dialog_popup = $('#file-just-uploaded').attr("src");
        var image_url_preview_from_mms_dialog_popup = MediaSrc;
        $(whichMMSCanvasAreaTarget).find('#mms-image-preview').show(); //we use FIND because it's a couple levels down 
        $(whichMMSCanvasAreaTarget).find('#mms-image-preview').attr("src", image_url_preview_from_mms_dialog_popup);
        //var objRelevantTextMessageBox = $('#holder-mms-image-preview').parent().parent().parent().find('.textResponse');

//WHY ARE WE ADJUSTING THE WIDTH OF THE TEXT RESPONSE AREA HERE??????
        var objRelevantTextMessageBox = $(whichMMSCanvasAreaTarget).siblings('.textResponse');
        console.log(objRelevantTextMessageBox);
        //yytest = objRelevantTextMessageBox;
        var heightOfRelevantTextMessageBox = objRelevantTextMessageBox.height();
        var widthOfRelevantTextMessageBox = objRelevantTextMessageBox.width();
        $(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview').show()/*
		$(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview').css("max-height",heightOfRelevantTextMessageBox);
		$(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview').css("max-width",0.2 * widthOfRelevantTextMessageBox); 
*/
        //reduce width of text message entry box by 20%
        objRelevantTextMessageBox.width(0.8 * widthOfRelevantTextMessageBox);

        $(whichMMSCanvasAreaTarget).find('div#upload-image-mms').hide(); //remove attach paperclip icon for this box now that we have set an image
        //$( this ).dialog( "close" );
        $(whichMMSCanvasAreaTarget).find("a#fancyimagepopup-MMS").attr("href", image_url_preview_from_mms_dialog_popup);
        $(whichMMSCanvasAreaTarget).find("a#fancyimagepopup-MMS").on("click", function(e){
            e.preventDefault();
        }).fancybox({
			type	: 'image',
			overlay : {
        		css : {
            		'background': 'black',
            		'max-height': '200px'
        		},    // custom CSS properties
        		locked : true   // if true, the content will be locked into overlay
        	}
		});
		console.log(whichMMSCanvasAreaTarget);
        //$('#mms-upload-dialog').modal('hide'); 
    }

    function addItemActionsEventHandlers(textMessage, chatWindow, downloadingMMS) {
        
        var unstarredButton = $(textMessage).find(".unstarred");
        var forwardButton = $(textMessage).find("#forwardMessage");
        var starredButton = $(textMessage).find(".starred");
        var deleteButton = $(textMessage).find("#deleteMessage");
        var itemActions = $(textMessage).find(".itemActions");
        var textBody = $(textMessage).find(".textContent");
        var sanitizedTextBody = sanitizeTextResponse(textBody);
//        console.log(sanitizedTextBody);

        $(unstarredButton).on("click", function() {
            console.log("star clicked");
            star_click(this);
        }).tooltip({
            trigger: "hover",
            title: "Favorite",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }
        });
        $(starredButton).on("click", function() {
            console.log("un-star clicked");
            star_click(this);
        }).tooltip({
            trigger: "hover",
            title: "Un-Favorite",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }
        });
        $(forwardButton).on("click", function() {
            console.log("forward clicked");
            if (!downloadingMMS) {
                //WHEN DOWNLOADING AN MMS FOR THE FIRST TIME THE MESSAGE CONTENT THAT WILL BE PASSED TO THE FORWARD MESSAGE FUNCTION IS INCORRECT.  IT IS THE DEFAULT "INCOMING MMS BLAH BLAH BLAH..." SO I RESET THIS AGAIN WHEN THE IMAGE DOWNLOADS. 
                forwardTheMessage($(this).data("message-type"), $(this).data("message-id"), sanitizedTextBody);
            }
        }).tooltip({
            trigger: "hover",
            title: "Forward",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }
        });
        $(deleteButton).on("click", function() {
            console.log("delete clicked");
            deleteSingleMessage(textMessage, $(this).data("message-id"), $(this).data("clean-num"), $(this).data("message-type"), chatWindow)
        }).tooltip({
            trigger: "hover",
            title: "Delete",
            placement: "bottom",
            delay: {
                show: 150,
                hide: 100
            }
        });
    }
    
    function addTooltipToComposeHeader(composeHeader){
        var tooltipContent = $(composeHeader).text();
        $(composeHeader).tooltip({
            trigger: "hover",
            title: tooltipContent,
            placement: "top",
            delay: {
                show: 150,
                hide: 100
            }
        });

    }; 
    
    function addToolTipToSentConfirmationIcon(tooltipTarget){
        
        var tooltipOptions = {
                trigger: "hover",
                title: "Waiting for Phone to Send Message",
                placement: "bottom",
                delay: {
                    show: 150,
                    hide: 100
                }
            };

        $(tooltipTarget).each(function(index, item){
            tooltipOptions.title = $(item).attr("tooltip-content");
            $(item).tooltip("destroy");//remove any existing tooltips on this status icon first.
            $(item).tooltip(tooltipOptions);
        })
            
    }
    
    function addScheduledEventCancelCapability(scheduledMessage){

        $(scheduledMessage).find(".cancelScheduledMess").on("click", function(){
            //SET CLICK HANDLER FOR REMOVE SCHEDULER BUTTON
            //this click should open the web app in a new tab to the events view


		if(!isAProUser)
			{
/* 				notProUserNotify('cancel-scheduled-message'); */
                triggerCustomConfirm("Sorry, you must be a MightyText Pro user to cancel this message.");
				return(false);	
			}
		
            var eventID = $(scheduledMessage).find("i.moreInfoStatus").attr("data-eventid");

    		triggerCustomConfirm("Are you sure you want to cancel this scheduled message?", function(){cancelThisEvent(eventID)}, "Yes", function(){return false;}, "No");

        });
        
    }


    function updateBatteryStatusDisplay(batt_level, batt_charging_icon, timeStamp, unixTimeStamp, tourBatStat) {
        var newGmailUICheck = $(document).find("#gbzw");
        var batt_level_display = Math.round(batt_level); /* 	console.log('updating battery Status'); */
        var insertedBatStat = '';
        var regularBatStat = '<div class="baticon"><img src="' + phoneImgURL + '"></div><div class="gTextBattery"><div class="batwrap"><div class="batshell"><div class="batbar" style="width:' + batt_level + '%"></div></div><div class="batnub"></div></div><div class="batpercent">' + batt_level_display + '%</div></div>' + batt_charging_icon;
        
        insertedBatStat = regularBatStat;

        $('.newbatterywrap').empty().append(insertedBatStat).show().fadeIn('slow', function() {
        
            var gTextBattery = $(this).find("div.gTextBattery");
            var navBarHeight = $("div#gbz").height();
            var batStatHeight = $(".newbatterywrap").height();
            var smartTopMargin = String((navBarHeight - batStatHeight)/2)+"px";
            var battStatusTTOptions = {
                trigger: 'hover',
                title: '<img style="position:relative;top:4px;height:16px;width:16px;" src="' + logoImgURL + '"/>&nbsp;&nbsp;(As of ' + timeStamp + ')',
                html: true,
                placement: 'bottom',
                delay: {
                    show: 300,
                    hide: 100
                }
            }
            
            $(this).css("display", "inline-block");
            
            if(tourBatStat == "insert dummy stat"){
//                insertedBatStat = dummyBatStat;
                $(".gTextBattery").append('<div id="fakeBatStatNotif">(This battery level is just for show)</div>');
            } else {
    
            }
            
            
            if(newGmailUICheck.length != 0) {//only mess with margin top if it is the old ui.
                $(".newbatterywrap").css("margin-top", smartTopMargin); 
            }
            
            $(this).tooltip('destroy').tooltip(battStatusTTOptions);
            
            if (batt_level >= 100) {
                $('.batbar').css('background-color', '#67b422');
                $('.batnub').css('background-color', '#67b422');
            } else if (batt_level >= 60) {
                $('.batbar').css('background-color', '#67b422');
            } else if (batt_level >= 20 && batt_level <= 59) {
                $('.batbar').css('background-color', '#ffe400');
                $('.batpercent').addClass('legible');
            } else if (batt_level <= 19) {
                $('.batbar').css('background-color', '#f02828');
            }
            
            $(this).attr("id", unixTimeStamp);
            
        });
    };

    function togglePageTitle(originalPageTitle, messageToToggle){
        var currentPageTitle = document.title;

        console.log(currentPageTitle);
        console.log(messageToToggle);    
            
        if(currentPageTitle != messageToToggle){
//             $('title').text(messageToToggle);
            document.title = messageToToggle;
        } else {
//             $('title').text(originalPageTitle);
            document.title = originalPageTitle;
        }
        
    };

    function clearPageTitleToggle(normalPageTitle){
        clearInterval(pageTitleToggle);
        pageTitleToggle = 0;
        $('title').text(normalPageTitle);
        console.log("stop toggle!" + new Date());

    }

    function notifyUserOfNewContentInInactiveTab(optionalStop, messageToToggle){
        var originalPageTitle = $('title').text();
        var normalPageTitle = $('title').attr("original");
        //CREDIT: http://stackoverflow.com/questions/11693618/detect-change-in-document-title-via-javascript?rq=1
        var target = document.querySelector('head > title');

        if(optionalStop == "stop"){

            clearPageTitleToggle(normalPageTitle);

        } else{
            
            detectNonGTextInitiatedChangesToPageTitle(messageToToggle, normalPageTitle);
            pageTitleToggle = setInterval(function(){
//                 console.log("interval is going");
                togglePageTitle(originalPageTitle, messageToToggle);
            }, 1000);
            setTimeout(function(){clearPageTitleToggle(normalPageTitle)}, 60000);
        }     
        //WHEN YOU COME BACK ADD THE CAPABILITY TO CLEAR THIS INTERVAL WHEN A GTEXT TAB BECOMES ACTIVE.  AND THEN FIGURE OUT HOW TO DETECT WHEN TITLE ELEMENT TEXT IS CHANGED.
        //just set pagetitle toggle as a global variable.  Now I am going into the background script to add a listener for any tabs that become active.
    };    
    
    function detectNonGTextInitiatedChangesToPageTitle(messageToToggle, normalPageTitle){
    //CREDIT: http://stackoverflow.com/questions/11693618/detect-change-in-document-title-via-javascript?rq=1

        if(!listeningForChangeInPageTitle){
        
        var target = document.querySelector('head > title');
        
        var observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var newTitleContent = mutation.target.textContent;
                var isThisNewContentOurMessage = checkIfThisIsOurPageTitleMessage(newTitleContent);
                
//                console.log(isThisNewContentOurMessage)
                                
                if((!isThisNewContentOurMessage) && (newTitleContent != normalPageTitle)){
                    clearInterval(pageTitleToggle);
                    $("title").attr("original", newTitleContent);
                }
                
            });
        });    
        
            observer.observe(target, { subtree: true, characterData: true, childList: true });
            listeningForChangeInPageTitle = true;

        }
        
    };

    function checkIfThisIsOurPageTitleMessage(newTitleContent){
        //this is an array of possible messages we send to the content script from the background to be toggled in the page title.
        var arrayOfPossiblePageTitleMessages = ["New Message", "New Group Message", "Incoming Call", "Missed Call"];
        var check = false
        
        $(arrayOfPossiblePageTitleMessages).each(function(){
            if(newTitleContent.indexOf(this) > -1){
                check = true;
            }
        })
                
        return check;        
/*
        if(arrayOfPossiblePageTitleMessages.indexOf(newTitleContent) > -1){
            return true;
        } else {
            return false;
        }
*/
                
    }

    function checkIfUserHasCurrentAPK(userAPKVersion) {
        //alert('checkIfUserHasCurrentAPK');
        //CRV build in a 0.05 buffer to the current version # so that the user is only alerted if they are two or more versions behind. 
        var androidAPKVersionToTestFor = currentAndroidAppVersion - 0.05;
        //alert(androidAPKVersionToTestFor);
        if (userAPKVersion < androidAPKVersionToTestFor) {
            //CRV implemented logic to make sure that the user is only alerted 20% of the time to update their current version
            var randomChance = Math.floor(Math.random() * 5) + 1;
            console.log(randomChance);
            if (randomChance == 3) { /* 						var alertText = 'It looks like you are running an older version of MightyText on your phone (' + userAPKVersion + ').  Please <a href="https://play.google.com/store/apps/details?id=com.texty.sms&feature=nav_result#?t=W251bGwsMSwxLDMsImNvbS50ZXh0eS5zbXMiXQ.." target="_blank">upgrade to the newest version (' + currentAndroidAppVersion + ') from Google Play</a>.'; */
                alert('It looks like you are running an older version of MightyText on your phone (' + userAPKVersion + ').  Please <a href="https://play.google.com/store/apps/details?id=com.texty.sms&feature=nav_result#?t=W251bGwsMSwxLDMsImNvbS50ZXh0eS5zbXMiXQ.." target="_blank">upgrade to the newest version (' + currentAndroidAppVersion + ') from Google Play</a>.'); /* 						displayAlertMessage(alertText, 'success', 10000); */
            }
        }
    }
    
    function cleanTimeDisplayPurposes(datestring, should_convert_utc, optionalShouldReturnShorterDate, optionalLineBreak){
        //CRV get the timestamp at midnight of the current day
        var now = new Date();
        var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0);
        console.log('seconds since midnight');
        console.log(midnight);
        
        
        
        if (should_convert_utc)
        	datestring = datestring + ' UTC'; // this tells JS to convert it to local once you give it to the Date() function
        
        var a_p = "";
        var d = new Date(datestring);
        
        //CRV calculate the difference (in hours) between the timestamp that was passed into the function and the "Midnight" timestamp calculated above.
        var a = moment(midnight);
        var b = moment(d);
        var numberOfHoursSinceMidnight = b.diff(a, 'hours', true); //CRV must pass true to keep this number from being rounded
        
        
        if(optionalShouldReturnShorterDate) 
        	{
        // CRV if user has specified to have Short Hand times returned AND the timestamp passed to the function occured today, return the shorter, just time, time stamp string.
        		if(numberOfHoursSinceMidnight > 0)
        			{
                        dateStr = moment(d).format("h:mma");
        			}
        		else
        			{
        //CRV if the user has requested the shorter time stamp but the timestamp did not occur today, then return just the DATE			
                        dateStr = moment(d).format("MMM DD");
        			}
        		
        	} else if ((typeof optionalLineBreak != "undefined") && (optionalLineBreak)){
                dateStr = moment(d).format("MMM DD") + "<br>" + moment(d).format("h:mma");
        	} else {//CRV else, return the entire, date + time timestamp string
                dateStr = moment(d).format("MMM DD h:mma");
        	}
        
        return dateStr;
        
    }

    
    function tellBackgroundScriptToRunAllTabs(message){
        chrome.runtime.sendMessage({
            supportMultipleAccounts: message
        }, function(response) {
            console.log(response.confirmation);
        });
    }
        
    function getServerSettingsForNonMightyAccountTab(){
        chrome.runtime.sendMessage({
            getUserSettingsContent: true
        }, function(response) {
            console.log(response.confirmation);
        });
    }

    function openWebAppPopup(view, messageID){
        console.log({"messageID":messageID});
        chrome.runtime.sendMessage({
            openMightyTextIntelligently: true,
            viewToOpen: view,
            numberOfConversationToOpen: messageID
        }, function(response) {
            console.log(response.confirmation);
        });                
    }


    function getProperQuickReplyWidth(){
    //made this change in March 2014 because Chrome for Windows added additional border around windows...
    	
        var chromeAppVersion = window.navigator.appVersion;
        
        if(chromeAppVersion.indexOf("Macintosh") > -1){
            windowWidth = 500;
        } else {
            windowWidth = 516;
        }
    
    	return(windowWidth);
    
    };

    function checkIfGrowlExists(content, notifType){
    
/*
        console.log({
            "message":"inside of checkifgrowlexists",
            "looking_for...": content
        });
*/

        var growlExists = false;

        $(".bootstrap-growl").each(function(){
            var existingNotifsText = $(this).html();
            
            console.log({
                "existing": existingNotifsText,
                "message":content
            });
            
            if(existingNotifsText.indexOf(content) > -1){                
                growlExists = true;
            }

        });
        
        var existingNotifsWithThisType = $("#"+notifType);
        
        console.log(existingNotifsWithThisType);
        
        if(existingNotifsWithThisType.length > 0){
            growlExists = true;
        }
        
        return growlExists;
    
    }

    function initializeInfoModal(options){
                
        var notifID = options.id,
            message = options.message,
            messageID = options.message_id,
            infoType = options.type;
            
        var notifDismissImg = chrome.extension.getURL("img/fb_notif_close.png"),
            existingNotif = $("#" + notifID),
            growlDestination = $("ul._50d1"),
            modalClassStr = "_3sod _3soe alert-info mightyFBNotif";

        if(typeof infoType != "undefined"){
            modalClassStr += " " + infoType;
        }
        
        $(growlDestination).removeClass("hidden_elem");
        
        if(existingNotif.length < 1){

            $('<li class="' + modalClassStr + '" id="'+ notifID +'" data-batch="' + options.batch_id + '">' + message + '<a class="close uiCloseButton fb"></a></li>').appendTo(growlDestination).each(function(){

                var thisNotif = this;
                var timeDelayBeforeRemove = 10000;
                                
                $(thisNotif).find(".close").on("click",function(){
                    $(thisNotif).fadeOut(500, function(){
                        $(this).remove();
                    });
                });
                
                if(notifID.indexOf("missed_call") > -1){
                    timeDelayBeforeRemove = 30000
                } else if (notifID.indexOf("first_time_enabled_mt_in_fb") > -1){
                    timeDelayBeforeRemove = 60000
                    $(this).find(".composeButton").on("click", function(){
                        $(thisNotif).fadeOut(250, function(){
                            $(this).remove();
                        });
                    });
                }
                
                if(options.hasOwnProperty("ts_dismiss_override")){
                    timeDelayBeforeRemove = options.ts_dismiss_override;
                }
                                  
                if(typeof messageID != "undefined"){
            
                    $(".convoWindowPlaceHolder").remove();//REMOVE PLACEHOLDER FOR THIS CONVERSATION.  THIS DIV IS INSERTED IN ORDER TO PREVENT DUPLICATE WINDOWS.
                        
                    $(thisNotif).find(".fbIncomingConfirm").show().on("click",function(e){
                        openWebAppPopup("quickview", messageID);
                        $(this).parent().remove();
                    }); 
                               
                }
                
                if(!("do_not_dismiss" in options)){
	                setTimeout(function(){
	                    $(thisNotif).fadeOut(500, function(){
	                        $(this).remove();
	                    });
	                }, timeDelayBeforeRemove);	                
                }
                
                //if there is an action callback in this notif
                if("action_btn_selector" in options && "action_btn_callback" in options){
	                $(options.action_btn_selector).on("click", function(){
		                options.action_btn_callback();
	                });
                }
                
            });            
        } else {
            console.error("found an existing notif");
        }
                    
    }
    
    function checkForExistingWindows(options){
	    //look for existing chat notification windows
        var capiObj = options.capi,
            notifContainer;
        
        if (currentLocation == "Gmail"){
            notifContainer = $(".dw").find(".nH.nn").first().parent();
        } else if (currentLocation == "Facebook"){
	        notifContainer = $('#ChatTabsPagelet').children().children().children(".fbNubGroup");
        } else if (currentLocation == "Outlook"){
            notifContainer = $("div#outlookNotifs").find(".nH.nn");
        }         

		trackNotifContainerSearch({container:notifContainer});//tracking 1 in 10 times if we are able to find the notif container when a user receives a CAPI that could trigger a notif
		
        var scCleanNum = capiObj["phone_num_clean"];
        var existingWindows = $(notifContainer).find('[data-number="' + scCleanNum + '"]');
        var messageDirection = capiObj["inbox_outbox"];
        var sourceClient = capiObj["source_client"];
        var messageType = capiObj["type"];
        
        if((messageType == 20) || (messageType == 21)){
/*             existingWindows = $(notifContainer).find('[data-number="' + capiObj["threadID"] + '"]'); */
//             console.log(capiObj["phone_num_clean"]);
            existingWindows = $(notifContainer).find('[data-number="' + capiObj["phone_num_clean"] + '"]');
        }

        if (existingWindows.length > 0) {                 
            if((options.hasOwnProperty("send_sync")) && (options.send_sync != false)){
                conversationConfirmClientSent(existingWindows[0], capiObj);
            } else {
                if((messageType == 10) || (messageType == 20)){
                    updateTextWindow(existingWindows[0], capiObj);   
                } else if((messageType == 11) || (messageType == 21)){
                    processIncomingPhotoTaken(capiObj["entireMessage"], existingWindows[0]);
                }
            }   
        } else {//can't find the notification chat window that ties to this            

            if(messageDirection == 60){//aka inbox_outbox
//             if (((capiObj.hasOwnProperty("capi_type")) && (capiObj.capi_type == "new_content")) && (messageDirection != 61)){//if this is a new content capi
                //this means that it was an incoming capi
                                
                //check if the user has even enabled incoming messages before we decide to append a placeholder
                checkIfUserHasEnabledIncomingMessageChatWindows({capi:capiObj, notif_container: notifContainer});

            } else if((capiObj.hasOwnProperty("receivedSMSfromSendc2dm")) && (capiObj.status_route < -90)){
                //create a chrome notif because we received an ack that a message failed to send, but the chat window that contained that message is not in the dom anymore
                buildFailedMessageChromeNotifDetails(capiObj);
                //send a message to the background script to create a chrome notif
                
            } else {
                //this is the case when a user is sending a message from another client, or another tab of gmail.  We should be updating the notif.
                updateTextWindow(existingWindows[0], capiObj);
            } 
            
        }
    }
    
    function trackNotifContainerSearch(data){
	    
	    var notifContainer = data.container;
	    
        if(getRandomInt(0, 10) === 4){//only want to make this call 10% of the time.

            var gaEventCategory = 'Checker',
	            gaEventAction = 'Chat-Notif-Container-Checker-10pct-Sample';
            
            if(currentLocation  == "Gmail"){
	            gaEventCategory = "Gmail-Checker";
            } else if (currentLocation == "Facebook"){
	            gaEventCategory = "FB-Checker";
            }
            
			callGAInBackgroundPage(gaEventCategory, gaEventAction, "attempt");
            
            if(notifContainer.length < 1){
        		callGAInBackgroundPage(gaEventCategory, gaEventAction, "not-found");
	    		//adding GA to get the user's Current URL when we are unable to find a chat window container on an incoming CAPI
				callGAInBackgroundPage(gaEventCategory, gaEventAction, "user-url-" + window.location.href);
            } else {
        		callGAInBackgroundPage(gaEventCategory, gaEventAction, "found-" + notifContainer.length);
            }
            
        }

    }
    
    function buildFailedMessageChromeNotifDetails(options){

        var contactName;
        if(options.sender.hasOwnProperty("contactName")){
            contactName = options.sender.contactName;
        } else {
            contactName = options.sender.phoneNum;
        }
        chrome.runtime.sendMessage({
            invokeChromeNotif: true,
            details: {
                title: "Warning - MightyText",
                message: 'Your message "' + options.body + '" to ' + contactName + ' failed to send from your phone.\n\nClick here to send the message again.',
                id: "message-send-failure-" + options.id,
                iconUrl: "img/error_icon.png"//this does not need to be added to the manifest because it's being used in a chrome notif, not injected into someone else's dom
            }
        }, function(response){
            console.log(response);
        })
    }

    function tellBackGroundScriptInstructionsForCRXStart() {
	    //tell background that user enabled extension to run in this tab based on chrome local storage settings
        chrome.runtime.sendMessage({
            getChromeLocalSettings: true,
            currentURL: currentHost
        }, function(response) {
            console.log(response.confirmation);
        });

        chrome.storage.local.get(null, function(chromeLocalSettingsJSONObj){

//            console.log("found all chrome local settings on this machine for Gtext. They are:");        
//            console.log(chromeLocalSettingsJSONObj);
        
            if(currentLocation == "Gmail"){
            
                if (chromeLocalSettingsJSONObj.gmail_preference === "1") {

                    tellBackGroundScriptAppIsEnabled();

                } else if (chromeLocalSettingsJSONObj.gmail_preference === "0") {
                    console.log("gText not enabled");
                } else {
                    console.log("something went wrong. gText was neither enabled nor disabled");
                }
            } else if (currentLocation == "Facebook"){
            
                if (chromeLocalSettingsJSONObj.fb_preference === "1") {

                    tellBackGroundScriptAppIsEnabled();
                          

                } else if (chromeLocalSettingsJSONObj.fb_preference === "0") {

                    console.log("mightyText in Facebook not enabled");
                    
                    checkIfUserHasLoadedFacebookBefore();
                    
                    $(".notificationWrapper").remove();//remove any existing notifs before signout.

                } else {
                    console.log("something went wrong. mightyText was neither enabled nor disabled in facebook");
                }
                
			    callGAInBackgroundPage("FB-Checker", "is-fb-text-enabled-on-fb-load", chromeLocalSettingsJSONObj.fb_preference);
			                    
            } else if (currentHost.indexOf("mail.live.com") > -1){
                
                currentLocation = "Outlook";
            
                tellBackGroundScriptAppIsEnabled();

            }
                                
            if(chromeLocalSettingsJSONObj.enable_logs === "0"){
                disableConsoleLogs(true);
            } else if (chromeLocalSettingsJSONObj.enable_logs === "1"){
                //enable console.logs
                disableConsoleLogs(false);
            }

        });
    };

    function tellBackGroundScriptAppIsEnabled() {
        chrome.runtime.sendMessage({
            checkLoginStatusCS: true,
            currentURL: currentHost,
            origin: currentLocation
        }, function(response) {
            console.log(response.confirmation);
        });
        
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.userHasNotAuthedGoogle) {
                initializeApp("noGoogleAuth");
                sendResponse({
                    confirmation: "confirmed that user is not logged in, because they have not linked mightytext with google."
                });
            } else if (request.userIsLoggedIntoMightyText) {
            //moved the line below out from the gmail only block of logic because I also display the username in the settingspane of the facebook version of gtext.
                var responseBackToBackgroundString = '';
                mightyTextAccount = request.mtAccount;
                
                //callKMInBackgroundPage('User Logged In', {'CRX-New-Login':'true','Client':'CRX-New', 'Subclient' : currentLocation });
                    //call KissMetrics

                                
                if(currentLocation == "Facebook"){
                    initializeApp("userLoggedIn");

                    responseBackToBackgroundString = "gmail-user-matched";
                    
                } else if (currentLocation == "Gmail"){
                    //Background script is telling the content script that the user is logged in.
                    
                    //we want to find the gmail account that the user is logged into. then match it with the MT logged in Google account later
                    //NOTE: this variable contains more than just the email -- it has some HTML stuff in it too, which is ok because we are 
                    // going to do a substring match.
                    
                    //the variable below is the first condition that should be checked.  We are looking at the dom, particularly this "div.msg" div that contains the current google account that the user is logged in as.
                    var googleAccountLoggedInToGmailFromDOM = $(document).find("div.msg").text();
                    //the variable below is a secondary condition that should be checked, in case we can not find the google account logged into in the DOM.  We are looking at the title of the page and seeing if the mtAccount can be found within that string.
                    var googleAccountLoggedInToGmailFromDOM2 = $("title").html();
    
                    console.log("is the user logged in?: " + request.userIsLoggedIntoMightyText);
                                        
                    //do a substring match of our MT email within the gmail account DOM
                                        
                    if((googleAccountLoggedInToGmailFromDOM.indexOf(request.mtAccount) > -1) || (googleAccountLoggedInToGmailFromDOM2.indexOf(request.mtAccount) > -1)){
                        googleAccountMatch = true;

                        initializeApp("userLoggedIn");
  
                        responseBackToBackgroundString = "gmail-user-matched";
                    } else {
                        googleAccountMatch = false;
                        console.log("user not logged into this gmail tab w/ their MightyText Account. Don't insert anything.");
                        responseBackToBackgroundString = "gmail-user-not-matched";
                        
                        //the user is logged into MightyText, but not with the current google account we are detecting in this tab.
                        checkIfMultipleGoogleAccountsAreSupported();
                    }                    
                } else if (currentLocation == "Outlook"){

                    initializeApp("userLoggedIn");

                    responseBackToBackgroundString = "gmail-user-matched";
                    
                    if (!capiHubInitializeCheck) {
                        initializeCAPIMessageHub();
                    } else {
                        console.log("already initialized this hub. Don't want to receive duplicate notifications");
                    }

                }
                
                sendResponse({
                    confirmation: responseBackToBackgroundString
                });            
            
            } else if (request.contentScriptCheck) {
                console.log("Background checking to see if this tab is running content script.");
                sendResponse({
                    confirmation: "Yep. This tab is running the content script."
                });                
            } else if (request.user_signed_out_from_mt){
                userSignedOutOfMT();
                sendResponse({
                    signed_out_status_rcvd: true
                });
            } else if (request.userIsLoggedIntoGoogleButNotRegistered) {
                console.log("is the user logged in?: " + request.userIsLoggedIntoGoogleButNotRegistered + " they should register for MightyText");
                callGAInBackgroundPage("CRX-Gmail", "Error_Device_Not_Registered", "");
                initializeApp("userNotRegistered");
                sendResponse({
                    confirmation: "confirmed that user is logged in."
                });
            } else if (request.CAPIOpened) {
                if (!capiHubInitializeCheck) {
                    initializeCAPIMessageHub();
                } else {
                    console.log("already initialized this hub. Don't want to receive duplicate notifications");
                }
                sendResponse({
                    confirmation: "acknowledged that CAPI has been opened"
                });
            } else if (request.gotUserSettings) {
                console.log("Got user settings from server");
                sendResponse({
                    confirmation: "User settings from server received in content script."
                });
                var settingsFromServer = request.userSettings;
                var enterToSendEnabled = settingsFromServer.enter_to_send;
                if (enterToSendEnabled == 1) {
                    enterToSend = true;
                } else if (enterToSendEnabled == 0) {
                    enterToSend = false;
                }
            } else if (request.leftNavLinkSettingChanged){
                updateLeftNavLinks(request.leftNavLinkSetting, request.displayThisLink);
                sendResponse({
                    confirmation: "received updated settings for left nav link"
                })
            } else if (request.userIsPro){
                isAProUser = true;
                sendResponse({
                    user_status_set_to_pro: true
                })
            } else if(request.userStripeStatusIsPastDue){
                triggerBootstrapGrowl("user-stripe-status-past-due");
                sendResponse({
                    display_notification_now: true
                });
            } else if(request.backgroundPageHasReloaded){
	            var reasonToReload = request.trigger;
	            if(typeof reasonToReload != "undefined"){
		            if(reasonToReload == "push-provider-change"){
			            alertUserOfBackgroundReload({trigger: reasonToReload});
		            }
	            }
	            sendResponse({
		            bg_reload_acknowledged: true
	            });
            }
        });
    };

    function initializeCAPIMessageHub(){
        capiHubInitializeCheck = true;
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            
            if (request.receivedSMS) {

                sendResponse({
                    confirmation: "displaying notif for SMS on: " + currentLocation
                });
                                
                checkForExistingWindows({capi:request});
                        
            } else if (request.receivedSMSfromSendc2dm) {
                
                sendResponse({
                    confirmation: "[{'sendc2dmObjReceived':'displaying notif for SMS send from sendc2dm on: " + currentLocation + "'}];"
                });
                
                checkForExistingWindows({capi:request, send_sync:true});

            } else if (request.receivedMMS) {

                sendResponse({
                    confirmation: "[{'MMSObjReceived':'displaying notif for SMS send from sendc2dm on: " + currentLocation + "'}];"
                });

                checkForExistingWindows({capi:request});
                
            } else if (request.receivedGroupMMS) {
            
                sendResponse({
                    confirmation: "[{'mmsObjReceived':'displaying notif for GroupMMS on: " + currentLocation + "'}];"
                });
                
                checkForExistingWindows({capi:request});
                            
            } else if(request.receivedGroupPicMMS){
                
                sendResponse({
                    confirmation: "[{'GroupMMSPicObjReceived':'displaying notif for SMS send from sendc2dm on: " + currentLocation + "'}];"
                });

                checkForExistingWindows({capi:request});
                
            } else if (request.receivedEventUpdate){
                
//                console.log("GOT THE MESSAGE FROM SCHEDULER.JS");
                console.log(request);
                
                handleSchedulerCapi(request['CAPI']);

            } else if (request.incomingPhoneCall) {
                sendResponse({
                    confirmation: "Content Script Received Incoming Call Status from Background"
                });
                                
               notifyUserSendConfirmation(request.sender.contactName, "incomingPhoneCall", "incoming_call_"+request.sender.phoneNumClean); 
            } else if (request.missedPhoneCall) {
                sendResponse({
                    confirmation: "Content Script Received Missed Call Status from Background"
                });
                notifyUserSendConfirmation(request.sender.contactName, "missedPhoneCall", "missed_call_"+request.sender.phoneNumClean);
            } else if (request.receivedPhoneStatus) {
                var batteryLevel = request.batteryLevel;
                var phoneCharging = request.phoneCharging;
                var userCurrentAPKVersion = request.currentAPKVersion;
                var timeStamp = String((request.lastTimeStamp / 1000)); //moment must be passed a string.
                var unixTimeStamp = request.lastTimeStamp;
                var formattedTimeStamp = moment.unix(timeStamp).format("h:mm a");                
                var batt_charging_icon = '';
                
                if (phoneCharging != 'false') {
                    batt_charging_icon = '<div id="chargingIcon"><img src="' + chargingImgURL + '"/></div>';
                }
                updateBatteryStatusDisplay(batteryLevel, batt_charging_icon, formattedTimeStamp, unixTimeStamp);
                                
                sendResponse({
                    phone_status_received: true
                });

//                checkIfUserHasCurrentAPK(userCurrentAPKVersion);
            } else if(request.receivedInitialWakeUpForGroupMMS){
                notifyUserSendConfirmation(request.sender.contactName, "incomingGroupMMS", "incoming_group_mms_"+request.sender.phoneNumClean);
            } else if(request.receivedInitialWakeUpForPicMMS){
                var senderContact = request.sender;
                notifyUserSendConfirmation(request.sender.contactName, "incomingPicMMS", "incoming_pic_mms_"+request.sender.phoneNumClean);
            } else if (request.notifyUserOfIncomingMessageInTab){
                checkIfUserHasEnabledIncomingMessageChatWindows({//we should only toggle the dom title if the user has enabled incoming messages in that tab
                    page_title_toggle: function(){
                        var currentPageTitle = $('title').text();
                        $('title').attr("original", currentPageTitle);
                        notifyUserOfNewContentInInactiveTab("",request.message);                    
                    }
                });
            } else if (request.stopNotifOfIncomingMessageInTab){
                notifyUserOfNewContentInInactiveTab("stop");
            } else if (request.canReceiveCapiCheck){
                sendResponse({
                    confirmation: "This tab can receive capi's."
                });                
            } else if (request.generic_notif){
                displayGenericCAPINotif(request);
                sendResponse({
                    confirmation: "Received generic CAPI info."
                });
            } else {
                console.log('unable to determine what the new_content was.');
                console.log(request);
                sendResponse({
                    confirmation: "received this Message.  But did nothing with it!"
                });
            } 
        });
    };
    
    function initializeGTextOnboarding(){
            
            console.log("starting tour");
            //return false;
            $('<div><div id="tourNotif"><div id="tourContainer"><div><p id="tourDescrip" >Welcome to MightyText in Gmail. <br></br> Do you want to take a quick 20 second tour?</p></div><div id="tourActions"><a id="tourDecline" class="tourButton">No thanks</a><button id="tourAccept" class="tourButton">Yes</button></div></div></div></div>').appendTo('body').each(function(){

                addAdaptionClasses(this, "tour");
                            
                $('#tourDecline').on("click", function(){
                   $(this).closest("#tourNotif").remove(); 
                   callGAInBackgroundPage("CRX-Gmail", "User-Declined-Tour", currentLocation);
                });
                $('#tourAccept').on("click", function(){
                    startIntroJSTour();
                });
                $(".tourButton").on("click", function(){
                    acknowledgeThatUserHasInteractedWithTourNotif();
                });
                
            });

    };

function userSignedOutOfMT(){

    //remove all content BEFORE we display a notif, otherwise it will also get removed.
    removeAllContentScriptInjectedUI();

    //display a notif prompting the user to reload their tab because 
    var signedOutNotifContent = "You have signed out of MightyText.  Please <a href=\"#\" id=\"reload-link\">reload</a> this " + currentLocation + " tab to sign back in.",
        notifTsDismiss = 999999;
    
    if(currentLocation == "Gmail"){
        displayBootstrapAlertNotif({message: signedOutNotifContent, ts_dismiss: notifTsDismiss, type: "info", first_btn_selector: "#reload-link", first_callback: function(){window.location.reload()}});        
    } else if (currentLocation == "Facebook"){
        initializeInfoModal({message: "<strong>MightyText in Facebook:</strong> " + signedOutNotifContent, id:"user-signed-out", ts_dismiss_override: notifTsDismiss});
    } else {
        console.error("Unrecognized subclient.  Not able to display a notification that the user needs to reload this tab running the subclient. Occurred at: " + new Date());
    }
        
};

function removeAllContentScriptInjectedUI(){
    //Remove all MT related UI
    //list in order
    //any bootstrap growl type notifs that may be in the dom. 
    //Compose Button Area (includes the settings/share icons)
    //mighty left nav links (texts/p&v)
    //Any open chat windows
    //any chat window place holders
    //end the tour if the user is in the middle of a tour when signed out from another client in this browser
    //any modals in the dom and the assoc. background overlays
    $(".mightyFBNotif, .mighty-alert-container, #gText, .mightyJewelWrapper, #fbCompose, .mightyLinkWrapper, .notificationWrapper, .convoWindowPlaceHolder, .newbatterywrap, .introjs-overlay, .introjs-helperLayer, .mightyModal, .fadeMighty").remove();    

}

function displayGenericCAPINotif(capi){
    
    if(isUserViewingWebappIframe()){
        return false;
    }
    
    $(capi.details).each(function(index, generalNotif){

        var alertOptions = {
            ts_dismiss: 10000,
            type: "info"
        }
        
        if(generalNotif.type == "-1"){
            alertOptions.type = "error";
            alertOptions.ts_dismiss = 999999;
        }
        
        if(generalNotif.hasOwnProperty("subject")){
            alertOptions.message = "<strong>"+generalNotif.subject + ":</strong>";
        } else if(currentLocation == "Gmail"){
            alertOptions.message = "<strong>MightyText:</strong>";
        } else if(currentLocation == "Facebook"){
            alertOptions.message = "<strong>MightyText in Facebook:</strong>";
        }
        
        alertOptions.message += '<br>' + generalNotif.body;
        
        if((generalNotif.hasOwnProperty('additional_info')) && (generalNotif.additional_info == "show-pro-button")){
            var proUpgradeBtnClassStr = "proUpgradeBtn";
        	alertOptions.message += '<br></br><div class="pro-upgrade-wrapper"><a class="' + proUpgradeBtnClassStr + '" target="_blank" href="https://mightytext.net/web#promo=true"><i class="fa fa-star" style="margin-right:5px;"></i>Go Pro</button></div>';
            
            if(currentLocation == "Gmail"){
        	    alertOptions.first_btn_selector = "." + proUpgradeBtnClassStr;
                alertOptions.first_callback = function(e){
                    e.preventDefault();
                    var buttonClicked = this;
                    openPromoWebappInIframe();
                    $(buttonClicked).closest(".mighty-alert").remove();
                };                
            }
    
        }	

                
        if(currentLocation == "Facebook"){
                alertOptions.message = alertOptions.message;//prepending a title so we know this was triggered from MT
            var infoModalOptions = alertOptions;
                infoModalOptions.id = "gen_notif_" + getRandomInt(1000, 9999);
            initializeInfoModal(infoModalOptions)
            
        } else {//not fb, currently only gmail
                        
            displayBootstrapAlertNotif(alertOptions);            

        }
        
    });

};
    
function acknowledgeThatUserHasInteractedWithTourNotif(){
                    //! uncomment this before launch
    var settingObj
    
    if(currentLocation == "Gmail"){
        settingObj = {
            'first_time_gmail' : true
        };
    } else if (currentLocation == "Facebook"){
        settingObj = {
            'first_time_facebook' : true
        };
    }
                    
    chrome.storage.local.set(settingObj, function() {
        // Notify that we saved.
        console.log('productTourGiven setting set');
    });

}

function startIntroJSTour(){
    //user started tour 

    callGAInBackgroundPage("CRX-Gmail", "User-Started-Tour", currentLocation);

    var tour = introJs();
    $("#tourNotif").remove();
        
    buildNewMessageComposer(true);
    
    //need to insert a new message composer specific to this tour
    $(".tourComposer").hide();
    
    var tourSteps
    
    if(currentLocation == "Gmail"){
        tourSteps = [  
            {  
                element: '#composeSMS',  
                intro: 'Send a new text message with this new Compose SMS button.',  
                position: 'right'  
            },  
            {  
                element: '.composeInnerContainer',  
                intro: 'Here\'s where you\'ll compose a new text message. <br></br> Incoming texts will also show up like this at the bottom of the screen.',  
                position: 'left'  
            },  
            {  
                element: '.mightdcfoot',  
                intro: 'Attach a photo to send a picture message (MMS) or add emojis.',  
                position: 'top'  
            },  
            {  
                element: '.newbatterywrap',  
                intro: 'See your phone\'s battery level up here.',  
                position: 'left'  
            },
            {  
                element: '.mightyLinkWrapper',  
                intro: 'Access your phone\'s text messages, photos, and videos here.',  
                position: 'right'  
            } 
        ];
    } else if (currentLocation == "Facebook"){
        tourSteps = [  
            {  
                element: '#fbCompose',  
                intro: 'Send a new text message with this new Compose SMS button.',  
                position: 'bottom'  
            },  
            {  
                element: '.composeInnerContainer',  
                intro: 'Here\'s where you\'ll compose a new text message. <br></br> Incoming texts will also show up like this at the bottom of the screen.',  
                position: 'left'  
            },  
            {  
                element: '.mightdcfoot',  
                intro: 'Attach a photo to send a picture message (MMS) or add emojis.',  
                position: 'top'  
            }  
        ];
    }
                
    tour.setOptions({ 
        'skipLabel': 'Exit',
        'exitOnEsc': true,
        'showStepNumbers': false,
        'scrollToElement': false, 
        'tooltipPosition': 'right',
        'steps': tourSteps 
    });

    tour.onbeforechange(function(targetElement) {  
    
        var lastStepOfTour
        
        if(currentLocation == "Gmail"){
            lastStepOfTour = $(targetElement).hasClass("mightyLinkWrapper");
        } else if (currentLocation  == "Facebook"){
            lastStepOfTour = $(targetElement).hasClass("mightdcfoot");
        }
        
        
        if(lastStepOfTour){
            //alert("last step");
            $(".introjs-skipbutton").addClass("finalMTTour");
        }

        if($(targetElement).hasClass("tourComposer")){
            $(".tourComposer").show(); 
            $("#pagelet_dock").find(".fbDockWrapper").addClass("mighty_50--");                  
        }
        if($(targetElement).hasClass("mightyLinkWrapper")){
            $("#fakeBatStatNotif").closest(".newbatterywrap").empty().hide().tooltip('destroy');
                        
        }
        if($(targetElement).hasClass('newbatterywrap')){
            insertTourBatStat();
        } 
        
    });
    
    tour.oncomplete(function() {
        tourComplete();
        
    });
    
    tour.onexit(function() {
        tourComplete();

    });
    
    var fixedElem = $("#blueBarHolder").find(".fixed_elem")
    
    $(fixedElem).addClass("mightyFixedElem").attr('style', 'position: relative !important');
        
    tour.start();        

};

    function tourComplete(){
        $("#fakeBatStatNotif").closest(".newbatterywrap").empty().hide();
        
        $(".tourComposer").closest(".notificationWrapper").remove();
        
        $("#pagelet_dock").find(".fbDockWrapper").removeClass("mighty_50--");
        
        $(".introjs-skipbutton").removeClass("finalMTTour");
        
        callGAInBackgroundPage("CRX-Gmail", "User-Completed-Tour", currentLocation);
        
        $("#blueBarHolder").find(".fixed_elem").removeClass("mightyFixedElem").css("position","fixed");
    }

    function insertTourBatStat(){
        var batStatCheck = $('div.baticon');
        
        if(batStatCheck.length > 0){
            //insert dummy batstat here.  
            console.log({
                "exists":false,
                "batStat":batStatCheck
            });
        } else {
            updateBatteryStatusDisplay(76, '<div id="chargingIcon"><img src="' + chargingImgURL + '"/></div>', null, null, "insert dummy stat");
            console.log({
                "exists":true,
                "batStat":batStatCheck
            });
        }
    }
    
    function stopFacebookOverFlowDuringTour(startOfTour){
        if(startOfTour){
            $("body").css("overflow","hidden");
            
            $("body").on("keypress", function(e){
/*                 var keycode = e.keyCode; */
                
                if(36 < e.keyCode < 41){
                    e.stopPropagation();
                }
            });
            
        } else {
            $("body").css("overflow","auto");
        }
    };
    
    function checkIfMultipleGoogleAccountsAreSupported(){
         chrome.storage.local.get("multiple_accounts", function(data){
         
             if(data["multiple_accounts"] == "1"){
             
                initializeAppForNonMightyAccountTab();
//                tellBackgroundScriptToRunAllTabs("support");                 
             } else if (data["multiple_accounts"] == "0"){
                initializeApp("extraUserLoggedIn");
//                tellBackgroundScriptToRunAllTabs("don't support");  

                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.enabledThisNonMTAccountTab){
                        initializeAppForNonMightyAccountTab();
                    }
                });               
             }
             
         });       
    }
    
    function initializeAppForNonMightyAccountTab(){
        initializeApp("userLoggedIn");
        //allow tab to receive CAPI's
        
        //get the server settings so that the composers reflect server settings
        //KL doesn't think we need to call this because we are doing this in the bg already IF, a user has enabled this setting
//         getServerSettingsForNonMightyAccountTab();
        
        
        if (!capiHubInitializeCheck) {
            initializeCAPIMessageHub();
        } else {
            console.log("already initialized this hub. Don't want to receive duplicate notifications");
        }        
    };
    
    function updateLeftNavLinks(settingName, display){

        var appView

        if(settingName == "displayMTLinks_texts"){
            appView = "classic";
        } else if (settingName = "displayMTLinks_media"){
            appView = "media";
        }
        
        if(display){
            $('[data-appview="'+ appView +'"]').show();
        } else {
            $('[data-appview="'+ appView +'"]').hide();
        }
        
    }
    
    function checkIfUserIsDisplayingLeftNavLinks(){
        chrome.storage.local.get(["displayMTLinks_texts", "displayMTLinks_media"], function(data){
        
            console.log("!!!!!!!!!!!!!!!!!");
            console.log(data);
        
            if(data["displayMTLinks_texts"] == "0"){
                $('[data-appview="classic"]').hide();
            }

            if (data["displayMTLinks_media"] == "0"){
                $('[data-appview="media"]').hide();
            }                        
        })
    }
    
    function checkIfUserHasLoadedFacebookBefore(){
        chrome.storage.local.get("first_time_facebook_not_enabled", function(data){
            console.log(data);
            if(data["first_time_facebook_not_enabled"] === undefined){
                
                chrome.runtime.sendMessage({
                    notifyUserOfMightyTextInFacebook : true
                }, function(response){
                    console.log(response);
                })
                
            } else {
                console.log("the user has opted to not see this notification.");
            }
        });
    }
//});

function sendMightyPhoto(blobID, whichMMSCanvasAreaTarget, optionalContent2ID)
	{
		
		//console.error($(whichMMSCanvasAreaTarget));
		
		var MediaBlobID = blobID;
		//var MediaSrc = $(this).parent().siblings('#fancyimagepopup').children().attr('src');
		var MediaSrc = baseUrl + '/imageserve?function=viewFile&blob-key=' + MediaBlobID;
		
		//CRV had to make this change to the mediasrc for previewing the image when we implemented drafts.  The viewFile servlet expires after a given time so if a user has an older draft with an MMS in it, the image tag would appear to be broken in the preivew
		if(optionalContent2ID)
			{
				var MediaSrc = baseUrl + '/imageserve?function=fetchViaServingUrl&id=' + optionalContent2ID;
				
			}

		$(whichMMSCanvasAreaTarget).children('#mms-blob-id-holder').text(MediaBlobID);  //move just uploaded Blob ID from dialog span to span in main page for preparing to send.

		var image_url_preview_from_mms_dialog_popup = MediaSrc;

		$(whichMMSCanvasAreaTarget).find('#mms-image-preview').show(); //we use FIND because it's a couple levels down
		$(whichMMSCanvasAreaTarget).find('#mms-image-preview').attr("src",image_url_preview_from_mms_dialog_popup);


		//var objRelevantTextMessageBox = $('#holder-mms-image-preview').parent().parent().parent().find('.textResponse');

		var objRelevantTextMessageBox = $(whichMMSCanvasAreaTarget).siblings('.textResponse');

		//console.log(objRelevantTextMessageBox);

		//yytest = objRelevantTextMessageBox;


		var heightOfRelevantTextMessageBox = objRelevantTextMessageBox.height();
		var widthOfRelevantTextMessageBox = objRelevantTextMessageBox.width();
		$(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview').show();

		//reduce width of text message entry box by 20% 
		//CRV edit: had to modify width via a class change as the inine styling being applied here was breaking emoji composer
		objRelevantTextMessageBox.addClass('MMSAddedResponseArea');
		
/*
		var overAllResponseArea = $(whichMMSCanvasAreaTarget).parent();
		var threadMessageHolder = $(overAllResponseArea).siblings('.threadConversationHolder');
		$(overAllResponseArea).addClass('mmsPreviewResponseAreaHeightAdjust');
		$(threadMessageHolder).addClass('mmsPreviewThreadConversationHeightAdjust');
*/
		
				
/* 		$(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview').append('<img id="mmsPreviewClose" src="assets/closeCustom.png" alt="close_preview" width="" height="" />'); */

		var mmsPreviewArea = $(whichMMSCanvasAreaTarget).find('#holder-mms-image-preview');
		var phoneNumClean = $(whichMMSCanvasAreaTarget).find("div#upload-image-mms").attr("name");
		
        $('<img id="mmsPreviewClose" data-window="' + phoneNumClean + '" src="'+ mmsAttachRemove +'" alt="close_preview" width="14" height="14">').appendTo(mmsPreviewArea).each(function(){
    		$(this).on("click", function(e){
                removeMMSDraft(this);
    		});            
        });		

		$(whichMMSCanvasAreaTarget).find('div#upload-image-mms').hide(); //remove attach paperclip icon for this box now that we have set an image


		//$( this ).dialog( "close" );
		$(whichMMSCanvasAreaTarget).find("a#fancyimagepopup-MMS").attr("href",image_url_preview_from_mms_dialog_popup);

/*
		if($(whichMMSCanvasAreaTarget).parent().parent('#EEModalFooter').length > 0)
			{
				//CRV in emoji composer fancy box.  Thus, don't inititate fancybox
			}
		else
			{
*/
    //! send mighty photo
		$(whichMMSCanvasAreaTarget).find("a#fancyimagepopup-MMS").fancybox({
			'type'	: 'image',
			'transitionIn'	: 'elastic',
			'transitionOut'	: 'elastic'
		});
/* 			} */

		$('#mms-upload-dialog').modal('hide');	
	
	}

function appendUserSignature(optionalNotifToUpdate){
    
    if(isAProUser != false){
        //only if the user is "pro"
        //fetching user signature from chrome local storage
        chrome.storage.local.get("user_signature", function(data){
//             console.log(data);
            var userSignature = data["user_signature"];
            
            if(userSignature != undefined){
                //only append signature if it is set
                var responseArea = $(optionalNotifToUpdate).find(".messageToSend");
                var currentResponseAreaContent = $(responseArea).text();
                var newContentToAppend = currentResponseAreaContent + createHTMLEquivalentOfMessageBody(userSignature);

                $(optionalNotifToUpdate).find(".messageToSend").append(newContentToAppend);
                
            }            
        });
    }

}

function triggerBootstrapGrowl(context){
    
    var message = "";
    var growlDelay = 10000; //default this to 10 seconds
    
    if (context == "draft-schedule-attempt"){
        message = 'The draft you just saved contains a schedule time.  The message content and recipients were saved in the draft, but the scheduled date/time is not saved in the draft.';
    } else if (context == "user-stripe-status-past-due"){
        message = 'MightyText Payment Issue\nWe recently tried to chard your card for MightyText Pro but the charge was unsuccessful.\n\nTo avoid cancellation of MightyText Pro, please go to: <a href="https://mightytext.net/web/#mode=settings&pane=account">update your card info</a>';
    }
    
    console.log(message);
    $.bootstrapGrowl(message, {
        delay: growlDelay
    });
}

function doesFileMeetSizeRequirements(data){
//alert($('#mms-file-attach')[0].files[0].size);
if ( (typeof FileReader !== "undefined") && (data.files[0].size > 2097152) ) //can only do in HTML5, hence FileReader check
	{
		//alert(getLanguageSpecificText('error_file_too_large', globalDefaultLanguage));
		alert("File too large. File upload limit is 2MB");

		return(false);
	}
else
	{
//		$('#file-upload-progress-indicator').show();
//		$(input).fileupload();
		return(true);
	}

};

function getContactPhotoForThisContactFromBG(phoneNumClean, phoneNumFull, contactName, textThreads){
    
    chrome.runtime.sendMessage({
        getContactPhotoForThisContact: true,
        phoneNumClean: phoneNumClean,
        phoneNumFull: phoneNumFull
    }, function(response) {

        var contactPhoto = response["contactPhoto"];
        
        displayNotificationOfNewContent(phoneNumClean, phoneNumFull, contactName, textThreads, contactPhoto);

    });   
        
};

function notifyBGOfSignOut(){
    
    chrome.runtime.sendMessage({
        userSignedOutFromContentScript: true
    }, function(response) {
        console.log(response);
    });       
    
};

function getMessageInfoAndTriggerResend(resendIcon){
	
	var messageBody = sanitizeTextResponse($(resendIcon).closest(".textWrapper").find(".textContent"));
	var content2id = $(resendIcon).closest(".textWrapper").attr("id").replace("message-id-", "");
	var recipientNumber = $(resendIcon).closest(".conversation").find(".messageContainer").attr("data-name");
	var elemToRemoveOnSend = $(resendIcon).closest(".textWrapper");

	resendSMSMessage({
    	id: content2id, 
    	body: messageBody, 
    	phone_num: recipientNumber, 
    	message_elem_to_remove: elemToRemoveOnSend
	});
		
}
	
function resendSMSMessage(options){
	
	var phoneNumClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(options.phone_num, 'do_not_zeropad');
	var composeWindow = $('[data-number="' + phoneNumClean + '"]').closest(".notificationWrapper");
	var messageTextArea = $(composeWindow).find(".messageToSend");
    var nameOfContact = $(composeWindow).find("span.title").html();
    
    sendC2DM({
        action: 'send_sms',
        action_data: options.body,
        phone_num: options.phone_num,
        contact_name: nameOfContact,
        context: "Conversation",
        window: composeWindow,
        message_text_area: messageTextArea,
        content_id: options.id
    });
    
    $(options.message_elem_to_remove).fadeOut(150, function(){//removing the elem the user just clicked on
        $(this).remove();
    })

}

function parseScheduledEventInfo(eventInfoJSON){
    
    var eventInfoObj,
        eventSummary = new Object;
            
	if(eventInfoJSON.hasOwnProperty("event_update_notify")){
		eventInfoObj = eventInfoJSON.event_update_notify;
	} else {
        eventInfoObj = JSON.parse(eventInfoJSON);
        eventInfoObj = eventInfoObj.eventlist_details;
    }
    
	if((eventInfoObj.status == 703) || (eventInfoObj.status == 706) || (eventInfoObj.status == 799)){//CRV something on the device has failed in association with this scheduled message
		
		if(eventInfoObj.status == 799){
			eventSummary.class_str = 'scheduledEventFailed';
		} else if(eventInfoObj.status == 706) {
			eventSummary.class_str = 'scheduledEventSchedulingFailed';
		} else if(eventInfoObj.status == 703){
			eventSummary.class_str = 'scheduledEventCancellingFailed';
		}
        eventSummary.icon = '<i class="eventStatusIcon sendConfirmation fa fa-location-arrow resendMessageFromThreadIcon" tooltip-content="Scheduled message send failed"></i>';
	} else if(eventInfoObj.status == 701) {//CRV event scheduled in process
		eventSummary.class_str = 'pendingScheduledMessage';
		momentDate = 'Scheduling in Process';
	} else if(eventInfoObj.status == 704) {
        messageTimeStamp = 'Cancelling Event...';
	} else if(eventInfoObj.status == 705) {//CRV event was cancelled
        eventSummary.class_str = 'scheduledMessageCancelled';
        eventSummary.icon = '<img class="eventStatusIcon sendConfirmation" src="' + cancelledScheduledMessageImgURL + '" tooltip-content="Message Cancelled" width="17" height="17"/>';
        momentDate = 'Cancelled';
   	} else if(eventInfoObj.status == 799) {//CRV event was cancelled
        eventSummary.class_str = 'scheduledMessageFailed';
        momentDate = 'Message Send Failed';
   	} else {
   		cancelEventOptional = '<i class="cancelScheduledMess fa fa-times" tooltip-content="Cancel Scheduled Message"></i>'
    }

    return eventSummary;

}

function isUserViewingWebappIframe(){
    var value = false,
        webappIframe = $("#mightyIframe");
        
    if(webappIframe.length > 0){
        value  = true;
    }
    
    return value;
}

function setListenerForWindowLoadToCheckDom(){

	$(window).on("load", function(){//waiting for the on "load" event because we know it fires when all content (images, files, etc) completely load in the dom.
		setTimeout(function(){
			checkCrucialElemsInDom({num_seconds:5});
		}, 5000);
		
		setTimeout(function(){
			checkCrucialElemsInDom({num_seconds:10});			
		}, 10000);
		
	});	

}

function checkCrucialElemsInDom(data){

// 	console.info("Querying " + currentLocation + " DOM at: " + new Date());

	var numSecsAfterWindowLoad = data.num_seconds;
	var crucialElemMap = {//this is a common map across both gmail and facebook
		Facebook: {//object of elems to check for in FB
			compose_new_container: $('[name="requests"]'),
			chat_window_container: $('#ChatTabsPagelet'),
			chat_window_full_check: $("div.uiToggle.hidden_elem"),
			fb_chat_list_nub: $("#fbDockChatBuddylistNub")
		},
		Gmail: {//object of elems to check for in Gmail
			compose_new_container: $(document).find('div.aic'),
			left_nav_links: domManipulationContainerSelectors[currentLocation].left_nav(),//looking specifically for the second child of the elem with class "TK"
			webapp_iframe_container: $(".ar4"),
			chat_window_container: $(".dw").find(".nH.nn").first(),//looking specifically for the first one
			bat_stat_container: $(document).find("#gb").children().first().children().first(),
			user_email_match_1: $(document).find("div.msg"),
			user_email_match_2: $("title")
		}
	};
	
	var checkForLoggedInFBPage = $('[role="search"]').length;//search bar in the top nav bar so that we know if the user is in the "logged in" app
	
	if((currentLocation == "Facebook") && (checkForLoggedInFBPage.length < 1)){//if current subclient is FB and we can't find the FB search, they probably aren't logged in
		return false;
	}
	
	var crucialElemMapForThisSubClient = crucialElemMap[currentLocation];//reference the map (object) for this sub client
	
	var gaEventCategory = 'Checker',
		overallDomStatusCheck = 'Good';
		
	if (currentLocation == "Gmail"){
		gaEventCategory = getGmailGACategoryName();
	} else if(currentLocation == "Facebook"){
		gaEventCategory = 'FB-Checker';
	}

	if(currentLocation == "Gmail"){
		findComposeButtonByTextSearch({num_seconds:numSecsAfterWindowLoad});	
	}
	
	$.each(crucialElemMapForThisSubClient, function(key, value){
		var domSpecificGAEventAction = "query_elem_count_" + key;
		var numOfThisElemFound = value.length;
		var domSpecificGAEventLabel = numOfThisElemFound.toString();
				
/*
		console.info({
			category: gaEventCategory,
			action: domSpecificGAEventAction,
			label: domSpecificGAEventLabel
		})
*/
		
		if(numOfThisElemFound < 1){//one of the elems is missing!
			overallDomStatusCheck = 'Bad';
		}
		
		callLogEntriesInBackgroundPage({
			event: {
				client: gaEventCategory, 
				elem_id: key, elem_count: numOfThisElemFound, 
				num_seconds_after_window_load: numSecsAfterWindowLoad, 
				user_email: mightyTextAccount
			}
		});
	    callGAInBackgroundPage(gaEventCategory, domSpecificGAEventAction, domSpecificGAEventLabel);
	    
	    if((currentLocation == "Gmail") && (numOfThisElemFound < 1)){
		    //3/9/16 Unable to find this elem.  GA-ing the user's current URL to see if we are missing any substrings in checkGmailPageValid()
		    //trying to make sure we are only attempting to inject our UI if we are on the correct page
		    var currentURLWithoutHashParams = window.location.hostname + window.location.pathname;
		    callGAInBackgroundPage(gaEventCategory, key + "_not_found_on_this_page_url-" + numSecsAfterWindowLoad + "-Secondss-After-Win-Load", currentURLWithoutHashParams);
	    }

	    //adding new logic for Sentry JS alerting for error cases only
	    if(
		    (numSecsAfterWindowLoad == 10)&&
		    (numOfThisElemFound < 1)&&
			(getRandomInt(0, 100) < 10)//we are only going to sample 10% of DOM errors found to keep error volume low
	    ){
// 		    console.info("calling sentry in bg");

		    callSentryInBackgroundPage({
			    event: {
				    message: 'Missing DOM Elem in ' + currentLocation + ': ' + key,
				    details: {
					    tags: {
						    elem_id: key,
						    subclient: currentLocation,
						    sample_pct: 10
					    }
				    }
			    }
		    });
	    }
	    
	});

    callGAInBackgroundPage(gaEventCategory, 'Overall-Dom-Elem-Check', overallDomStatusCheck);
    
}

function findComposeButtonByTextSearch(data){
	var numSeconds = data.num_seconds,
		composeButtonFoundByTextMatch = false,
		gaEventPrefix = "V4";
	$("*").each(function(index, value){
		var textOfThisElem = $(this).text(),
			checkIfThisElemHasARole = $(this).attr("role");
				
		if((typeof checkIfThisElemHasARole != "undefined") && (checkIfThisElemHasARole == "button")){
			var gmailButton = this;
			var composeTranslations = {
					en:"COMPOSE", 
					es:"REDACTAR", 
					fr:"NOUVEAU MESSAGE"
				};
			
			$.each(composeTranslations, function(language, translation){//checking if this button has any of the translations of COMPOSE
				
				if(textOfThisElem.indexOf(translation) > -1){//this button contains one of the translations of Compose
					
					var classStrOfComposeButtonContainer = $(gmailButton).parent().parent().attr("class");//the elem where we WANT to inject our GText button
					var classStrToEventLabel = classStrOfComposeButtonContainer.replace(" ", "|");//if this elem has multiple classes, we want to see them in GA so we can make the string returned above "|" delimited, instead of spaces

/*
					console.log(new Date() + ' found a button with the substring "Compose"');
					console.log({
						btn: gmailButton,
						class_attr: classStrOfComposeButtonContainer,
						new_str: classStrToEventLabel,
						lang: language
					});
*/
					
				    callGAInBackgroundPage(getGmailGACategoryName(), gaEventPrefix + "-Compose-New-Button-Container-Class-Str-" + numSeconds + "-Seconds-After-Win-Load", classStrToEventLabel + "-" + language);
				    
				    composeButtonFoundByTextMatch = true;
				
				}
				
			});
						
		}
	});
	
	if(composeButtonFoundByTextMatch === false){
		callGAInBackgroundPage(getGmailGACategoryName(), gaEventPrefix + "-Compose-New-Button-Container-Class-Str-" + numSeconds + "-Seconds-After-Win-Load", "Not-Found-In-Any-Lang");
	}

}

function getGmailGACategoryName(){//return string set as category for GA events in dom querying
	return "Gmail-Checker-" + manifest.version;
}

function alertUserOfBackgroundReload(data = {}){
	try{
		var actionBtn = {
			selector: "reload-link",
			callback: function(){
				window.location.reload();
				
				recordMTStatsEvent({//as of 1.24.18 KL the only place where this function is being invoked is for when the BG reloads due to the push provider switching
					event:{
						name: 'event_client_metric',//we default to this event name, but leaving here as a reminder that we can override this value from the caller
						options:{
							type: `bg-reload-${data.trigger}-subclient-notif`,
							sub_type: "btn-click",
							email: mightyTextAccount,
							app_mode: currentLocation
						}
					}
				});
			}
		}
		var bgReloadNotifMsgBody = `There's been an important update to MightyText in ${currentLocation}, please <a href="#" id="${actionBtn.selector}">reload</a> this tab now for it to take effect.`;
		
		if(currentLocation == "Gmail"){
			displayBootstrapAlertNotif({
				id: data.trigger,//setting the trigger to be the notif ID so that we don't show more than 1
				message: bgReloadNotifMsgBody, 
				do_not_dismiss: true,//do not want this alert to dismiss
				type: "info",
				first_btn_selector: "#" + actionBtn.selector, 
				first_callback: function(){
					//add a click of the reload link
					actionBtn.callback();
				}
			});
			
		} else if (currentLocation == "Facebook"){
			initializeInfoModal({
				message: bgReloadNotifMsgBody, 
				do_not_dismiss: true, 
				id: data.trigger,
				action_btn_selector: "#" + actionBtn.selector,
				action_btn_callback: function(){
					actionBtn.callback();					
				}
			});
			
		}
		
		recordMTStatsEvent({//as of 1.24.18 KL the only place where this function is being invoked is for when the BG reloads due to the push provider switching
			event:{
				name: 'event_client_metric',//we default to this event name, but leaving here as a reminder that we can override this value from the caller
				options:{
					type: `bg-reload-${data.trigger}-subclient-notif`,
					sub_type: "impression",
					email: mightyTextAccount,
					app_mode: currentLocation
				}
			}
		});

	} catch(err){
		console.error("Error occurred displaying an in-app notif to the user urging them to reload the subclient tab because the background page has reloaded", err);
	}
}