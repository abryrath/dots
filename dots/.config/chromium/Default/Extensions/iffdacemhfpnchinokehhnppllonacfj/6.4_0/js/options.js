$(document).ready(function() {
    var userSettingsFromServer = '';
    var mightyTextAccount

    function disableConsoleLogs(check){
        if (check){
            console.log = function(){};
            console.error = function(){};                            
        } else {
            console.log = console.log;
            console.error = console.error;
        }
    };
    
    function startOptionsPageScript(){
        getLocalChromeSettings();
        getSettingsFromServer();
    }
    
    function getLocalChromeSettings(){
        
        chrome.storage.local.get(null, function(data) {
    /*         console.log(data); */
            updateSettingsPage(null, data);
        });
    
    }
    
    function callGAInBackgroundPage(category, action, label) {
        
        var gaEvent = new Object();
        gaEvent.category = category;
        gaEvent.action = action;
        gaEvent.label = label;
        
        console.log(gaEvent)
        
        chrome.runtime.sendMessage({
            GAEventInfo: gaEvent,
        }, function(response) {
            console.log(response.confirmation);
        });

    };
    
    function getSettingsFromServer(){        
        chrome.runtime.sendMessage({
            getUserSettingsOptionsPage: true
        }, function(response) {
            console.log("response of when the bg responds with a user's server settings values")
            console.log(response);
        });
        
        chrome.runtime.sendMessage({
            getMightyTextAccount: true
        }, function(response) {
/*             console.error(response.confirmation); */
            mightyTextAccount = response.confirmation;
        });

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

            if (request.gotUserSettingsForOptionsPage) {
                var settingsFromServer = request.userSettings;
                updateSettingsPage(settingsFromServer, null);
                console.log(settingsFromServer);
                sendResponse({
                    confirmation: "User settings from server received in options page"
                });
            } else if (request.gotSettingsErrorForOptionsPage) {
                console.log("confirmed error getting server settings");
                updateSettingsPage("Server Settings Error", null);
                sendResponse({
                    confirmation: "No user settings from server.  Greying out div in the options page for the server setting."
                });
            } else if (request.errorUpdatingServerSetting){
                displaySettingsUpdateAlert('An error occurred while updating this setting.')
                sendResponse({
                    confirmation: "Acknowledged user was unable to update server setting"
                });
            }
        });


    };

    function saveChanges(server) {
        if (!server) {
            // Get a value saved in a form.
            var gmailPref = $("input[name=gmail_preference]:checked").val();
            var fbPref = $("input[name=fb_preference]:checked").val();
            var ongoingConvoPref = $("input[name=ongoing_conversations]:checked").val();
            var receiveNotifsGmailPref = $("input[name=gmail_notifs]:checked").val();
            var receiveNotifsFBPref = $("input[name=fb_notifs]:checked").val();
            var multipleAccountsPref = $("input[name=multiple_accounts]:checked").val();
            var displayMTLinksTextsPref = $("input[name=displayMTLinks_texts]:checked").val();
            var displayMTLinksMediaPref = $("input[name=displayMTLinks_media]:checked").val();
            var enableLogsPref = $("input[name=enable_logs]:checked").val();
            
            // Check that there's some code there.
/*
            if (!gmailPref) {
                console.error('Error: No value specified');
                return;
            }
*/
            // Save it using the Chrome extension storage API.
            
            //independently determine if the checkbox settings (display "Texts" and/or "Photos/Videos" in the Gmail Leftnav) are checked off or not.  When they are unchecked, their value is technically undefined, therefore we have to assign it a value of "0" so that it will work with the rest of the code.  We cannot put an undefined value into the local storage.
            if (!displayMTLinksTextsPref){
                displayMTLinksTextsPref = "0";
            }
            
            if (!displayMTLinksMediaPref){
                displayMTLinksMediaPref = "0";
            }

            if (!gmailPref){
                gmailPref = "0";
            }
            
            if (!fbPref){
                fbPref = "0";
            }

            if (!receiveNotifsGmailPref){
                receiveNotifsGmailPref = "0";
            }
            
            if (!receiveNotifsFBPref){
                receiveNotifsFBPref = "0";
            }
                        
            console.log(receiveNotifsGmailPref);
            console.log(receiveNotifsFBPref);
                        
            chrome.storage.local.set({
                'gmail_preference': gmailPref,
                'fb_preference': fbPref,
                'ongoing_conversations': ongoingConvoPref,
/*                 'receive_notifications': receiveNotifsPref, */
                'gmail_notifs': receiveNotifsGmailPref,
                'fb_notifs': receiveNotifsFBPref,
                'multiple_accounts': multipleAccountsPref,
                'displayMTLinks_texts': displayMTLinksTextsPref,
                'displayMTLinks_media': displayMTLinksMediaPref,
                'enable_logs': enableLogsPref
            }, function() {
                // Notify that we saved.
                console.log('Local settings saved');                
                displaySettingsUpdateAlert('Settings successfully saved');
            });
        } else {
            var sendOnEnterPref = $("input[name=enter_to_send]:checked").val();
            userSettingsFromServer.enter_to_send = sendOnEnterPref;
            chrome.runtime.sendMessage({
                saveSettingsToServer: true,
                origin: "non_iframed_options",
                updatedSettings: sendOnEnterPref
            }, function(response) {
                console.log(response.confirmation);
                if (response.confirmation.indexOf("success") > -1) {
                    $(".alert").css('visibility','visible')
                    setTimeout(function() {
                        $(".alert").css('visibility','hidden')
                    }, 2500);
                }
            });
        }
    };

    function displaySettingsUpdateAlert(alertContent){
        $(".alert").html('<strong>' + alertContent + '</strong>').css('visibility','visible');
        setTimeout(function() {
            $(".alert").css('visibility','hidden')
        }, 2500)

    }

    function updateSettingsPage(settingsFromServer, settingsFromLocal) {
        //THIS FUNCTION IS BEING CALLLED IN THE CALLBACK OF THE SUCCESSFUL RESPONSE FROM THE SERVER CALL IN BACKGROUND.JS BUT BELOW WE ARE RETRIEVING THE CHROME Local SETTINGS
        if (settingsFromServer == "Server Settings Error" ){
            $("#sendOnEnter").css("opacity","0.5");
            $('input[name="enter_to_send"]').attr("disabled",true);
        } else if (settingsFromServer != null) {
/*             var enterPrefFromServer = settingsFromServer.enter_to_send; */
            console.log("----------Server-----------");
            console.log(settingsFromServer);
            $("div.serverSetting").each(function(){
                var settingName = $(this).data("settingname");
                var localSetting = settingsFromServer[String(settingName)];
                //console.log(inputName);
                //console.log(test); 
                triggerCorrectRadioInput(settingName, localSetting);
            });
        } else if (settingsFromLocal != null) {
            //The code below checks all of the correct radio inputs based off of the values from the local settings
            var gmailPrefFromLocal = settingsFromLocal.gmail_preference;
            var ongoingConvoFromLocal = settingsFromLocal.ongoing_conversations;
/*             var receiveNotifsFromLocal = settingsFromLocal.receive_notifications;  */
            var receiveNotifsFromLocal = settingsFromLocal.gmail_notifs; 
            var receiveNotifsFromLocal = settingsFromLocal.fb_notifs; 
            var fbPreference = settingsFromLocal.fb_preference; 
            var multipleAccounts = settingsFromLocal.multiple_accounts; 
            var enableLogs = settingsFromLocal.enable_logs;

            //check to see if we should disable console.logs!
            if(enableLogs === "0"){
                disableConsoleLogs(true);
            } else {
                disableConsoleLogs(false);
            }

            console.log("----------LOCAL-----------");
            console.log(settingsFromLocal);
            
            $("div.localSetting").each(function(){
                var settingName = $(this).data("settingname");
                var localSetting = settingsFromLocal[String(settingName)];
                
                if((settingName == "displayMTLinks") || (settingName == "enableMT") || (settingName == "receive_notifications")){
                    
                    $(this).find("input").each(function(){
//                        console.log(this);
                        var cbSettingName = $(this).attr("name");
                        var cbLocalSetting = settingsFromLocal[String(cbSettingName)];
                        
                        console.log({
                          "settingName": cbSettingName,
                          "settingValue": cbLocalSetting  
                        })
                        
                        triggerCorrectRadioInput(cbSettingName, cbLocalSetting);                    
                    });
                    
                } else {
                    triggerCorrectRadioInput(settingName, localSetting);                    
                }
                               
            });
        }
    };

    function triggerCorrectRadioInput(nameOfInput, settingToCheck) {
        $('input[name=' + nameOfInput + ']').each(function() {
//            console.log(settingToCheck);
            var inputVal = $(this).val();
            
            if (inputVal == settingToCheck) {
                $(this).attr("checked", "checked");
            } 
                    
        });
    } /*     $('.alert').alert('close');             */
    $("input").on("click", function() {
        var inputVal = $(this).val();
        var inputChecked = $(this).attr("checked");
        var inputDestination = $(this).data("storagedestination");
        var inputName = $(this).attr("name");
        var inputType = $(this).attr("type");
        var gaLabel
        
        if(inputVal == "1"){
            gaLabel = "enabled";
        } else {
            gaLabel = "disabled";
        }
        
/*         console.log(inputType); */
        
        if(inputType == "checkbox"){
            var test = $(this).is(':checked');
            
            console.log(test);
        }

        
        //Save changes each time a user changes a setting.
        if (inputDestination === "server") {
            console.log("server");
            saveChanges(true);
        } else {
            console.log("local");
            saveChanges(false);
        }
        
        //multiple account support
        if(inputName == "multiple_accounts"){
            if(inputVal == "1"){
                triggerCustomConfirm('MightyText will now load within all Gmail windows in Chrome.', false, false, false, false, false, false, {marginLeft: "-200px", left: "50%", minWidth: 400});
            } else {
                triggerCustomConfirm('MightyText will now only load within Gmail windows in Chrome where "'+ mightyTextAccount +'" is logged in to Gmail. \n\nThis will take effect the next time Gmail loads.', false, false, false, false, false, false, {marginLeft: "-200px", left: "50%", minWidth: 400});
            }
        }
        
        //gmail preference support
        if(inputName == "gmail_preference"){
        
            var ischecked = $(this).is(':checked');
            var gmailNotifsCheck = $('input[name=gmail_notifs]').is(':checked');

            if(ischecked != false){
            
                setTimeout(function(){
                    
                    if(gmailNotifsCheck === false){
//                        alert("click");
                        $("input[name=gmail_notifs]").trigger("click");
                    }

                }, 250);
                        
            } else {
            
                setTimeout(function(){
            
                    if(gmailNotifsCheck != false){
//                        alert("click");
                        $("input[name=gmail_notifs]").trigger("click");
                    }
            
                }, 250);
            
            }
        
            alert('Please reload any Gmail windows in order for this change to take effect.');
        }
        
        //fb preference support
        if(inputName == "fb_preference"){
            var ischecked = $(this).is(':checked');
            var fbNotifsCheck = $('input[name=fb_notifs]').is(':checked');
            
/*
            var fbPermissionObj = {
                origins : ["*://*.facebook.com/*"]
            }
            
            var fbPermissionCheck = checkIfWeAlreadyHaveThisPermission(fbPermissionObj);
*/

            if(ischecked != false){
                setTimeout(function(){
                    
                    if(fbNotifsCheck === false){
//                        alert("click");
                        $("input[name=fb_notifs]").trigger("click");
                    }

                }, 250);
                        
                triggerCustomConfirm('MightyText will be enabled the next time you load Facebook in Google Chrome.', false, false, false, false, false, false, {marginLeft: "-200px", left: "50%", width: 400});
            } else {
            
                setTimeout(function(){
            
                    if(fbNotifsCheck != false){
//                        alert("click");
                        $("input[name=fb_notifs]").trigger("click");
                    }
            
                }, 250);
            
                triggerCustomConfirm('MightyText will be enabled the next time you load Facebook in Google Chrome.', false, false, false, false, false, false, {marginLeft: "-200px", left: "50%", width: 400});

            }
                        
        } else {
            //do nothing
        }
        
        callGAInBackgroundPage("CRX-Gmail", inputName + "_user_updated", gaLabel);
        
    });
 
    function checkIfWeAlreadyHaveThisPermission(permission){
        
        console.log(permission);
        
        chrome.runtime.sendMessage({
            checkForThisPermission: permission,
        }, function(response) {
            console.log(response.confirmation);
    
        });
        
    }
    
    startOptionsPageScript();
});