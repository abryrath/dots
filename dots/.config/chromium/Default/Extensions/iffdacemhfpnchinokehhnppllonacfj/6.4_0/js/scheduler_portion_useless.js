	
	
	
	// IF MESSAGE WAS SCHEDULED THIS LOGIC WILL MAKE SURE WE CORRECTLY DISPLAY THE MESSAGE IN IT'S CURRENT STATE (PENDING, SENT, CANCELLED, ETC...)
	var scheduledClass = '';
	if(messageInfo.event_id && (messageInfo.event_id != 0))
		{
		
		
			if (messageInfo.inbox_outbox == 61)
				{    //outbound
				
					//CRV add a check to see if the message has acked yet.  We must also check the source_client to ensure that the text was sent from teh web app and not the phone as texts sent from the phone have no ack_phone_sent value.
					if(messageInfo.status_route == 2)
						{
							wasThisMessageSentFromTheWebApp = 'no ack yet';
						}
					
					console.log(wasThisMessageSentFromTheWebApp);
					if(wasThisMessageSentFromTheWebApp)
						{
							optionalSendFromWebAppImg = '<div id="'+ messageInfo.id +'" class="sentMessageStatus" data-toggle="tooltip" data-original-title="Waiting for phone to send message" data-trigger="hover" data-placement="bottom"><img src="' + scheduledMessageImgURL + '" alt="scheduled message pending" width="15" height="15" /></div>';
						}
				}
		
			
			eventHistoryIcon = '<i id="eventHistory_' + messageInfo.event_id + '" class="icon-calendar eventHistoryIconInThread moreInfoStatus" data-eventid="' + messageInfo.event_id + '"></i>';
			scheduledClass = 'scheduledMessage';
			var scheduledTSMessage = 'Scheduled to send at: ';
			if(messageInfo.status_route == 10){
				scheduledTSMessage = '';
				scheduledClass = 'scheduledMessageSENT'; //CRV if this was a scheduled message, but it's already been sent, don't show it in the pending state. 
				optionalSendFromWebAppImg = '<div id="'+ messageInfo.id +'" class="sentMessageStatus" data-toggle="tooltip" data-original-title="Sent Scheduled Message" data-trigger="hover" data-placement="bottom"><img src="scheduler_1_with_green_checkmark.png" alt="" width="17" height="17" /></div>';
			} else {
				var eventJSON = jQuery.parseJSON(messageInfo.event_list); 
				//console.error('eventJSON');
				//console.error(eventJSON);
				var eventInfo;
				if((eventJSON) && (eventJSON.eventlist_details)){
						eventInfo = eventJSON.eventlist_details;
				} else {
						eventInfo = messageInfo.event_list;
				}
				
				console.log('event_list:');
				console.log(eventInfo);
				messageTimeStamp = '<span class="timestamp-msg">Scheduled to send at: ' + cleanTimeDisplayPurposes(eventInfo.ts_event_trigger,false) + '</span>';
			
			
				if((eventInfo.status == 703) || (eventInfo.status == 706) || (eventInfo.status == 799)){//CRV something on the device has failed in association with this scheduled message
					
						var optionalToolTipClass = '';
						
						if(eventInfo.status == 799){
							optionalToolTipClass = 'scheduledEventFailed';
						} else if(eventInfo.status == 706) {
							optionalToolTipClass = 'scheduledEventSchedulingFailed';
						} else if(eventInfo.status == 703){
							optionalToolTipClass = 'scheduledEventCancellingFailed';
						}
						//eventWarningOptional = '<i class="scheduledEventWarningIcon icon-warning-sign ' + optionalToolTipClass + '"></i>';
						optionalSendFromWebAppImg = '<div id="'+ messageInfo.id +'" class="' + optionalToolTipClass + '" data-toggle="tooltip" data-original-title="Scheduled Message Send Failed" data-trigger="hover" data-placement="bottom"><img src="scheduler_1_with_error_state_triangle.png" alt="scheduler_1_with_red_cancel" width="17" height="17" /></div>';
				} else if(eventInfo.status == 701) {//CRV event scheduled in process
						scheduledClass = 'pendingScheduledMessage';
						messageTimeStamp = '<span class="timestamp-msg">Scheduling in Process</span>';
				} else if(eventInfo.status == 704) {
						messageTimeStamp = '<span class="timestamp-msg">Cancelling Event...</span>';
				} else if(eventInfo.status == 705) {//CRV event was cancelled
				   	scheduledClass = 'scheduledMessageCancelled';
				   	messageTimeStamp = '<span class="timestamp-msg">Cancelled</span>';
				   	optionalSendFromWebAppImg = '<div id="'+ messageInfo.id +'" class="sentMessageStatus" data-toggle="tooltip" data-original-title="Message Cancelled" data-trigger="hover" data-placement="bottom"><img src="scheduler_1_with_red_cancel.png" alt="scheduler_1_with_red_cancel" width="17" height="17" /></div>';
			   	} else if(eventInfo.status == 799) {//CRV event was cancelled
				   	scheduledClass = 'scheduledMessageFailed';
				   	messageTimeStamp = '<span class="timestamp-msg">Message Send Failed</span>';
			   	} else {
			   		cancelEventOptional = '<i class="icon-remove cancelEventInMessage" onclick="cancelEvent(\'' + eventInfo.event_id + '\')"></i>'
		   		}
            }
        }

	var htmlToAdd = '<div id="sms-line-item-msgid-'+messageInfo.id+'" class="threadItem ' + threadItemType + ' ' + scheduledClass + '" name="' + messageInfo.id + '">' + threadItemCheckBox + optionalSendFromWebAppImg + eventWarningOptional + cancelEventOptional + eventHistoryIcon + body + optionalSenderInfo + '<div class="itemActions">' + forwardLink + starIcon + '<a id="DELETE-MESSAGE-' + messageInfo.id + '" class="deleteMessageLinkTag" onclick="processDeleteSingleMessage(\'' + messageInfo.id + '\',\'' + messageInfo.phone_num_clean + '\',\'' + messageInfo.type + '\');"><div class="deleteOneMessage deleteOneMessageIcon messageAction"></div></a>' + messageTimeStamp + '</div></div>';

	return(htmlToAdd);