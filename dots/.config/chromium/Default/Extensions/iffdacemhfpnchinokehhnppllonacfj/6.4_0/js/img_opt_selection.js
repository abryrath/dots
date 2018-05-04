var send2PhoneImgURL = chrome.extension.getURL('img/send_to_phone.png');
var sendMMSImgURL = chrome.extension.getURL('img/send_pic_message3.png');

var notifHTML = '<div class="mightyWidgetWrapper"><div class="imgTaskSelect mtOverLay"><div class="wrapper"><div class="task mightyClearfix" data-task="sendMMS"><img src="'+sendMMSImgURL+'"/><div class="taskCaption">Send Picture Message (MMS)</div></div><div class="task mightyClearfix" data-task="sendToPhone"><img src="'+send2PhoneImgURL+'"/><div class="taskCaption">Send To Phone</div></div></div></div></div>';

$(notifHTML).appendTo("body").each(function(){
    $(".imgTaskSelect").fadeIn();
    $(".mightyWidgetWrapper").not(".imgTaskSelect").on("click", function(e){
        $(this).fadeOut().remove();
    });
});

$(".task").on("click", function(e){
    e.preventDefault();
    var task = $(this).attr("data-task");
        
    //alert("clicked!"+task);
    if(task == "sendMMS"){
        chrome.runtime.sendMessage({
            injectOverlay: true
        }, function(response) {
            response = response["confirmation"];
            var responseObj = jQuery.parseJSON(response);
            console.log(responseObj);
        });
    } else if(task == "sendToPhone"){
        chrome.runtime.sendMessage({
            sendImgToPhone: true
        }, function(response) {
            response = response["confirmation"];
            var responseObj = jQuery.parseJSON(response);
            console.log(responseObj);
        });    
    }
    
});