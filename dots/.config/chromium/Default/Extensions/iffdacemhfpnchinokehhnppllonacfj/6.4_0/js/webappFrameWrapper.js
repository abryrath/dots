//BASE URL FOR MIGHTYIFRAME
//because of the redirect logic for ads in clean.js, we are going to pass the "exp=1" url param so that we don't lose the "client=gtext-iframe" url param we need to render the webapp in iframe mode


/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    console.log({
        request: request,
        sender: sender
    });
    
});
*/

var pathToLatestWebappIframe = 'web8';

/* console.log(window.location.hash); */
function tellBGToReloadThisTab(){

    chrome.runtime.sendMessage({
        reloadTab: true
    }, function(response){
//         console.info(response);
    });
    
}

function setIframeSrc(){

    chrome.runtime.sendMessage({
        getUserProStatus: true
    }, function(response){
        
        chrome.storage.local.get("path_to_latest_webapp_iframe", function(data){
            
            if(data.hasOwnProperty("path_to_latest_webapp_iframe")){//if this is found in settings, then override the global pathToLatestWebappIframe var to the stored value
                pathToLatestWebappIframe = data.path_to_latest_webapp_iframe; 
            }

            var srcToSet = "https://mightytext.net/" + pathToLatestWebappIframe + "?client=gtext-iframe";
            if(!response.pro_status){//if the user is a pro, we do not want to pass the exp=1 url param because we will lose the client=gtext-iframe url param we need to make our css/js changes.
                srcToSet += "&exp=1";
            }
            var view = window.location.hash.replace("#","");
            
            if(view == "media"){//we were always setting the mode= hash before, but this hash override was causing the user's default mesage view setting to not be respected.  So, we are going to only set this hash override when we are viewing the media gallery
                srcToSet += "#mode=" + view;
            } else if (view.indexOf("promo=true") > -1){
                view = view.replace("classic&", "");//strip out the classic param so that the user's default messages view will be set.
                srcToSet += "#"+view;
            }
                
            $("#webAppIframe").attr("src", srcToSet);
            
        })
        
    })    
}

function parseIframedWebappMessages(message){
    var messageData = message.data;
    var messageAction = messageData.action;
    
//     console.info(message);
    
    if(messageAction == "upgraded_to_pro"){
        tellBGToReloadThisTab();
    } else if (messageAction == "webapp_loaded_gtext_iframe"){
        callGAInBackgroundPage("CRX-Gmail", "GText-Webapp-Iframe", "Successfully-Loaded");
    } else {
//         console.error(messageData);
    }
}

function sendMessageToIframeParent(options){
    var message = options.message;
    
	parent.postMessage(message, '*');
}

window.onhashchange = function(){                                    

    setIframeSrc();

};

setIframeSrc();

window.addEventListener('message', parseIframedWebappMessages);