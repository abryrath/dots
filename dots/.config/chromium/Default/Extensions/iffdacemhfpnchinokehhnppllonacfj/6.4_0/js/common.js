//Added 8/25/14 by KL for contact photos
var username_prefix_jstrg_purpose,
    globalMTGTextHelper;//this is a var used in BOTH content script and bg.
                        //it is used to toggle notifications if the cs.js can't communicate w/ bg AND it is used to determine the iframe in bg.html associated with the current socket

function isThisConversationAGroupMessage(phoneNum){
	//CRV check to see if this is a pipe delimited phone number.  If yes, then return true
	if( phoneNum && (phoneNum.indexOf('|') > -1))
		{
			return(true);
		}
	else
		{
			return(false);
		}
}

function CRX_genericGetThumbnailFromCaches(phone_num_clean,full_phone_num){
    
	if(isThisConversationAGroupMessage(full_phone_num)){
    	var groupContactPhoto = chrome.extension.getURL('img/fb-gray_group.png');
		return(groupContactPhoto);
	}
			
    var bestContactThumbnail=chrome.extension.getURL('img/silhouette.jpeg');	//set it to default, and override if we have a good thumbnail image
			
	photoThumbnailObj = $.jStorage.get(username_prefix_jstrg_purpose + '|PH_PIC_'+ phone_num_clean ,"no-jstorage-val-found");
		
//	console.error(photoThumbnailObj);
	
	if (photoThumbnailObj == "no-jstorage-val-found"){
	 		 	
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

function getCurrentWeekdayName(){
    
    var date = new Date();
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    var dayOfWeek = weekday[date.getDay()];

    return dayOfWeek;
    
};

function callGAInBackgroundPage(category, action, label) {
    var gaEvent = new Object();
    gaEvent.category = category;
    gaEvent.action = action;
    gaEvent.label = label;
    chrome.runtime.sendMessage({
        GAEventInfo: gaEvent,
    }, function(response) {
//            console.log(response.confirmation);
    });
};
//_kmq.push(['record', 'User Logged In', {'CRX-New-Login':'true','Client':'CRX-New'}]);
function callKMInBackgroundPage(event, properties) {
    var kmEvent = new Object();
    kmEvent.event = event;
    kmEvent.properties = properties;
    chrome.runtime.sendMessage({
        KMEventInfo: kmEvent,
    }, function(response) {
        console.log(response.confirmation);
    });
};

function callIntercomInBackgroundPage(event, properties){
    var intercomEvent = new Object();
    intercomEvent["event"] = event;
    intercomEvent["properties"] = properties;
    chrome.runtime.sendMessage({
        intercomEventInfo: intercomEvent,
    }, function(response) {
        console.log(response.confirmation);
    });    
}

function callLogEntriesInBackgroundPage(data){
	var eventData = data.event;
    chrome.runtime.sendMessage({
        logEntriesInfo: eventData,
    }, function(response) {
        console.log(response.confirmation);
    });	
}

function callSentryInBackgroundPage(data){
	var eventData = data.event;
    chrome.runtime.sendMessage({
        sentryInfo: eventData,
    }, function(response) {
        console.log(response.confirmation);
    });	
}

function getMTGTextHelper(){
    var shouldRecordThisAttempt = getRandomInt(0, 100) < 1;//KL is defining it here so that GA's for Attempts and Errors will match up.  We want a 100% chance that if the ajax request errors, both an attempt AND error are recorded for that attempt
        
    if(shouldRecordThisAttempt){
        callGAInBackgroundPage("CRX-Gmail", "Latest-Webapp-Iframe-Path-Request-1pct-Sample", "attempt");
    }

    $.ajax({
        type: "GET",
        url: "https://mightytext.net/prod-assets/gtext/gtext-app-helper-production.php",
        dataType: "json",
        timeout: 10000,//increased the timeout because after looking at GA on 11.3.15, one of the top errors for this request was a timeout
        success: function(response){
            globalMTGTextHelper = response;
            if(shouldRecordThisAttempt){
                callGAInBackgroundPage("CRX-Gmail", "Latest-Webapp-Iframe-Path-Request-1pct-Sample", "success");                
            }
            if(response.hasOwnProperty("path_to_webapp")){
                //storing the path in chrome local storage so that the js in the iframe wrapper can access this path.
                chrome.storage.local.set({
                    path_to_latest_webapp_iframe : response.path_to_webapp
                });  
            }
        },
        error: function(requestObj, textStatus){
            console.error("error in request to get latest path to webapp iframe: " + textStatus);
            
            if(shouldRecordThisAttempt){
                callGAInBackgroundPage("CRX-Gmail", "Latest-Webapp-Iframe-Path-Request-1pct-Sample", "ajax-error-status-" + textStatus);
            }
        }
    });
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

BrowserDetect.init();


function buildRandAlphaNumStr(length) {
    var result = '',
	    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function triggerCustomConfirm(confirmBody, okCallback, optionalOKButtonWording, cancelCallback, optionalCancelButtonWording, optionalThirdButtonCallback, optionalThirdButtonText, optionalCustomCssOverride){

		//CRV remove any old confirm in the dom
		$('#custom-alert-and-confirm-modal').remove();

		var html = '';
		html += '<div id="custom-alert-and-confirm-modal" class="custom-alert">';
		//html += '<div class="modal-header">';
		//html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		//html += '<h3>Modal header</h3>';
		//html += '</div>';
		html += '<div id="custom-alert-and-confirm-modal-body" class="alert-body">';
		html += '</div>';
		html += '<div class="alert-footer">';
		html += '<button id="custom-alert-and-confirm-modal-ok-button" class="mighty-app-button">OK</button>';
		html += '<button id="custom-alert-and-confirm-modal-cancel-button" class="mighty-app-button">Cancel</button>';
		//html += '<a href="#" class="btn btn-primary">Save changes</a>';
		html += '</div>';
		html += '</div>';
		
		$('body').append(html);

		
		
		//CRV update the modal body with the alert specific text
		$('#custom-alert-and-confirm-modal-body').empty().append('<span class="custom-alert-body-wrapper">' + confirmBody + '</span>');
		
		//CRV always remove the third button from the modal just incase it exists
		$('#custom-alert-and-confirm-modal-third-button').remove();
		
		//CRV if there isa third button, let's add it to the DOM and set the onclick callback
//		console.error(optionalThirdButtonCallback);
//		console.error(optionalThirdButtonText);
		if(optionalThirdButtonCallback && optionalThirdButtonText)
			{
				var thirdButtonHTML = '<button id="custom-alert-and-confirm-modal-third-button" class="mighty-app-button third-button-in-custom-confirm">' + optionalThirdButtonText + '</button>';
//				console.error(thirdButtonHTML);
//				console.error(appendLoaction);
				var appendLoaction = $('#custom-alert-and-confirm-modal').find('.alert-footer');
				var thirdButtonInDom = $(thirdButtonHTML).appendTo(appendLoaction);
				
				//$('#custom-alert-and-confirm-modal-third-button').unbind('click');
				$(thirdButtonInDom).click(function(){
					if(isAProUser)
						{
							
							optionalThirdButtonCallback();	
							setTimeout(function(){
								closeBlockUIForCustomConfirmAndAlertModal();
								okCallback();
							}, 300);
						}
					else
						{
							//NOT pro, launch pro info modals about draft
            				displayNonProUserAlertModal("drafts");
							closeBlockUIForCustomConfirmAndAlertModal();
							cancelCallback();
							return(false);
							
						}
					return(false);
				});
			}
		
		var cssForBlockUI = {
            border: '0px',
            backgroundColor: 'transparent',
            cursor: 'default'
        };
		
		if(typeof optionalCustomCssOverride == "object"){
	
			$.each(optionalCustomCssOverride, function(index, value){//this function is parsing the custom css options object that is passed in, and then applying it to the css object we already set int he function (cssForBlockUI).  This allows anywhere this function is called to add their own custom css on a case by case basis.
                cssForBlockUI[index] = value;
    		});

		}
		
		//CRV show the modal
        $.blockUI({ 
            message: $("#custom-alert-and-confirm-modal"), 
            css: cssForBlockUI,
            overlayCSS: {
                backgroundColor: 'rgba(255,255,255,0.8)',
                cursor: 'default'
            },
            cursorReset: 'default',
            fadeIn: 0,
            centerY: true
        }); 
		
		
		
		
		//CRV if there are any custom button labels, let's set them
		if(optionalOKButtonWording)
			{
				$('#custom-alert-and-confirm-modal-ok-button').text(optionalOKButtonWording);
			}
		else
			{
				$('#custom-alert-and-confirm-modal-ok-button').text('OK');
			}
			
		if(optionalCancelButtonWording)
			{
				$('#custom-alert-and-confirm-modal-cancel-button').text(optionalCancelButtonWording);
			}
		else
			{
				$('#custom-alert-and-confirm-modal-cancel-button').text('Cancel');
			}
		
		
		
		//CRV set the instructions for the OK button
		$('#custom-alert-and-confirm-modal-ok-button').unbind('click');
		$('#custom-alert-and-confirm-modal-ok-button').click(function(){			
            closeBlockUIForCustomConfirmAndAlertModal();
        	if(okCallback)
        		{
        			okCallback();
					return(false);
        		}
			
		});
		
		//CRV set instructions for Cancel button
		if(cancelCallback)
			{
				//CRV this is a confirm, so show the cancel button
				$('#custom-alert-and-confirm-modal-cancel-button').show();
				
				//CRV there is more than one button in this modal, so remove the single button class from the OK button
				$('#custom-alert-and-confirm-modal-ok-button').removeClass('single-button-in-custom-modal');
				
				$('#custom-alert-and-confirm-modal-cancel-button').unbind('click');
				$('#custom-alert-and-confirm-modal-cancel-button').click(function(){
		            closeBlockUIForCustomConfirmAndAlertModal();
					cancelCallback();
					return(false);
				});
			}
		else
			{
				//CRV this is not a confirm modal because there is no cancelCallback.  Thus, we can add the single button modal class to the ok button so that it will be centered
				$('#custom-alert-and-confirm-modal-ok-button').addClass('single-button-in-custom-modal');
				$('#custom-alert-and-confirm-modal-cancel-button').hide();
			}
		

}
	
function closeBlockUIForCustomConfirmAndAlertModal(){
    $.unblockUI({
        fadeOut: 0
    });
    //CRV remove any old confirm in the dom
	$('#custom-alert-and-confirm-modal').remove();
}
