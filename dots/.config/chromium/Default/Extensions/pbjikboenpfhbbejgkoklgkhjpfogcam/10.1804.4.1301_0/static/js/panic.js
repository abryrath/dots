function forceReflow(e){var t=(document.querySelector(e)||{}).style,n=".1px solid rgba(0,0,0,0)",r;if(!t||window.outerHeight>=600)return;r=t.border,t.border=n,window.setTimeout(function(){t.border=r},200)}function onLoad(){hideLoadingSpinner(),clearTimeout(pageWaitTimeout),forceReflow("#panelHtml")}function hideLoadingSpinner(){spinnerDiv&&(spinnerDiv.style.display="none")}function logBreadCrumb(e){var t,n=-1,r={},i="default";try{n=window.performance.now(),r=window.performance.timing.toJSON(),i=window.location.href}catch(s){}if(typeof chrome!="undefined")t=chrome.runtime;else{if(typeof browser=="undefined")return;t=browser.runtime}try{var o={performanceType:0,location:i,performanceSession:"panic.js",payload:{name:"panic.js",status:e,elapse:n,timing:r}};t.sendMessage(o)}catch(s){}}function loadRetryScreen(e){logBreadCrumb(0);if(!e||e!==gateway_iframe_blank_error&&e!==gateway_page_timeout_error)e=gateway_iframe_load_error;!retryScreenShownAlready||falseBoolString===retryScreenShownAlready?(setToLocalStorage(retryScreenShownStorageKey,trueBoolString)||(e=gateway_local_storage_error),gatewayFrame.src=retryHtmlFileName+"?errorCode="+errorCodePrefix+e,logBreadCrumb(1)):(gatewayFrame.src=subsequentRetryFileName+"?errorCode="+errorCodePrefix+e,logBreadCrumb(1))}function isValidGatewayURL(){return!!(gatewayFrame&&gatewayFrame.src&&gatewayFrame.src.indexOf(blankIframeURL)<0&&gatewayFrame.src.indexOf(retryHtmlFileNameString)<0&&gatewayFrame.src.indexOf(subsequentRetryFileNameString)<0)}function gatewayFrameHandler(){try{localStorage&&(retryScreenShownAlready=getFromLocalStorage(retryScreenShownStorageKey))}catch(e){}gatewayFrame.onerror=loadRetryScreen,gatewayFrame.onload=onLoad;var t=!retryScreenShownAlready||falseBoolString===retryScreenShownAlready?retryScreenWaitTime:subsequentRetryScreenWaitTime;setTimeout(function(){gatewayFrame&&gatewayFrame.src.indexOf(blankIframeURL)>=0&&loadRetryScreen(gateway_iframe_blank_error)},t),pageWaitTimeout=setTimeout(function(){isValidGatewayURL()&&loadRetryScreen(gateway_page_timeout_error)},pageWaitTime)}var gatewayIframeId="UBPv2MainPanelFrame",spinnerDivId="spinnerSection",retryScreenShownStorageKey="ubpv2.retry.screen.shown",retryScreenShownAlready="",retryScreenWaitTime=3e3,subsequentRetryScreenWaitTime=1e4,pageWaitTime=15e3,pageWaitTimeout,retryHtmlFileName="./retry.html",subsequentRetryFileName="./subsequentRetry.html",falseBoolString="false",trueBoolString="true",blankIframeURL="about:blank",retryHtmlFileNameString="retry.html",subsequentRetryFileNameString="subsequentRetry.html",gatewayFrame=document.getElementById(gatewayIframeId),spinnerDiv=document.getElementById(spinnerDivId),errorCodePrefix="ext",gateway_iframe_load_error="101",gateway_iframe_blank_error="102",gateway_page_timeout_error="103",gateway_local_storage_error="104";window.addEventListener("DOMContentLoaded",function(){gatewayFrameHandler()});