$("a").each(function(index, item){
  var thisAnchorTagHref = $(item).attr("href");
  console.info("Anchor tag found, with href: " + thisAnchorTagHref);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if(request.hasOwnProperty("content_script_check")){
      sendResponse({
        running_content_script: true
      });
    }
  }
);
