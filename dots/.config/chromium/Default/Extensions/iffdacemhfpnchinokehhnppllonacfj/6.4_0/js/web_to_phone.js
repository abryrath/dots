chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.contextMenuInfo) {
        var info = request.contextMenuInfo;
        console.log(info);
        sendResponse({
            receivedInfo: true
        })               
        
        initializeOverlay(info);
                     
    } else if (request.sendC2DMSuccess){
//        alert("success");
        showSuccessNotif();      
        sendResponse({
            successAcknowledged: true
        });                       
    } 
});

function initializeOverlay(contextInfo){
    var context = contextInfo["context"];

//IMAGES
    var spinningImg = chrome.extension.getURL('img/goog_spinner.png');
    var send2PhoneImgURL = chrome.extension.getURL('img/send_to_phone2.png');
    var sendMMSImgURL = chrome.extension.getURL('img/send_pic_message7.png');
    var sendLink2PhoneImgURL = chrome.extension.getURL('img/send_link_to_phone2.png');
    var sendLinkImgURL = chrome.extension.getURL('img/send_link_message3.png');
//IMAGES

//REMOVE EXISTING OVERLAYS
    var existingOverlay = $(".mightyWidgetWrapper");
    $(existingOverlay).remove();    
//DEFINE IFRAMEURL
    var iFrameURL = buildIframeURL(contextInfo, context);            
    
    var overlayContainer = '<div class="mightyWidgetWrapper mtOverLay"><div class="masterSpinnerWrapper"><img class="masterSpinner" src="'+ spinningImg +'"/></div><div class="sendc2dmNotif"></div></div>'
    

    var optionsMenuHTML = '<div class="imgTaskSelect mtOverLay"><div class="wrapper"><div class="task mightyClearfix" data-task="sendToPhone"><img src="' + send2PhoneImgURL + '"/><div class="webImgPlaceHolder" style="position:absolute"><img src="http://google.com" /></div><div class="taskCaption">Send Image To Phone</div></div><div class="task mightyClearfix" data-task="sendMessage"><img src="'+sendMMSImgURL+'"/><div class="webImgPlaceHolder" style="position:absolute"><img src="http://google.com" /></div><div class="taskCaption">Send Picture Message (MMS)</div></div></div></div>';
    
    
    var iFrameWidgetHTML = '<iframe scrolling="no" id="mightyIframeWidget" src="'+iFrameURL+'"></iframe>';

    $(overlayContainer).appendTo("body").each(function(){
        var thisWrapper = this
        console.log(this);

        if((context == "page")||(context == "image")){//only insert this html if the user clicked image or photo.
            
            $(optionsMenuHTML).appendTo(thisWrapper).each(function(){
                setupOptionsMenu(this, context, iFrameWidgetHTML, contextInfo);
                if (context== "page"){
                    $("div[data-task='sendMessage'] > img").attr("src", sendLinkImgURL);
                    $("div[data-task='sendToPhone'] > img").attr("src", sendLink2PhoneImgURL);
                    $("div[data-task='sendMessage'] .taskCaption").text("Send Link via Text Message");
                    $("div[data-task='sendToPhone'] .taskCaption").text("Open Link on Phone");                                
                } else if (context == "image"){
                    $("div[data-task='sendMessage'] > img").attr("src", sendMMSImgURL);
                    $("div[data-task='sendToPhone'] > img").attr("src", send2PhoneImgURL);
                    $("div[data-task='sendMessage'] .taskCaption").text("Send Picture Message (MMS)");
                    $("div[data-task='sendToPhone'] .taskCaption").text("Send Image To Phone");                    
                    $("div.task > .webImgPlaceHolder").show().find("img").attr("src", contextInfo["info"]["srcUrl"]);
                }
            });
        } else if (context == "selection"){
            appendIframe(iFrameWidgetHTML, thisWrapper);
        }
    });    
}

function buildIframeURL(clickInfo, context){
    
    var url
    
    if((context == "page")||(context == "selection")){
        var body
        var textBody
                
        if(context == "page"){//dynamically define var body depending on the context of the click
            body = clickInfo["tab"]["title"];
        } else if (context == "selection"){
            body = clickInfo["info"]["selectionText"];
        }

        if(body.length > 400){//check length
            body = body.substring(0, 396) + "..."    
        }
        
        textBody = "\"" + body + "\" - " + clickInfo["info"]["shortUrl"] + " - sent with Mightytext";

        if(textBody.length < 1500){//this ensures that the string appended to the get request is not more than the 2048 char limit.
            var encodedBody = fixedEncodeURIComponent(textBody);
            url = 'https://mightytext.net/kevin-dev/compose-new/#mode=compose-new&body='+ encodedBody +'&type=sms';
        } else {
            alert("Error: Selected String is too long");
            return false;
        }
    
    } else if (context == "image") {
        var img = clickInfo["info"]["srcUrl"]

        var encodedImgSrc = fixedEncodeURIComponent(img);
        
        var textBody = fixedEncodeURIComponent("sent with Mightytext");
        
        url = 'https://mightytext.net/kevin-dev/compose-new/#mode=compose-new&body='+ textBody +'&type=mms&binarysrc=' + encodedImgSrc;

    } else {
        alert("Error: Unrecognized Context");
    }
    
    return url
    
};

function setupOptionsMenu(menu, context, iframe, phoneActionData){
    var wrapper = $(menu).parent();    
    console.log(phoneActionData);
    $(menu).fadeIn();
    $(".imgTaskSelect").on("click",function(e){
        e.stopPropagation();
    });
    $(".mightyWidgetWrapper").not(".imgTaskSelect").on("click", function(e){
        console.log(e);
        closeOverlay();
    });
    
    $(menu).find(".task").on("click", function(e){
        e.preventDefault();
        var task = $(this).attr("data-task");
            
        //alert("clicked!"+task);
        
        if(task == "sendMessage"){
            //sendMMS
            $(menu).fadeOut();
            appendIframe(iframe, wrapper[0])
        } else if(task == "sendToPhone"){              
            chrome.runtime.sendMessage({
                sendOtherC2DM: true,
                action_data: phoneActionData,
                context: context
            }, function(response) {
                response = response["confirmation"];
                var responseObj = jQuery.parseJSON(response);
                console.log(responseObj);
                $(menu).fadeOut().remove();
            });    
        }
        
    });
}

function listenForEventsFromIFrame(){

    addEventListener('message', function(ev) {
        if (ev.data === 'closeIframe') {
            $(".mightyWidgetWrapper").fadeOut(250,function(){
                $(this).remove();
            });    
        } else {
        
            if(ev.data["origin"] == 'successful_sendc2dm'){
                $("#mightyIframeWidget").fadeOut(250,function(){
                    $(this).remove();
                    showSuccessNotif();
                });
                
                //alert(ev.data["action"]);
                var sendC2DMAction = ev.data["action"];
                
/*
                if(sendC2DMAction == "send_sms"){
                    //
                } else if (sendC2DMAction == ""){
                    //    
                }
*/
                
                //callGAInBackgroundPage("CRX-Gmail", "Compose-New-SMS-Button-Click", "Click");
                //callKMInBackgroundPage("Send-Message",{'Type':messageType,'App-Action-Location':location,'Client':'CRX-New'});
                
            } else if(ev.data["origin"] == 'sendc2dm_error'){
                $("#mightyIframeWidget").fadeOut(250,function(){
                    //$(this).remove();
                    
                    $(".sendc2dmNotif").text("Error Sending Request to Phone.").fadeIn(150, function(){
                         $(this).delay(1250).fadeOut(250, function(){
                             var iframe = $("#mightyIframeWidget");
                             if(iframe.length < 1){
                                $(".mightyWidgetWrapper").fadeOut(250,function(){
                                    $(this).remove();
                                });    
                             } else {
                                 $("#mightyIframeWidget").fadeIn(150);                                 
                             }
                         })
                    });
                });            
            }
        }
    });
    
    document.getElementById("mightyIframeWidget").onload=function(){
        $("#mightyIframeWidget").addClass("show");
        $(".masterSpinnerWrapper").remove();
    };
    
}

function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

function closeOverlay(){
    $(".mightyWidgetWrapper").fadeOut().remove();
}

function showSuccessNotif(){
    $(".masterSpinner").hide();
    $(".sendc2dmNotif").text("Succesfully Sent Request to Phone.").fadeIn(150, function(){
        $(".mightyWidgetWrapper").delay(1250).fadeOut(250,function(){
            $(this).remove();
        });
    });                        
}

function appendIframe(iframeHTML, destination){
    console.log({
        html: iframeHTML,
        dest: destination
    });
/*     console.log(destination); */
    $(iframeHTML).appendTo(destination).each(function(){
        listenForEventsFromIFrame();
    });                
}

//callGAInBackgroundPage("CRX-Gmail", "Compose-New-SMS-Button-Click", "Click");
function callGAInBackgroundPage(category, action, label) {
    var gaEvent = new Object();
    gaEvent.category = category;
    gaEvent.action = action;
    gaEvent.label = label;
    chrome.runtime.sendMessage({
        GAEventInfo: gaEvent,
    }, function(response) {
            console.log(response.confirmation);
    });
};
//callKMInBackgroundPage("Send-Message",{'Type':messageType,'App-Action-Location':location,'Client':'CRX-New'});
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