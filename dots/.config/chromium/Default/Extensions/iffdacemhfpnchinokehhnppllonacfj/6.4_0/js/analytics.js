function recordPUSHHealthCheckEvent(data){//moved to clean because it's referenced in BOTH firebase.js and capi-health-checker.js

	var eventData = {//default values
		"push_type": "frd"
	};
		
	$.extend(eventData, data);

	recordMTStatsEvent({
		event: {
			name: "event_push_stats",
			options: eventData
		}
	});

}

function recordMTStatsEvent(data = {}){//moved to clean because it's referenced in BOTH firebase.js and capi-health-checker.js

	var eventData = {//default values
		"client": "crx-new",
		"browser": BrowserDetect.browser,
		"browser_version": BrowserDetect.version,
		"os": BrowserDetect.OS					
	};
		
	eventData.app_version = manifest.version;//passing app version 1.11.18 KL

	if(typeof globalUserName != "undefined"){
		eventData.email = globalUserName;
	} else if (typeof userEmail != "undefined"){//gtext specific username global 1.22.18 KL
		eventData.email = userEmail;
	}
	
	var postData = {
		"function": "addEvent",
		"event": "event_client_metric"//default to event_client_metrics table
	}
	
	if("event" in data && "name" in data.event){//allow us to override the event we want to record.  Correlates to the table that we want to persist the data to in BQ 10.11.17 KL
		postData.event = data.event.name;
	}

	$.extend(eventData, data.event.options);
	
	try{
		postData.data = JSON.stringify(eventData);
	} catch (err){
		console.error("Error processing event data in recordMTStatsEvent: " + err);
	}
	
	$.ajax({
		type: "POST",
		url: "https://stats.mightytext.co",
		timeout: 10000,
		data: postData,
		dataType: "text",
		success: function(reply_server){
// 			console.error("analytics reply:", reply_server);
		}

	})
}

// end generic MT stats code


//start client check-in code

function clientIntraSessionCheckIn(data = {}){
	var intraSessionCount = 1,
		timeInMSBeforeNextCheckIn = 60 * 60 * 1000;//check in every hour
// 		timeInMSBeforeNextCheckIn = 5 * 1000;//check in every hour

	
	if("count" in data){//override the current count
		intraSessionCount = data.count;
	}

	recordMTStatsEvent({
		event:{
			name: 'event_client_metric',//we default to this event name, but leaving here as a reminder that we can override this value from the caller
			options:{
				type: "session-alive",
				count_in_session: intraSessionCount,
				email: globalUserName
			}
		}
	});
	
	setTimeout(function(){
		intraSessionCount++;
		data.count = intraSessionCount;//update count
		clientIntraSessionCheckIn(data);
	}, timeInMSBeforeNextCheckIn);
	
}

function getRandomInt (min, max) {//added here because analytics.js is the first script loaded, because it's referenced all through out the code to record custom MT stats events 1.8.18 KL
    return Math.floor(Math.random() * (max - min + 1)) + min;
}