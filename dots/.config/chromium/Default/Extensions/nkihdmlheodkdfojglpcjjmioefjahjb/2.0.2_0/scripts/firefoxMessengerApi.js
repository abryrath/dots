var singleton = (function(){
  var instance;
  var pingElement;
  var messageElement;
  function init(){
    return {
      appendChild: function(){
        pingElement = document.createElement("BsFirefoxExtensionPingElement");
        document.documentElement.appendChild(pingElement);
        messageElement = document.createElement("BsFirefoxExtensionElement");
        document.documentElement.appendChild(messageElement);
      },
      returnPingElement: function(){
        return pingElement;
      },
      returnMessageElement: function(){
        return messageElement;
      }
    };
  };

  return {
    getInstance: function(){
      if(!instance){
        instance = init();
      }
      return instance;
    }
  };
})();

var FirefoxMessengerApi = function() {
  if ($.browser.name == 'firefox') {    
    this.sendMessage = function(message, callback) {
      if(message.type === "connectionStatus"){
        var pingEvent = document.createEvent("Events");
        pingEvent.initEvent("BsFirefoxExtensionPingRequestEvent", true, false);
        var singleInstance = singleton.getInstance();
        singleInstance.appendChild();
        var pingElement = singleInstance.returnPingElement();

        pingElement.addEventListener("BsFirefoxExtensionPingResponseEvent", function(pongEvent) {
          var response = JSON.parse(pongEvent.target.getAttribute("Reply"));
          callback(response);
        });
        
        pingElement.setAttribute("Message", JSON.stringify(message));

        pingElement.dispatchEvent(pingEvent);
      } else {
        var responseFlag = false;
        var messageEvent = document.createEvent("Events");
        messageEvent.initEvent("BsFirefoxExtensionRequestEvent", true, false);
        var singleInstance = singleton.getInstance();
        singleInstance.appendChild();
        var messageElement = singleInstance.returnMessageElement();

        messageElement.addEventListener("BsFirefoxExtensionResponseEvent", function(pongEvent) {
          responseFlag = true;
          var response = JSON.parse(pongEvent.target.getAttribute("Reply"));
          document.documentElement.removeChild(messageElement);
          callback(response);
        });

        messageElement.setAttribute("Message", JSON.stringify(message));
        messageElement.dispatchEvent(messageEvent);

        if(message.type === "installStatus") {
          var trials = 0;
          var id = setInterval(function() {
            if(responseFlag) {
              clearInterval(id);
            } else {
              trials += 1;
              if(trials < 3) {
                // dispatch again
                messageElement.dispatchEvent(messageEvent);
              } else {
                clearInterval(id);
                callback({installed: false});
              }
            }
          }, 200);
        } // if(message.type === "installStatus")
      } // if(message.type === "connectionStatus")
    };
  }
};
