chrome.runtime.onMessage.addListener(function(a,b,c){a.webToPhoneJSTestMessage&&c({content_script_exists:!0});if(a.contextMenuInfo){var e=a.contextMenuInfo;chrome.runtime.sendMessage({getPathToLatestCutOfWebApp:!0,getUserReferralURL:!0},function(b){var f=b.path_to_latest_webapp;a.bypassOptionsModal?(_b2313218b77d20f290d9350296ebbab10cfd7c5a(e,a.bypassOptionsModal,a.task,f,b.referral_url),c({receivedInfo:!0,bypassingOptionsModal:!0})):(_b2313218b77d20f290d9350296ebbab10cfd7c5a(e,null,null,f,b.referral_url),
c({receivedInfo:!0,bypassingOptionsModal:!1}))});c({contextMenuInfoReceived:!0})}else a.sendC2DMStatus&&(a.response_status?_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!0):_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!1,_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"unable_to_comm_with_phone"})),c({successAcknowledged:!0}))});
function _5bac8fbf1b1b6a2a717ee5453a9c171817083530(a){var b=chrome.extension.getURL("img/128x128_MT_logo_boom_gradient_white.png"),c=chrome.extension.getURL("../img/web-to-phone/send_to_phone3.png"),e=chrome.extension.getURL("../img/web-to-phone/send_pic_message7.png"),d=chrome.extension.getURL("img/web-to-phone/remove.png");a='<div class="imgTaskSelect mtOverLay" data-context="'+a+'"><div class="linkPreview"><div class="linkPreviewImg">';a+='<img src="'+b+'"/>';a+="</div>";a+='<div class="linkPreviewBody">';
a+='<div class="linkPreviewTitle"></div>';a+='<div class="linkPreviewURL"></div>';a+="</div>";a+="</div>";a+='<div class="mightyWrapper">';a+='<div class="task mightyClearfix" data-task="sendWebContentToPhone">';a+='<img src="'+c+'"/>';a+='<div class="webImgPlaceHolder">';a+='<img src="" />';a+='<div class="selectHolder"></div>';a+="</div>";a+='<div class="taskCaption"></div>';a+="</div>";a+='<div class="task mightyClearfix" data-task="sendMessage">';a+='<img src="'+e+'"/>';a+='<div class="webImgPlaceHolder">';
a+='<img src=""/>';a+='<div class="selectHolder"></div>';a+="</div>";a+='<div class="taskCaption"></div>';a+="</div>";a+="</div>";a+='<img id="removeMightyOverlay" src="'+d+'" alt="removeButton"/>';return a+="</div>"}
function _b2313218b77d20f290d9350296ebbab10cfd7c5a(a,b,c,e,d){var f=a.context,g=chrome.extension.getURL("../img/web-to-phone/loading.gif"),m=chrome.extension.getURL("img/web-to-phone/send_link_to_phone3.png"),n=chrome.extension.getURL("../img/web-to-phone/send_to_phone3.png"),p=chrome.extension.getURL("img/web-to-phone/send_link_message4.png"),q=chrome.extension.getURL("../img/web-to-phone/send_pic_message7.png"),r=chrome.extension.getURL("img/web-to-phone/send_selection_to_phone.png"),t=chrome.extension.getURL("img/web-to-phone/send_selected_text.png"),
h=$(".mightyWidgetWrapper");$(h).remove();e=_c0bbaf0c4a8d7179682d384cd448c9e1030607c4(a,f,c,e,d);g='<div class="mightyWidgetWrapper mtOverLay"><div class="mightyWidgetContainer"><i class="material-icons" style="visibility:hidden;position:absolute;top:0px;left:0px;">check</i>'+('<div class="mightyComposeWidgetLoadingSpinnerWrapper"><img class="mightyComposeWidgetLoadingSpinner" src="'+g+'"/></div><div class="sendc2dmNotifWrapper"><a class="sendc2dmNotif"><i class="material-icons mightyCheckMark">check_circle</i> <span id="notifText"></span></a></div></div></div>');
var u=_5bac8fbf1b1b6a2a717ee5453a9c171817083530(f);d="web-content";h="context-menu";"composeNew"==c?(d="compose-new",h="popup-menu"):"sendMessage"==c&&(h="popup-menu");var l='<iframe scrolling="no" id="mightyIframeWidget" src="'+e+'" data-intent="'+d+'" data-web-content-type="'+f+'" data-widget-action-origin="'+h+'" ></iframe>';$(g).appendTo("body").each(function(){var d=$(this).find(".mightyWidgetContainer");"link"!=f&&"image"!=f&&"selection"!=f||$(u).appendTo(d).each(function(){if(b)if("sendToPhone"==
c){_e9cb0e3c0e78e2df8598beec3727a37fde5f37bc(this,a,f,"popup-menu");var d=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"open_link_on_phone_success"})}else{if("sendMessage"==c||"composeNew"==c)"composeNew"==c&&(f="compose-new",$("#mightyIframeWidget").attr("data-web-content-type","compose-new")),_190a8790f99cf92556b809381c9cb52cfda1e759(this,l,$(this).parent(),f,"popup-menu",a)}else{_7846d47cb827ee484efb25034a828cec6f6220d7(this,f,l,a);if("link"==f){var e=p;var g=m;var h=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_link_as_text"});
var k=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"open_link_on_phone"});d=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"open_link_on_phone_success"});$(".linkPreview").show();$(".linkPreviewTitle").text(a.tab.title).dotdotdot({ellipsis:"...",height:null});$(".linkPreviewURL").text(a.info.pageUrl).dotdotdot({ellipsis:"...",height:null});_91af1d670683a91b3c6d4cefb05e233302e7ca24(a.tab)}else"image"==f?($(".linkPreview, .linkPreviewSMS, .selectHolder").hide(),e=q,g=n,h=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_img_as_mms"}),
k=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_img_to_phone"}),d=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_img_to_phone_success"}),$("div.task > .webImgPlaceHolder").show().find("img").attr("src",a.info.srcUrl)):"selection"==f&&($(".linkPreview, .linkPreviewSMS").hide(),e=t,g=r,h=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_select_to_phone_as_text"}),k=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_select_to_phone"}),d=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"send_select_to_phone_success"}),
$(".webImgPlaceHolder").find("img").hide(),$(".webImgPlaceHolder").show().find(".selectHolder").text('"'+a.info.selectionText+'"').dotdotdot({ellipsis:'..."',height:null}));$("div[data-task='sendMessage'] .taskCaption").text(h);$("div[data-task='sendWebContentToPhone'] .taskCaption").text(k);$("div[data-task='sendMessage'] > img").attr("src",e);$("div[data-task='sendWebContentToPhone'] > img").attr("src",g)}"link"==f&&(e=_18a687b798ec8cbce9e4a8a0e65bb9ad0ba7b32c(a.tab.url),0!=e&&(d=_864e24643ee484c015bebf88538692ad8422efe7(e),
_6b95a711da21ee42c9e523800b0ed0787bd36679(e)));$("#notifText").text(d)})})}
function _c0bbaf0c4a8d7179682d384cd448c9e1030607c4(a,b,c,e,d){e="https://mightytext.net/"+e+"/#mode=compose-new&view=iframe";var f="mightytext.net/R1";"undefined"!=typeof d&&0<d.length&&(f=d);if("link"==b||"selection"==b){d="";if("composeNew"!=c){if("link"==b){var g=a.tab.title;400<g.length&&(g=g.substring(0,396)+"...")}else"selection"==b&&(g=a.info.selectionText,1E3<g.length&&(g=g.substring(0,396)+"..."));d=d+('"'+g+'"')+(" - "+a.info.shortUrl);d+=" - "+_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"sent_with_mt"})+
" ("+f+")"}if(1500>d.length)a=_5532963ef11cbd785134a51c963b08ec6f6c50f5(d),e+="&body="+a+"&type=sms";else return alert(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"select_too_long"})),!1}else"image"==b?(a=_5532963ef11cbd785134a51c963b08ec6f6c50f5(a.info.srcUrl),d=_5532963ef11cbd785134a51c963b08ec6f6c50f5("- "+_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"sent_with_mt"})+" ("+f+")"),e+="&body="+d+"&type=mms&binarysrc="+a):alert(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"gen_context_menu_error"}));
return e}
function _7846d47cb827ee484efb25034a828cec6f6220d7(a,b,c,e){var d=$(a).parent(),f=$(a).find("#removeMightyOverlay");$(a).fadeIn();$(".imgTaskSelect").on("click",function(a){a.stopPropagation()});$(".mightyWidgetWrapper").not(".imgTaskSelect").on("click",function(a){console.log(a);if("mightyIframeWidget"==$(a.target).attr("id"))return!1;_a3829499d88d9dfb5ccf75ac4e00ae956445bd7e()});$(a).find(".task").on("click",function(f){f.stopPropagation();f=$(this).attr("data-task");"sendMessage"==f?_190a8790f99cf92556b809381c9cb52cfda1e759(a,c,
d,b,"context-menu",e):"sendWebContentToPhone"==f&&_e9cb0e3c0e78e2df8598beec3727a37fde5f37bc(a,e,b,"context-menu")});$(f).on("click",function(a){_a3829499d88d9dfb5ccf75ac4e00ae956445bd7e()})}
function _92cde22547bcec46a587b93e96fc6bfbeec07ecd(a){composeNewWebappTimeout=globalComposeNewWebappTimeout;"compose_new_content_load_success"==a.data?(clearTimeout(composeNewWebappTimeout),$("#mightyIframeWidget").addClass("show"),$(".mightyComposeWidgetLoadingSpinnerWrapper").remove()):"closeIframe"==a.data?_9fda7b660bca8bc44d2ba42a066c0127e1c10d98():"successful_sendc2dm"==a.data?($("#mightyIframeWidget").fadeOut(250,function(){$(this).remove();_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!0,_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"message_sent"}));
if("compose-new"==$(this).data("intent")){iFrameKMEventName="CRX-Widget-Compose-New-Send";var a="compose-new";var c="popup-menu"}else iFrameKMEventName="CRX-Widget-Text-Web-Content-Send",a=$(this).data("web-content-type"),c=$(this).data("widget-action-origin");_b6afb5d8174c3fdc86a2854292689a85e768bba9(iFrameKMEventName,{"Content-Type":a,Client:"CRX","App-Action-Location":c})}),_ca052fd0c58dff651677328502611dd4b9f96373("CRX","Sent-Message-From-Compose-New-Iframe","Sent")):"successful_scheduled_message"==
a.data?($("#mightyIframeWidget").fadeOut(250,function(){$(this).remove();_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!0,_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"message_scheduled"}));if("compose-new"==$(this).data("intent")){iFrameKMEventName="CRX-Widget-Compose-New-Scheduled-Message";var a="compose-new";var c="popup-menu"}else iFrameKMEventName="CRX-Widget-Text-Web-Content-Scheduled-Message",a=$(this).data("web-content-type"),c=$(this).data("widget-action-origin");_b6afb5d8174c3fdc86a2854292689a85e768bba9(iFrameKMEventName,
{"Content-Type":a,Client:"CRX","App-Action-Location":c})}),_ca052fd0c58dff651677328502611dd4b9f96373("CRX","Scheduled-Message-From-Compose-New-Iframe","Scheduled")):"user_draft_saved"==a.data?_94700b7c0ca70918b5543e6de65289b604a9b516(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"draft_saved"})+".","success"):"user_draft_updated"==a.data?_94700b7c0ca70918b5543e6de65289b604a9b516(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"draft_updated"})+".","success"):"user_draft_not_updated"==a.data?_94700b7c0ca70918b5543e6de65289b604a9b516(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"draft_not_updated"})+
".","danger"):"user_draft_not_saved"==a.data?_94700b7c0ca70918b5543e6de65289b604a9b516(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"draft_not_saved"})+".","danger"):"user_created_template"==a.data&&_94700b7c0ca70918b5543e6de65289b604a9b516(_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"template_created"})+".","success")}var globalComposeNewWebappTimeout;
function _a602b2d71bbe0077db2538168c46a0a3ddda7d39(){var a=setTimeout(function(){_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!1,_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"unable_to_load_mt_iframe"}));_ca052fd0c58dff651677328502611dd4b9f96373("CRX","CRX-Widget-Iframe-Timeout");$("#mightyIframeWidget").ready(function(){});return!1},5E3);$("#mightyIframeWidget").ready(function(){$("#mightyIframeWidget").addClass("show");$(".mightyComposeWidgetLoadingSpinnerWrapper").remove();globalComposeNewWebappTimeout=
setTimeout(function(){_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!1,_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"unable_to_load_mt_iframe"}));_ca052fd0c58dff651677328502611dd4b9f96373("CRX","CRX-Widget-Iframe-Content-Timeout")},4E3);clearTimeout(a);window.addEventListener("message",_92cde22547bcec46a587b93e96fc6bfbeec07ecd)})}
function _4120045583ab3e1914d1440f2e564524dd1fe7cd(a){$("#mightyIframeWidget").addClass("show");$(".mightyComposeWidgetLoadingSpinnerWrapper").remove();void 0!=a&&clearTimeout(a)}function _a3829499d88d9dfb5ccf75ac4e00ae956445bd7e(){$(".mightyWidgetWrapper").fadeOut().remove();$.growl(!1,{command:"closeAll"})}
function _f6f0a73501379a3b071eeb7653644e97cf49c7ec(a,b,c){$(".mightyComposeWidgetLoadingSpinner").hide();void 0!=b&&$("#notifText").text(b);1!=a&&$("#notifText").css("fontSize","24px");$(".sendc2dmNotifWrapper").fadeIn(150,function(){0!=a?$(".mightyWidgetWrapper").delay(2E3).fadeOut(250,function(){$(this).remove()}):($(".mightyCheckMark").text("error").addClass("mightyError"),$(".sendc2dmNotifWrapper").delay(2E3).fadeOut(250,function(){_9fda7b660bca8bc44d2ba42a066c0127e1c10d98()}))})}
function _321c082279aeac490ed03a39fa389692da17fff6(a,b){$(a).appendTo(b).each(function(){_a602b2d71bbe0077db2538168c46a0a3ddda7d39()})}
function _190a8790f99cf92556b809381c9cb52cfda1e759(a,b,c,e,d,f){$(a).fadeOut();_321c082279aeac490ed03a39fa389692da17fff6(b,c[0]);_ca052fd0c58dff651677328502611dd4b9f96373("CRX","Context-Menu-Click-Option","Send-As-Message");a="compose-new"==e?"CRX-Widget-Compose-New-Invoke":"CRX-Widget-Text-Web-Content-Invoke";f=_18a687b798ec8cbce9e4a8a0e65bb9ad0ba7b32c(f.tab.url);0!=f&&(e="youtube.com/watch"==f?"youtube":"yelp.com/biz"==f?"yelp":"google-maps");_b6afb5d8174c3fdc86a2854292689a85e768bba9(a,{"Content-Type":e,
Client:"CRX","App-Action-Location":d});"context-menu"==d&&_b6afb5d8174c3fdc86a2854292689a85e768bba9("Context-Menu-Click-Option",{"Content-Type":e,Client:"CRX","App-Action-Location":d,Action:"Send-As-Message-"+e})}
function _e9cb0e3c0e78e2df8598beec3727a37fde5f37bc(a,b,c,e){if("selection"==c&&1E3<b.info.selectionText.length)return $(".imgTaskSelect").fadeOut(250,function(){_f6f0a73501379a3b071eeb7653644e97cf49c7ec(!1,_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"selection_too_long"}))}),!1;var d=_18a687b798ec8cbce9e4a8a0e65bb9ad0ba7b32c(b.tab.url);if(0!=d)if("youtube.com/watch"==d)c="youtube";else if("yelp.com/biz"==d)c="yelp";else if("google.com/maps"==d||"google.co.uk/maps"==d)c="google-maps";_ca052fd0c58dff651677328502611dd4b9f96373("CRX",
"Context-Menu-Click-Option","Send-To-Phone-"+c);_b6afb5d8174c3fdc86a2854292689a85e768bba9("Send-To-Phone",{"Content-Type":c,Client:"CRX","App-Action-Location":e});"context-menu"==e&&_b6afb5d8174c3fdc86a2854292689a85e768bba9("Context-Menu-Click-Option",{"Content-Type":c,Client:"CRX",Action:"Send-To-Phone"});chrome.runtime.sendMessage({sendContentToPhone:!0,action_data:b,context:c},function(b){b=b.confirmation;b=jQuery.parseJSON(b);console.log(b);$(a).fadeOut().remove()})}
function _91af1d670683a91b3c6d4cefb05e233302e7ca24(a){var b=$('meta[property="og:image"]'),c=$('meta[name="og:image"]');console.log({og:b});a=0<b.length?b[0].content:0<c.length?c[0].content:a.favIconUrl;console.log(a.length);0<a.length&&$(".linkPreviewImg > img").attr("src",a)}function _18a687b798ec8cbce9e4a8a0e65bb9ad0ba7b32c(a){var b=!1;$(globalArrayOfApprovedHostsForCustomPushToPhone).each(function(c,e){-1<a.indexOf(e)&&(b=e)});return b}
function _864e24643ee484c015bebf88538692ad8422efe7(a){var b="";"google.com/maps"==a||"google.co.uk/maps"==a?b=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"map_to_phone_success"}):"youtube.com/watch"==a?b=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"vid_to_phone_success"}):"yelp.com/biz"==a&&(b=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"yelp_to_phone_success"}));return b}
function _6b95a711da21ee42c9e523800b0ed0787bd36679(a){if("youtube.com/watch"==a){var b=chrome.extension.getURL("img/web-to-phone/send_video_to_phone.png");var c=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"vid_to_phone"})}else"yelp.com/biz"==a&&(b=chrome.extension.getURL("img/web-to-phone/send_yelp_to_phone.png"),c=_17b88bbdae4990e1a40e4c9175cb0cb5f572c185({key:"yelp_to_phone"}));$("div[data-task='sendWebContentToPhone'] .taskCaption").text(c);$("div[data-task='sendWebContentToPhone'] > img").attr("src",
b)}function _94700b7c0ca70918b5543e6de65289b604a9b516(a,b){$.growl(a,{type:b,z_index:99999999999,delay:6E5,template:'<div data-growl="container" class="alert mightyAlert" role="alert"><button type="button" class="close" data-growl="dismiss"><span aria-hidden="true">\u00d7</span><span class="sr-only">Close</span></button><span data-growl="icon"></span><span data-growl="title"></span><span data-growl="message"></span><a href="#" data-growl="url"></a></div>'})}
function _9fda7b660bca8bc44d2ba42a066c0127e1c10d98(){window.removeEventListener("message",_92cde22547bcec46a587b93e96fc6bfbeec07ecd,!1);$.growl(!1,{command:"closeAll"});$(".mightyWidgetWrapper").fadeOut(250,function(){$(this).remove()})};