var tooltipShowDelayGlobal = 300;
var tooltipHideDelayGlobal = 200;

/* CRV START OF SCHEDULER JS */

function setInstructionsForScheduler(id)
	{
		if(!isAProUser){
/*
				$('#' + id).click(function(){
					notProUserNotify('schedule-msg');
				});
*/
            $("#"+ id).on("click", function(e){
/*                 alert("not pro");     */
                displayNonProUserAlertModal("schedule-msg");
            })
/* 			return(false); */
		} else {
		
    		var test = $("#"+id);
    		console.log(test);
    		$('#' + id).datepicker({
    	        setDate: new Date(),
            	startDate: new Date(),
            	orientation: "right"
        	}).on('show', function(e){
        		if($('#addedContent').length > 0){
        				//CRV don't need to append anything as selector is alreay in dom
        		} else {
        				//CRV we have to hide and then show the datepicker again now that we have added the time selector.  We have to do this because the datepicker is positioned absolutely on show.  The first time the datepicker is added to the dom and positioned, there is no time selector there.  So, once the timepicker has been added, we have to trigger a hide and a show to ensure correct positioning.
    /*     				alert("no"); */
    /*
                        var today = new Date();
                        $('#' + id).datepicker('setDate', today);
    */
    /*                     $('#' + id).datepicker('update'); */
    
        				var timeSelector = $(buildTimePickerHtml(id)).appendTo('.datepicker-days');                    
    
        				$('#' + id).datepicker('hide'); 
        				$('#' + id).datepicker('show');
        				setTimeSelectorInstructions(timeSelector);
                }
                callKMInBackgroundPage('msg-composer-action', {'action': 'schedule', 'client': 'CRX-New', 'Subclient': currentLocation});
                
        	});
    			
		/*
$('#' + id).click(function(){
		
			$('.closeSchedulerModal').text('Cancel');
			
			//CRV check to see if this text has already had a scheduled time set
			if($(this).siblings('.scheduledLabel').length > 0)
				{
					//CRV this message already has a scheduled label, so let's populate the scheduler modal with the pre-existing date and time.
					var date = $(this).siblings('.scheduledLabel').children('.scheduledTime').attr('data-date');
					var time = $(this).siblings('.scheduledLabel').children('.scheduledTime').attr('data-time');
					$('#datepickerModal').val(date);
					$('#timepickerModal').val(time);
					$('.closeSchedulerModal').text('Cancel Edit');
				}
				
			//CRV init date and time selector	
			var datePicker = $('#datepickerModal');
			var timePicker = $('#timepickerModal');
			setDatePickerInstructions(datePicker, timePicker);	
		
			$('#schedulerModal').modal('toggle');
			
			$('#schedulerModalIDHolder').empty().text(id);
		});
*/
    		
		}
	}
	
function setTimeSelectorInstructions(html)
	{
    	//alert(3);
		var currentDate = new Date();
//		console.log(currentDate);
		var currentMinute = currentDate.getMinutes();
		var minuteToSet = (5 * Math.floor(currentMinute/5)) + 10; //CRV find closest future increment of "5" and then add 5 more minutes
		var currentHour = currentDate.getHours();
		var currentAmPm = 'am';
		
		if(minuteToSet >= 60)
			{
				if(minuteToSet == 65)
					{
						minuteToSet = 5;
						currentHour = currentHour + 1;
					}
				else
					{
						minuteToSet = 0;
						currentHour = currentHour + 1;
					}
			}
		
		if((currentHour > 11) && (currentHour < 24))
			{
				currentAmPm = 'pm';
			}
		
		if(currentHour > 12) //CRV this is a PM time
			{
				currentHour = currentHour - 12;
			}
			
		if(currentHour == 0)
			{//in the 12am hour
				currentHour = 12; 
				//CRV we must change this value AFTER we do the ampm check.
			}

        addAdaptionClasses(html);//ADDING OUTLOOK CLASS TO THE SET DATE AND TIME BUTTON.
		
		$(".minuteSelect").val(minuteToSet).attr('selected',true);
		$(".hourSelect").val(currentHour).attr('selected',true);
		$(".amPmSelect").val(currentAmPm).attr('selected',true);
		
		//CRV this sets the instructions for creating the scheduled label in the dom
		$(html).find('#setDateAndTimeButton').click(function(){
			var parentButtonID = $(this).attr('data-button-triggered-from');
			var date = $('#' + parentButtonID).datepicker('getDate');
//     			date = new Date(date);
			var amPm = $('.amPmSelect').val();
			var hours = parseInt($('.hourSelect').val());  //CRV Needed to turn this into an interger so that we can add 12 hours to the time
			if((amPm == 'am') && (hours == 12))
				{
					//CRV this is midnight.
					hours = 0;
				}
			
			if((amPm == "pm") && (hours != 12))
				{
					hours = hours + 12;
				}
			var minutes = $('.minuteSelect').val();
			
            var dateSelected = moment({y:moment(date).year(), M:moment(date).month(), d:moment(date).date(), h:parseInt(hours), m:parseInt(minutes)});
			
			var scheduledTextRecipient = $('#schedulerModalIDHolder').text();
			//alert(schedulerModalIDHolder);
			var UNIXscheduledTime = dateSelected.valueOf();
			
			if(isAValidSchedulerDateAndTime(UNIXscheduledTime))
				{
					createScheduledMessageLabelInDom(UNIXscheduledTime, scheduledTextRecipient);
					$('#' + parentButtonID).datepicker('hide');
					callKMInBackgroundPage('scheduled-msg-time-selected', {'Client':'CRX-New', 'Subclient' : currentLocation});
					callIntercomInBackgroundPage('pro-scheduled-msg-time-selected');
				}
			else
				{
					
					return(false);
				}
		});
	}	
	
function buildTimePickerHtml(id)
	{
    	//alert("inside buildTimePickerHTML");
		var html = '';
		
		html += '<div id="addedContent">';
		html += '<select name="hour" class="hourSelect timeSelector" style="width: 60px"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>';
		html += '<select name="minute" class="minuteSelect timeSelector" style="width: 60px"><option value="0">00</option><option value="5">05</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="25">25</option><option value="30">30</option><option value="35">35</option><option value="40">40</option><option value="45">45</option><option value="50">50</option><option value="55">55</option></select>';
		html += '<select name="ampm" class="amPmSelect timeSelector" style="width: 60px"><option value="am">AM</option><option value="pm">PM</option></select>';
		html += '<button id="setDateAndTimeButton" class="mightyButton dateAndTimeButton" data-button-triggered-from="' + id + '">Set</button>';
		html += '<span id="schedulerModalIDHolder">' + id + '</span>';
		html += '</div>';
		
		
		return(html);
	}

function getEventList(start, end)
	{
		$('#getMoreEventsButton').hide();
		$('#eventsContainer').append('<div style="margin:auto;" class="masterSpinner"></div>');
			
		$.ajax({
		   type: "GET",
		   url: baseUrl + '/event?function=getEventsFullDetails&start_range=' + start + '&end_range=' + end,
		   dataType: "json",
		   xhrFields: { withCredentials: true},
		   success: function(reply_server){
			   console.log('success in getEventList');
			   console.log(reply_server);
			   
			   if(reply_server['user'] && (reply_server['user'] == 'not_premium'))
			   	{
				 	//notProUserNotify();
				 	//return(false);
			   	}
			   
			   numberRowsSuccessFullyAdded = 0; //CRV reset the global counter for number of rows loaded in the table
			   
			   
			   
			   //CRV the chunk of code commented out below adds the pending vs. all events selector.  Does not need to be pushed to production but is useful while testing. 
			   /*
if(start == 0)
			   	{
				   	$('#eventsContainer').prepend('<div id="eventSelectorContainer"><p style="display: inline-block; margin-right:5px;">View: </p><select id="eventViewSelector"><option value="all">All Events</option><option value="pending">Pending Events</option></select></div>');
				   	
				   	$('#eventViewSelector').change(function(){
					   var eventsView = $('#eventViewSelector').val();
					   
					   if(eventsView == 'all')
					   	{
						   	$('.pastEvent').each(function(){
							   	$(this).removeClass('eventNoDisplay');
						   	});
						   	
						   	if($('#noPendingEventsWarning').length > 0)
						   		{
							   		$('#noPendingEventsWarning').remove();	
						   		}
					   	}
					   	else if (eventsView == 'pending')
					   		{
						   		$('.pastEvent').each(function(){
							   		$(this).addClass('eventNoDisplay');
							   	});
							   	
							   	if($('.pendingEvent').length < 1)
							   		{
								   		
								   		$('#eventsContainer').append('<div id="noPendingEventsWarning">There are no pending events.</div>')
							   		}
					   		}
					   	
				   	});
			   	}
			   
*/
			   for(var i=0; i< numberEventsToFetch; i++)
				{
					if(reply_server.eventlist_full_details[i])
						{
							addEventRowToEventsTable(reply_server.eventlist_full_details[i])
						}
				}
				
				if(reply_server.eventlist_full_details[numberEventsToFetch])
					{
						$('#getMoreEventsButton').show(); 
						//CRV there is at least one more event.  Show the load more button.
					}
				else
					{
						$('#getMoreEventsButton').hide();
						//CRV there are no more events.  Hide the show more button
					}
				
				//CRV remove spinner from events table
				$('#eventsContainer').children('.masterSpinner').remove();
				
				//CRV the onclick event handler for the events tab can only trigger once, so we must reset teh event handler so that the user can click this tab again. 
				
				/*
$('#events').one("click", function() {

					if (!doesUserWantToLeaveUnSentMessage())
						{
							$('.textResponse').focus();        //MA NOTE: re-focus the user's cursor back in the text area
							return(false);                     //MA NOTE: returning "false" is better
						}
				
					//setThisLeftNavBarItemAsCurrentActive(this);
					threadDisplayModeGlobal = 'EVENTS';
					loadWebAppView();

				});
*/
				
		   },
		   error: function(reply_server){
			   console.log('error in getEventList');
			   console.log(reply_server);
			   
			   //CRV the onclick event handler for the events tab can only trigger once, so we must reset teh event handler so that the user can click this tab again. 
			   $('#events').one("click", function() {

					if (!doesUserWantToLeaveUnSentMessage())
						{
							$('.textResponse').focus();        //MA NOTE: re-focus the user's cursor back in the text area
							return(false);                     //MA NOTE: returning "false" is better
						}
				
					//setThisLeftNavBarItemAsCurrentActive(this);
					threadDisplayModeGlobal = 'EVENTS';
					loadWebAppView();

				});
			   
		   }
		});
	}

function getMoreEventsForTable()
	{
		//CRV get the number of events already in the table and then request the next 20 + 1.  We only display 20, but we request 21 to see if we should show a load more button or not. 
		var numberOfEventsInTableAlready = $('#eventTableBody').children().length;
		getEventList(numberOfEventsInTableAlready, numberEventsToFetch + 1);
	}


function addEventRowToEventsTable(eventInfo)
	{
		
							var event = eventInfo;
							//addMediaToDom(mediaItem, 'append');
							console.log('ran through loop for event');
							console.log(event);
							
							var pastOrPendingEvent = 'pendingEvent';	
							var currentTS = new Date().getTime();
							if((currentTS > event.ts_event_trigger) || (event.status == 705))
								{
									pastOrPendingEvent = 'pastEvent';	
								}
							
							
							
							var messageInfo = jQuery.parseJSON(eventInfo.ref_obj)
							console.log('messageInfo:');
							console.log(messageInfo);
							
							var totalNumberOfContent2RowsForEvent = messageInfo.message.length;
							console.log(totalNumberOfContent2RowsForEvent);
							var eventTargetName = '';
							for(var m=0; m< totalNumberOfContent2RowsForEvent; m++) 
							{
									//CRV we need to build the contact names string to display in the events table as there may be multiple recipients for this scheduled Event
									var phone_num = messageInfo.message[m].phone_num;
									var clean_phone_num = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(phone_num, 'do_not_zeropad');
									var contact = genericGetContactNameFromCaches(clean_phone_num, phone_num);
									
									eventTargetName += contact;
									
									if(m < (totalNumberOfContent2RowsForEvent - 1))  //CRV this contact is NOT the last contact for this event, so add a comma and a white space to the contacts string
										{
											eventTargetName += ', ';
										}
							}
							
							var msgType = messageInfo.message[0].type;
							
							var optionalEventsTableMessageTypeFlag = '';
							if((msgType == 20) || (msgType == 21))
								{
									optionalEventsTableMessageTypeFlag = '<img class="eventsTableGroupIcon" src="assets/groupMMS.png" alt="groupMMS">';
								}
							
							
			   
			   
			   var cancelledButton = '<div class="cancelEventButton" onclick="cancelThisEvent(\'' + event.event_id + '\')"><i class="icon-remove cancelEventInTable"></i></div>';
			   var currentTS = new Date().getTime();
			   if(currentTS > event.ts_event_trigger)
			   	{
				   	cancelledButton = ' ';
			   	}
				if(event.status == 705)
					{
						cancelledButton = '';
					}
				if(event.status == 710)
					{
						cancelledButton = '';
					}
					
				
				
			   var html = '';
			   html += '<tr id="event_' + event.event_id + '" class="' + pastOrPendingEvent + '">';
							
			   html += '<td class="event_message">' + buildMessageBodyHTMLForEventsTable(messageInfo.message[0], event) + '</td>';
			   html += '<td class="event_contact">' + optionalEventsTableMessageTypeFlag + eventTargetName + '</td>';
			   html += '<td class="event_status">' + convertStatusCodeToIcon(event.status) + '<i id="eventHistory_' + event.event_id + '" class="icon-search moreInfoStatus"></i>' + convertStatusCodeToText(event.status)  + cancelledButton + '</td>';
			   html += '<td class="event_ts_creation">' + createTwoLineTimeStamp(event.ts_creation,true) + '</td>';
			   html += '<td class="event_ts_trigger">' + createTwoLineTimeStamp(event.ts_event_trigger,false) + '</td>';
			   html += '</tr>';			
			   
			   				
			   var newEventTableRow = $(html).appendTo('#eventTableBody');
			   
			   var eventHistoryIcon = $(newEventTableRow).children('.event_status').children('.moreInfoStatus');
			   
			   
			   
			   //CRV init fancybox if it exists
			   $(newEventTableRow).find("a#fancyimagepopup").fancybox({
					'type'	: 'image',
					'transitionIn'	: 'elastic',
					'transitionOut'	: 'elastic'
				});
			   
				if(optionalEventsTableMessageTypeFlag.length > 0)
					{
						var groupMessageIcon = $(newEventTableRow).find('.eventsTableGroupIcon');
						setTooltipForGroupIcon(groupMessageIcon);
					}
				
				if(cancelledButton.length > 0)
					{
						var cancelButtonIcon = $(newEventTableRow).find('.cancelEventInTable');
						setDeleteIconTooltip(cancelButtonIcon);
					}
					
			   setInstructionsForEventHistoryDropDown(eventHistoryIcon, event.event_id);
							
							
							
							//getContent2Info(event, reply_server.eventlist_full_details.length);
						
	}

function createTwoLineTimeStamp(datestring, should_convert_utc)
	{
		//CRV get the timestamp at midnight of the current day
		var now = new Date();
		var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0);
		console.log('seconds since midnight');
		console.log(midnight);
		
		
		
		if (should_convert_utc)
			datestring = datestring + ' UTC'; // this tells JS to convert it to local once you give it to the Date() function
		
		var a_p = "";
		var d = new Date(datestring);
		
		//CRV calculate the difference (in hours) between the timestamp that was passed into the function and the "Midnight" timestamp calculated above.
		var a = moment(midnight);
		var b = moment(d);
		var twoLineTimeString = '';
		var numberOfHoursSinceMidnight = b.diff(a, 'hours', true); //CRV must pass true to keep this number from being rounded
		
		
		//CRV else, return the entire, date + time timestamp string
		twoLineTimeString = moment(d).format("MMM DD") + '<br>' + moment(d).format("h:mma");
		return(twoLineTimeString);

	}
	

function buildMessageBodyHTMLForEventsTable(messageInfo, eventInfo)
	{
		messageInfo['event_list'] = eventInfo;
		//console.error(messageInfo);
		var messageBody = buildMessageHTML(messageInfo);
		/*
var body = createHTMLEquivalentOfMessageBody(messageInfo.body);
		
		var messageBody = body;
		
		if(messageInfo.mms_object_key)
			{
				var blobKey = messageInfo.mms_object_key;
				var mms_blob_url = baseUrl + '/imageserve?function=fetchFile&id=' + messageInfo.id;
				var mms_blob_url_thumbnail = baseUrl + '/imageserve?function=fetchViaServingUrl&resize=350&id=' + messageInfo.id;	
				var messageBody = '<a id="fancyimagepopup" href="' + mms_blob_url + '" class="mmsImgWrap" data-blobkey="' + blobKey + '"> <img src="' + mms_blob_url_thumbnail + '" alt="Photo in process" class="eventTableMMSPreview"></a></div><br><span>' + body + '</span>';
			}
*/
		return(messageBody);
		
	}


function setTooltipForGroupIcon(html)
	{
		var groupEventTTOptions = {
			trigger: 'hover',
			title: 'Group Message',
			placement: 'bottom',
			delay: { show: tooltipShowDelayGlobal, hide: tooltipHideDelayGlobal }
		};
		$(html).tooltip(groupEventTTOptions);
	}

function setDeleteIconTooltip(html)
	{
		var deleteEventTTOptions = {
			trigger: 'hover',
			title: 'Cancel Scheduled Message',
			placement: 'bottom',
			delay: { show: tooltipShowDelayGlobal, hide: tooltipHideDelayGlobal }
		};
		$(html).tooltip(deleteEventTTOptions);
	}

function setInstructionsForEventHistoryDropDown(domElement, eventID)
	{
		//CRV set tooltip for event history icon
		var eventHistroyTTOptions = {
			trigger: 'hover',
			title: 'See History',
			placement: 'bottom',
			delay: { show: tooltipShowDelayGlobal, hide: tooltipHideDelayGlobal }
		};
		$(domElement).tooltip(eventHistroyTTOptions);
		
		
		$(domElement).click(function(){
			
			if($('#eventTable_' + eventID).length > 0)
				{
					//CRV the popover already exists
					
					//alert('popover already exists');
					$(domElement).popover('toggle');
					
				}
			else //CRV popover does not yet exist. Create it. 
				{
					//CRV remove any other event history popovers that might be open. 
					$('.moreInfoStatus').not('#eventHistory_' + eventID).popover('destroy');
					
					
					$.ajax({
				   type: "GET",
				   url: baseUrl + "/event?function=getEventHistory&event_id=" + eventID,
				   dataType: "json",
				   xhrFields: { withCredentials: true},
				   success: function(reply_server){
					   console.log('success in showEventHistory');
					   console.log(reply_server);
					   var eventsHtml = '';
					   for(var i=0; i< reply_server.eventhistory.length; i++)
						{
							
							
							if(reply_server.eventhistory[i])
								{
									var event = reply_server.eventhistory[i];
									//addMediaToDom(mediaItem, 'append');
									console.log('ran through loop for event history');
									console.log(event);
									var status = event.status;
									var statusText = convertStatusCodeToText(status);
									var statusIcon = convertStatusCodeToIcon(status);
									
									eventsHtml += '<tr><td>' + statusIcon + statusText + '</td><td style="width:96px;">' + cleanTimeDisplayPurposes(event.ts, true) + '</td></tr>';
								}
						}
					   
					   var eventHistoryTable = '';
					   eventHistoryTable += '<table id="eventTable_' + eventID + '" class="table">';
					   eventHistoryTable += eventsHtml;
					   eventHistoryTable += '</table>';
					   
					   //$(domElement).popover('destroy');
					   $(domElement).popover({placement:'bottom',trigger:'manual', html:true, title:'Message History',content:eventHistoryTable});
					   
					   $(domElement).popover('show');
					   
		
					   
					   //alert('success in cancel');
					   
				   },
				   error: function(reply_server){
					   console.log('error in showEventHistory');
					   console.log(reply_server);
				   }
				});
			
		}	
		});
		
		
		

		
		
	}

function buildEventTableStructure()
	{
		var html = '';
		html += '<div id="eventsContainer">';
		html += '<div id="eventTableHolder">';
		html += '<table class="table">';
		html += '<thead id="eventTableHeaders">';
		html += '<tr>';
		html += '<th>Message</th>';
		html += '<th>Recipient</th>';
		html += '<th>Status</th>';
		html += '<th>Created</th>';
		html += '<th>Send Time</th>'
		html += '</tr>';
		html += '</thead>';
		html += '<tbody id="eventTableBody">';
		html += '</tbody>';
		html += '</table>'
		html += '</div>';
		html += '</div>';
		
		return(html);
	}

function cancelThisEvent(eventID)
	{
						
		$.ajax({
		   type: "GET",
		   url: baseUrl + "/event?function=cancelEvent&event_id=" + eventID,
		   dataType: "json",
		   xhrFields: { withCredentials: true},
		   success: function(reply_server){
		   
		   		if(reply_server['user'] && (reply_server['user'] == 'not_premium'))
				   	{
/* 							 	notProUserNotify('cancel-event');  	 */
                        alert("Error: Must be a MightyText Pro user in order to cancel a scheduled message.")
					 	return(false);
				   	}
		   		
/*
                console.log('success in cancelThisEvent');
                console.log(reply_server);
*/
                var event_id = reply_server.eventlist_details.event_id;
                var status = reply_server.eventlist_details.status;
				callKMInBackgroundPage('scheduled-msg-cancel', {'Client':'CRX-New', 'Subclient' : currentLocation});
/*
			   if(threadDisplayModeGlobal == 'EVENTS')
			   	{
				   	
				   	$('#event_' + event_id).children('.event_status').fadeOut().html(convertStatusCodeToIcon(reply_server.eventlist_details.status) + '<i id="eventHistory_' + event_id + '" class="icon-search moreInfoStatus"></i>' + convertStatusCodeToText(reply_server.eventlist_details.status)).fadeIn();  	
				   	
				   	var eventHistoryIcon = $('#event_' + event_id).children('.event_status').children('.moreInfoStatus');
	   
					
				   	setInstructionsForEventHistoryDropDown(eventHistoryIcon, event_id);
				   	
				   	//showEventHistory(event_id);
			   	}
			   else if((threadDisplayModeGlobal == 'CLASSIC') || (threadDisplayModeGlobal == 'POWERVIEW'))
			   	{
*/
				   	//alert(reply_server.eventlist_details.ref_id);
				   	var cancelledMessage = $('#message-id-' + reply_server.eventlist_details.ref_id)
				   	
				   	$(cancelledMessage).find('.textTimeStamp').text('Cancelling Event...');
				   	
				   	
/* 					   	} */
			   
			   
			   
			   //alert('success in cancel');
			   
		   },
		   error: function(reply_server){
			   console.log('error in cancelThisEvent');
			   console.log(reply_server);
		   }
		});
		
	}
	

function convertStatusCodeToIcon(status)
	{
		var statusImage = '';
		if(status == 701)
			{
				statusImage = '<img src="assets/1382502427_time_clock_snack_alarm_wait.png" class="scheduledTableStatusIcon" alt="Scheduling" width="15" height="15" />';
			}
		else if(status == 702)
			{
				statusImage = '<img src="assets/1382502427_time_clock_snack_alarm_wait.png" class="scheduledTableStatusIcon" alt="Scheduling" width="15" height="15" />';
			}
		else if(status == 703)
			{
				statusImage = '<img src="assets/scheduler_1_with_error_state_triangle.png" class="scheduledTableStatusIcon" alt="scheduler_error" width="18" height="18" />';
			}
		else if(status == 704)
			{
				statusImage = '<img src="assets/1382502427_time_clock_snack_alarm_wait.png" class="scheduledTableStatusIcon" alt="Scheduling" width="15" height="15" />';
			}
		else if(status == 705)
			{
				statusImage = '<img src="assets/scheduler_1_with_red_cancel.png" class="scheduledTableStatusIcon" alt="cancelled" width="18" height="18" />';
			}
		else if(status == 706)
			{
				statusImage = '<img src="assets/scheduler_1_with_error_state_triangle.png" class="scheduledTableStatusIcon" alt="scheduler_error" width="18" height="18" />';
			}
			
		else if(status == 710)
			{
				statusImage = '<img src="assets/scheduler_1_with_green_checkmark.png" class="scheduledTableStatusIcon" alt="sent" width="18" height="18" />';
			}
		else if(status == 799)
			{
				statusImage = '<img src="assets/scheduler_1_with_error_state_triangle.png" class="scheduledTableStatusIcon" alt="scheduler_error" width="18" height="18" />';
			}
		return(statusImage);
	}


function convertStatusCodeToText(status)
	{
		var statusText = status;
		if(status == 701)
			{
				statusText = 'Scheduling in Process';
			}
		else if(status == 702)
			{
				statusText = 'Scheduled to Send';
			}
		else if(status == 703)
			{
				statusText = 'Unable to Schedule on Phone';
			}
		else if(status == 704)
			{
				statusText = 'Cancellation Requested on Phone';
			}
		else if(status == 705)
			{
				statusText = 'Cancelled';
			}
		else if(status == 706)
			{
				statusText = 'Unable to Cancel';
			}
			
		else if(status == 710)
			{
				statusText = 'Sent by Phone';
			}
		else if(status == 799)
			{
				statusText = 'Failed';
			}
		return(statusText);
	}



function getScheduledTimeIfExists(composer)
	{
	//KL EDITED THIS TO SEARCH WITHIN THE WINDOW THAT THIS CHECK INITIATED
	console.log(composer);
	var scheduledTime = $(composer).find(".scheduledLabel")
	console.log(scheduledTime);
		if(scheduledTime.length > 0)
			{
				var ts = $(scheduledTime).children('.scheduledTime').attr('data-unix');
				
				if(isAValidSchedulerDateAndTime(ts))
					{
						return(ts);
					}
				else
					{
						return('error');
					}
				
			}
		else
			{
				return(0);
			}
	}
var messageJSON;
function handleSchedulerCapi(capi)
	{
		var eventID = capi['event_update_notify']['event_id'];
		var status = capi['event_update_notify']['status'];
		var ref_id = capi['event_update_notify']['ref_id'];
		$.ajax({
		   type: "GET",
		   url: baseUrl + "/content?function=getMessageDetail&id=" + ref_id,
		   dataType: "json",
		   xhrFields: { withCredentials: true},
		   success: function(reply_server){
//			   console.log('scheduler capi message info');
//			   console.log(reply_server);
			   
//			   console.log("CAPI")			   			   
//   			   console.log(capi)
   			   
			   messageJSON = reply_server.message;
			   			   
			   messageJSON["event_list"] = capi;
			   
//			   console.log(messageJSON);

			   var message = createHTMLEquivalentOfMessageBody(reply_server.message.body);
			   var clean_phone_num = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(reply_server.message.phone_num, 'do_not_zeropad');
			   //var contact = genericGetContactNameFromCaches(clean_phone_num, reply_server.message.phone_num);
			   var statusText = convertStatusCodeToText(status);
			   var statusIcon = convertStatusCodeToIcon(status);
			   
   			   //changeScheduledMessageStateIfInDom(reply_server.message.id, status, eventID);
   			   //alert(status);
   			   //changeScheduledMessageStateIfInDom(ref_id, status, eventID);
			   
			   //KL commented the function below because we are using a different function to trigger bootstrap growl
			   //displayAlertMessage('Scheduled Message to ' + contact + ' "' + message + '" is <strong>' + statusText + '<strong>', 'info', 10000);
			   //INSERT FUNCTION TO DISPLAY GMAIL NOTIF		
//               notifyUserSendConfirmation(INSERT CONTACT NAMT, "scheduledEventUpdate");	
//UNCOMMENT THE SECTION BELOW AFTER YOU LEARN ABOUT THE RESPONSE OF THIS AJAX
			   
/*
			   if((threadDisplayModeGlobal == 'CLASSIC') || (threadDisplayModeGlobal == 'POWERVIEW'))
			   	{
*/
				   	if($('#message-id-' + ref_id).length > 0){//CRV only buildMessageHTML if the message exists in the current DOM
				   		var newMessage = buildMessageHTML(messageJSON);
				   		//console.error(messageJSON);
					   	//console.error(newMessage);
					   	
					   	console.log($("#message-id-"+ref_id));
					   	
					   	$('#message-id-' + ref_id).fadeOut(150).replaceWith(newMessage).fadeIn(150).each(function(e){
    					   	//we know the message was inserted
                            var updatedMessage = $("#message-id-"+ref_id);
    					   	var elemsToAddTooltipTo = $(updatedMessage).find(".sendConfirmation, .cancelScheduledMess");
    					   	var windowChecked = $(updatedMessage).closest("div.composeInnerContainer");
    					   	
   	   	                    addToolTipToSentConfirmationIcon(elemsToAddTooltipTo);
    					   	addItemActionsEventHandlers(updatedMessage, windowChecked, false);
       	                    addScheduledEventCancelCapability(updatedMessage);

					   	});
					   	
			   		}
				   	
//			   	}
//UNCOMMENT THE SECTION ABOVE AFTER YOU LEARN ABOUT THE RESPONSE OF THIS AJAX

			   
			   //if(threadDisplayModeGlobal == 'EVENTS'){ 
			   //CRV add alert to refresh events tab if it doesn't already exist
			   	
				   	
				   	
				   	//CRV this commented out code appended a message to the top of the events table that told the user there were updates and to refresh the table. No longer needed as we are live updating the table on uncoming capis
				   	/*
if($('#eventsUpdatedAlert').length < 1)
				   		{
					   		var eventAlert = '<div id="eventsUpdatedAlert" class="alert">';
					   		eventAlert += '<button type="button" id="closeEventUpdate" class="close" data-dismiss="alert">&times;</button>';
					   		eventAlert += 'Scheduled items have updated.  <a href="#" onclick="$(\'#events\').click();" style="color:white; text-decoration:underline;">Refresh now</a> to see the latest.';
					   		eventAlert += '</div>';
				   	
					   		$('#pinnedContent').prepend(eventAlert);
				   		}
*/
//KL commented out the section below because we do not have a 		   	
/*
				   	var cancelButton = '<div class="cancelEventButton" onclick="cancelEvent(\'' + eventID + '\')"><i class="icon-remove cancelEventInTable"></i></div>';
				   	if(status == 706)
				   		{
					   		cancelButton = '';
					   		//$('#event_' + eventID).children('.event_cancel').fadeOut().html('Cancel Failed').fadeIn();
				   		}
				   	else if(status == 705)
				   		{
					   		cancelButton = '';
					   		//$('#event_' + eventID).children('.event_cancel').fadeOut().html('Cancelled').fadeIn();
				   		}
				   	else if(status == 710)
				   		{
					   		cancelButton = '';
					   		//$('#event_' + eventID).children('.event_cancel').fadeOut().empty().append('<div class="successEventButton">Success</div>').fadeIn();
				   		}
				   	
				   	
				   	
				   	$('#event_' + eventID).children('.event_status').fadeOut().html(statusIcon + '<i id="eventHistory_' + eventID + '" class="icon-search moreInfoStatus"></i>' + statusText + cancelButton).fadeIn();  	
				   	
				   	
				   	
				   	var eventHistoryIcon = $('#event_' + eventID).children('.event_status').children('.moreInfoStatus');
			   
							
					setInstructionsForEventHistoryDropDown(eventHistoryIcon, eventID);
					
					if(cancelButton.length > 0)
					{
						var cancelButtonIcon = $('#event_' + eventID).find('.cancelEventInTable');
						setDeleteIconTooltip(cancelButtonIcon);
					}
				   	
				   	//showEventHistory(eventID);
				   	
				   	
			   	}
*/
		   },
		   error: function(reply_server){
			   
		   }
		});
	}
	
	
function createSchedulerModal()
	{
	return(false);	
		var html = '';
		html += '<div id="schedulerModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
		html += '<div class="modal-header">';
/* 		html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'; */
		html += '<h3 id="myModalLabel">Schedule Message</h3>';
		html += '</div>';
		html += '<div class="modal-body">';
		html += '<input id="datepickerModal" type="text" class="date ui-datepicker-input" placeholder="Date">';
		html += '<input id="timepickerModal" type="text" class="time ui-timepicker-input" placeholder="Time">';
		html += '</div>';
		html += '<div class="modal-footer">';
		html += '<span id="schedulerModalIDHolder"></span>'
		html += '<button class="btn closeSchedulerModal">Cancel</button>';
		html += '<button class="btn btn-primary scheduleMessageNow">Set</button>';
		html += '</div>';
		html += '</div>';
		
		var schedulerModal = $(html).appendTo('body');
		console.log('schedulerModalHTML');
		$(schedulerModal).modal({
			keyboard: false,
			backdrop: 'static',
			show: false
		});
		
		
		
		var datePicker = $(schedulerModal).children('.modal-body').children('#datepickerModal');
		var timePicker = $(schedulerModal).children('.modal-body').children('#timepickerModal');
		var cancelButton = $(schedulerModal).children('.modal-footer').children('.closeSchedulerModal');
		var scheduleButton = $(schedulerModal).children('.modal-footer').children('.scheduleMessageNow');
		//setDatePickerInstructions(datePicker, timePicker);
		setSchedulerButtonInstructions(cancelButton, scheduleButton);
	}

	function getNextStepValueFromCurrentTime(amountOfMinutesBetweenSteps)
		{
			var currentTime = moment().format('h:mma');
//			console.error('time when entering loop: ' + currentTime);
			var timeToReturn = currentTime;
			var numberOfMinutesToAdd = 0;
			var currentMinutes = moment().format('mm');
			
			for(var i = 0; i < (amountOfMinutesBetweenSteps ); i++)
				{
					var editedMinutes = moment().add('minutes', i).format('mm');
					
					if((editedMinutes % amountOfMinutesBetweenSteps) == 0)
						{
							timeToReturn = moment().add('minutes', i).format('h:mma');
//							console.error('setting time to return as: ' + timeToReturn);
						}
//					console.error('running through minutes loop with edited minutes');
				}
			
			
			
//			console.error('returning this time: ' + timeToReturn);
			return(timeToReturn)
		}

/*
function setDatePickerInstructions(datePicker, timePicker)
	{
		//$('.scheduleSelector').popover('hide');
		
		var amountOfMinutesBetweenSteps = 5;
		
		$(timePicker).timepicker({
			'step': amountOfMinutesBetweenSteps,
			'minTime': getNextStepValueFromCurrentTime(amountOfMinutesBetweenSteps),
			'timeFormat': "h:i a",
			//"scrollDefaultNow": true,
		});
		
		$(datePicker).datepicker({
	    	'format': 'M dd, yyyy',
	    	'autoclose': true,
	    	'todayHighlight': true,
	    	'startDate': getTodaysDate()
		});
		//$(datePicker).datepicker('show');
		
		$('#datepickerModal').datepicker().on('changeDate', function(e){
	        $(timePicker).focus();
	    });

	}	
*/	
	
function setSchedulerButtonInstructions(cancelButton, scheduleButton)
	{
		
			
		$(cancelButton).click(function(){
			var datePickerContentLength = $('#datepickerModal').val().length;
			var timePickerContentLength = $('#timepickerModal').val().length;
			var anyScheduledContent = datePickerContentLength + timePickerContentLength;
			var cancelButtonText = $('.closeSchedulerModal').text();
			
			if((anyScheduledContent > 0) && (cancelButtonText == 'Cancel'))
				{
					if(confirm("Are you sure you don't want to schedule this message?"))
						{
							$('#timepickerModal').val('');
							$('#datepickerModal').val('');
							$('#schedulerModalIDHolder').empty();
							$('#schedulerModal').modal('hide');
						}
					else
						{
							return(false);
						}
				}
			else
				{
					$('#timepickerModal').val('');
					$('#datepickerModal').val('');
					$('#schedulerModalIDHolder').empty();
					$('#schedulerModal').modal('hide');
				}
		});
		
		$(scheduleButton).click(function(){
			var scheduledTextRecipient = $('#schedulerModalIDHolder').text();
			var date = $('#datepickerModal').val();
			var time = $('#timepickerModal').val();
			var scheduledTime = date + " " + time;
			var UNIXscheduledTime = moment(scheduledTime);
			UNIXscheduledTime = UNIXscheduledTime.valueOf();
			
			if(isAValidSchedulerDateAndTime(UNIXscheduledTime))
				{
					createScheduledMessageLabelInDom(UNIXscheduledTime, scheduledTextRecipient, date, time);
					$('#timepickerModal').val('');
					$('#datepickerModal').val('');
					$('#schedulerModalIDHolder').empty();
					$('#schedulerModal').modal('hide');
				}
			else
				{
					
					return(false);
				}
				
			
		});
	}

function isAValidSchedulerDateAndTime(unixTS)
	{
		var currentTS = new Date().getTime();
		var currentTSPlusFiveMinutes = moment().add('minutes', 5).valueOf();
		//alert(currentTSPlusFiveMinutes);
//		console.error(unixTS);
		if(isNaN(unixTS))
			{ //CRV the user did not enter a valid date and time
				triggerCustomConfirm('You must select a date and time in the future.');
				return(false);
			}
		else
			{
				if(unixTS < currentTSPlusFiveMinutes)
					{
						triggerCustomConfirm('You must select a date and time at least 5 minutes from now.');
						return(false); //CRV timestamp is in the past. 
					}
				else
					{
						return(true); //CRV timestamp is valid UNIX and is in the future
					}
			}
	}
	
	
function removeSchedulerLabel(html)
	{
				//CRV switch back to regular sending icon
		$(html).parent().siblings('.responseButtonsHolder').children('.sendButton').children('.dcsendicon').removeClass('dcsendiconScheduled');
		$(html).parent().siblings('.responseButtonsHolder').children('.sendButton').children('.scheduleButtonLabel').remove();
		$(html).parent().siblings('.responseButtonsHolder').children('.sendButton').removeClass('expandedSendIcon');
		
		$(html).parent().remove();//CRV remove label

	}	
	
function createScheduledMessageLabelInDom(UNIXscheduledTime, scheduledTextRecipient)
	{
		//alert(scheduledTextRecipient);
		$('#' + scheduledTextRecipient + '_label').remove(); //CRV get rid of any pre-existing labels in this thread.
		var appendHere = $('#' + scheduledTextRecipient).parent();
		var scheduledMessageLabel = '<div id="' + scheduledTextRecipient + '_label" class="scheduledLabel mightyClearfix">';

		scheduledMessageLabel += '<span class="scheduledTime" data-unix="' + UNIXscheduledTime + '">';
		if(currentLocation == "Facebook"){//don't want to add a line break to scheduled messages in facebook
			scheduledMessageLabel += cleanTimeDisplayPurposes(UNIXscheduledTime, false);
		} else {
    		scheduledMessageLabel += cleanTimeDisplayPurposes(UNIXscheduledTime, false, false, true);
		}
		scheduledMessageLabel += '</span>';
		scheduledMessageLabel += '<div class="closeSchedulerLabel"><strong>x</strong></div>';
		scheduledMessageLabel += '</div>';

		
		var label = $(scheduledMessageLabel).appendTo(appendHere);
		
		$(label).siblings('.schedulerButton').hide();
		
		$(label).click(function(){
			//CRV in order to show the date and time selector again with the correct positioning, we must un-hide the scheduler button.  Also, just in case the user has an MMS attached, let's remove the current label in the DOM. 
			$(label).siblings('.schedulerButton').show();
			$('#' + scheduledTextRecipient).click();
    		$(label).remove();
		});
		
		$(label).find(".closeSchedulerLabel").on("click", function(e){
    		$(label).siblings('.schedulerButton').show();
            removeSchedulerLabel(this);
		});
		
		//CRV change the icon in the send button if it isn't already there
		if($(label).siblings('.responseButtonsHolder').children('.sendButton').children('.scheduleButtonLabel').length < 1)
			{
				$(label).siblings('.responseButtonsHolder').children('.sendButton').children('.dcsendicon').addClass('dcsendiconScheduled');
				$(label).siblings('.responseButtonsHolder').children('.sendButton').append('<div class="scheduleButtonLabel">Schedule</div>');
				$(label).siblings('.responseButtonsHolder').children('.sendButton').addClass('expandedSendIcon');
			}
		
	}	
	
function getTodaysDate()
	{
		var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
	return(today);
	}
	
function changeScheduledMessageStateIfInDom(messageID, status, eventID)
	{
		 
	   if(status == 705) //CRV event was cancelled
	   	{
		   	$('#sms-line-item-msgid-' + messageID).removeClass('scheduledMessage').addClass('scheduledMessageCancelled');
		   	$('#sms-line-item-msgid-' + messageID).children('.itemActions').children('.timestamp-msg').empty().text('Cancelled');
		   	$('#sms-line-item-msgid-' + messageID).children('.sentMessageStatus').remove();
		   	$('#sms-line-item-msgid-' + messageID).children('.cancelEventInMessage').tooltip('destroy');
		   	$('#sms-line-item-msgid-' + messageID).children('.cancelEventInMessage').remove();
	   	}
	   	else
	   		{
		   		//CRV add cancel event icon only if it doesn't already exist
		   		if($('#sms-line-item-msgid-' + messageID).children('.cancelEventInMessage').length < 1)
		   			{
			   			var cancelEventTTOptions = {
							trigger: 'hover',
							title: 'Cancel Event',
							placement: 'bottom',
							delay: { show: 200, hide: 100 }
						};
				   	
				   		$('#sms-line-item-msgid-' + messageID).children('.sentMessageStatus').after('<i class="icon-remove cancelEventInMessage" onclick="cancelThisEvent(\'' + eventID + '\')"></i>');
				   		$('#sms-line-item-msgid-' + messageID).children('.cancelEventInMessage').tooltip(cancelEventTTOptions);
		   			}			
				
	   		}

	}
	
	
function setScheduledEventTS(eventID, messageID, tsMessage)
	{
		$.ajax({
		   type: "GET",
		   url: baseUrl + "/event?function=getEventDetails&event_id=" + eventID,
		   dataType: "json",
		   xhrFields: { withCredentials: true},
		   success: function(reply_server){
			   console.log('success in setScheduledEventTS');
			   console.log(reply_server);
			   var scheduledTime = reply_server.eventlist_details.ts_event_trigger;
			   $('#sms-line-item-msgid-' + messageID).children('.itemActions').children('.timestamp-msg').empty().text(tsMessage + cleanTimeDisplayPurposes(scheduledTime,false));
			   changeScheduledMessageStateIfInDom(messageID, reply_server.eventlist_details.status, eventID);
			  			   
		   },
		   error: function(reply_server){
			   console.log('error in setScheduledEventTS');
			   console.log(reply_server);
		   }
		});
	}

function buildNonProUserModal()
	{
		var learnMoreButton = '<a id="learnAboutPro" class="btn btn-success">Learn about Pro</a>';
		var featImage = imgPlaceHolderURL;
		
		var html = '';
		
		html += '<div id="nonProUserModal" class="modal hide fadeMighty mightyModal teaserModal" data-feature="">';
		html += '<div class="modal-header">';
		html += 'MightyText Pro';
		html += '<span class="mightyClose close" data-dismiss="modal">x</span>';
		html += '</div>';
		html += '<div class="modal-body">';
		html += '<div class="featTextWrapper">';
		html += '<p><span id="featText">This feature is available in MightyText Pro</span></p>';
		html += '</div>';
		html += '<div class="featImgWrapper">';
		html += '<a href="javascript:void(0)" class="featImgWrapper">';
/* 		html += '<p><span id="featImgPrev">Here\'s a preview:</span></p>'; */
		html += '<img id="featPrev" src="' + featImage + '" alt="featImage"/>';
		html += '</a>';
		html += '</div>';
		html += '</div>';
		html += '<div class="modal-footer">';
		html += '<div class="learnMoreContainer">';
//		html += '<button data-dismiss="modal" class="btn">Back to app</button>';
		html += learnMoreButton;
		html += '</div>';
		html += '</div>';
		html += '</div>';
		
		var appendedModal = $(html).appendTo("body");

//Don't need any of the code below for now.  It is analytics tracking.  Should ask MA about this KL 5/30/14		

        $(appendedModal).on("shown", function(){
            
    		var currentFeature = $('#nonProUserModal').attr("data-feature");
    		//MODAL IS SHOWN HERE
			var metadata = {
			  feature_clicked: currentFeature 
			};
            callIntercomInBackgroundPage('Pro-Feature-Teaser-Show', metadata);
            callKMInBackgroundPage('Pro-Teaser-Show', {'Client': 'CRX-New', 'Subclient' : currentLocation, 'Feature': currentFeature});
            
        })

		console.log("about to set this click handler");
		$("#learnAboutPro").on("click", function(e){
    		e.preventDefault();
    		var currentFeature = $('#nonProUserModal').attr("data-feature");
            callKMInBackgroundPage('Pro-Learn-Features-Click', {'Client': 'CRX-New', 'Subclient' : currentLocation, 'Feature': currentFeature});
            callGAInBackgroundPage("CRX-Gmail", "pro-click-learn-features", currentFeature);
            $(appendedModal).find(".mightyClose").trigger("click");
            
            if(currentLocation == "Gmail"){
                openPromoWebappInIframe();                                
            } else {
                openWebAppPopup("pro_promo");
            }

		});
		
	}

function displayNonProUserAlertModal(proAction)
	{
    	//console.log(getProFeatureNameByID(proAction));
    	if(proAction.length > 0){
        	var actionDetails = getProFeatureNameByID(proAction)
    	
        	$("#featText").text(actionDetails["desc"]);
        	if(proAction == "compose-new-greater-than-10"){
            	$("#featPrev").hide();
        	} else {
            	$("#featPrev").attr("src", actionDetails["img"]);            	
        	}

    	} else {
        	//do nothing
        	$("#featText").text("This feature");
    	}
    	
    	$('#nonProUserModal').attr("data-feature", proAction);
		$('#nonProUserModal').modal('show');		
	}

function getProFeatureNameByID(proActionID){
/*     var strToDisplay; */
    var schedulingMessageImgURL = chrome.extension.getURL("img/pro-features/scheduling_messages.png");
    var addTemplatesImgURL = chrome.extension.getURL("img/pro-features/add_templates.png");
    var createTemplateImgURL = chrome.extension.getURL("img/pro-features/creating_templates.png");
    var selectDraftImgURL = chrome.extension.getURL("img/pro-features/selecting_a_draft.png");

    var featToDisplay = {
        desc : "",
        img  : ""
    };
    
    switch(proActionID){
        case "schedule-msg":
            featToDisplay["desc"] = "Scheduling messages is available in MightyText Pro";
            featToDisplay["img"] = schedulingMessageImgURL;
            break;
        case "user-selects-template-dropdown":
            //! user selects template dropdown case
            featToDisplay["desc"] = "Templates and signatures are available in MightyText Pro";
            featToDisplay["img"] = addTemplatesImgURL;
            break;
/*
        case "sync-old-msgs":
            featToDisplay["desc"] = getLanguageSpecificText('sync_older_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/sync_older_messages.png';
            break;
*/
        case "add-template":
            featToDisplay["desc"] = 'Message templates are available in MightyText Pro';
            featToDisplay["img"] = createTemplateImgURL;
            break;
/*
        case "num-days-keep":
            featToDisplay["desc"] = getLanguageSpecificText('keep_messages_longer_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/store_mess_forever.png';
            break;
        case "save-settings":
            featToDisplay["desc"] = getLanguageSpecificText('no_update_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/blank.gif';
            break;
        case "update-signature":
            featToDisplay["desc"] = getLanguageSpecificText('signature_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/create_signature.png';
            break;
        case "add-contact-group":
            featToDisplay["desc"] = getLanguageSpecificText('contact_lists_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/create_contact_group.png';
            break;
        case "add-blocked-num":
            featToDisplay["desc"] = getLanguageSpecificText('blocked_numbers_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/block_nums.png';
            break;
        case "cancel-event":
            featToDisplay["desc"] = getLanguageSpecificText('cancel_events_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/cancel_event.png';
            break;
*/
        case "templates-dropup-click":
        //! templates dropup icon click
            featToDisplay["desc"] = "Templates and signatures are available in MightyText Pro";
            featToDisplay["img"] = addTemplatesImgURL;
            break;
/*
        case "create-contact-group":
            featToDisplay["desc"] = getLanguageSpecificText('contact_lists_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/create_contact_group.png';
            break;
        case "cancel-scheduled-message":
            featToDisplay["desc"] = getLanguageSpecificText('cancel_events_pro_only', globalDefaultLanguage);
            featToDisplay["img"] = 'assets/mightyprofeatures/cancel_event.png';
            break;
*/
        case "compose-new-greater-than-10":
        	featToDisplay["desc"] = "You can send this message to a maximum of 10 people.\n\nUpgrade to MightyText Pro and you can send to 25 recipients at a time.";
            featToDisplay["img"] = 'assets/blank.gif';
            break;
        case "drafts":
        	featToDisplay["desc"] = "Saving message drafts is available in MightyText Pro";
            featToDisplay["img"] = selectDraftImgURL;
            break;
        default:
            featToDisplay["desc"] = proActionID;
            featToDisplay["img"] = 'assets/blank.gif';
            break;
    }
    
    return featToDisplay;
    
}

function setInstructionsForInThreadTemplates(idOfTemplateIconClicked)
	{
			
		if(idOfTemplateIconClicked)
			{
				$("#"+idOfTemplateIconClicked).find('.addTemplateIcon').click(function(){
			
					//fa fa-spinner fa-spin
					if(isAProUser)
						{
							$(this).children('.fa-file-text').addClass('fa-spinner fa-spin').removeClass('fa-file-text');
							getTemplatesForDropdown($(this).children('.fa-spinner'));
							callKMInBackgroundPage('template-chooser-click', {'Client':'CRX-New', 'Subclient' : currentLocation});
						}
					else
						{
/* 							notProUserNotify('templates-dropup-click');		 */
							displayNonProUserAlertModal('templates-dropup-click');
						}
					
				});
			}
		else
			{
				
				//console.error($('#newSMS_templatesDropDown').find('.addTemplateIcon'));
				//CRV this is a compose New
				$('#newSMS_templatesDropDown').find('.addTemplateIcon').click(function(){
			
					if(isAProUser)
						{
							$(this).children('.fa-file-text').addClass('fa-spinner fa-spin').removeClass('fa-file-text');
							getTemplatesForDropdown($(this).children('.fa-spinner'));
							callKMInBackgroundPage('template-chooser-click', {'Client':'CRX-New', 'Subclient' : currentLocation});
						}
					else
						{
/* 							notProUserNotify('templates-dropup-click'); */
							displayNonProUserAlertModal('templates-dropup-click');
						}
					
				});
			}
		
	}

function getTemplatesForDropdown(iconThisClickWasTriggeredFrom)
	{		
		$.ajax({
		   type: "POST",
		   url: baseUrl + "/usertemplates?function=getAllUserTemplates",
		   dataType: "json",
		   timeout: 3000,
			xhrFields: { withCredentials: true},
		   success: function(reply_server){
		   		
		   		if(reply_server['user'] && (reply_server['user'] == 'not_premium')){
                    displayNonProUserAlertModal('user-selects-template-dropdown');                    
                    $(iconThisClickWasTriggeredFrom).removeClass('fa-spinner fa-spin').addClass('fa-file-text');
                    return(false);
			   	}
		   		
		   		//setting the user's signature here in chrome local storage so that we can update the value when a user clicks on the templates dropup icon.
                //just another case where we can update the user's signature.
                setUserSignatureInLocalStorage(reply_server.templates);
                addTemplatesToDropdown(iconThisClickWasTriggeredFrom, reply_server['user_templates']);
		   },
		   error: function(reply_server){
			   console.error('error in createTemplatesDropdown');
			   //console.error(reply_server);
			   
			   
			   
			   var redirectURLForEditTemplates = '#';
			   	
			   	var editTemplatesAndSignaturesHTML = '<li role="presentation"><a class="customPaddedDropDownItem edit-templates-and-signatures" role="menuitem" tabindex="-1" href="' + redirectURLForEditTemplates + '"><i class="fa fa-edit fa-lg customDropDownIcon fa-fw"></i>Edit templates / signature</a></li>';
			   
			   
			   //displayAlertMessage("Unable to get templates list. Please try again.", 'info', 3000);
			   var templatesDropDownHtml = '';
			   templatesDropDownHtml += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
			   templatesDropDownHtml += editTemplatesAndSignaturesHTML;
			   templatesDropDownHtml += '<li role="presentation"><a class="customPaddedDropDownItem add-this-message-as-template" role="menuitem" tabindex="-1" href="#" onclick="addThisMessageAsTemplate(this)"><i class="fa fa-lg fa-save customDropDownIcon fa-fw"></i>Save as template</a></li>';
			   templatesDropDownHtml += '</ul>';
//Old
/* 			   $(iconThisClickWasTriggeredFrom).parent().parent().parent().children('ul').remove(); */
//New
			   $(iconThisClickWasTriggeredFrom).parent().parent().parent().children('ul').remove();
        		var templateDropupDestination = $(iconThisClickWasTriggeredFrom).parent().parent().parent();
        		
        		$(templatesDropDownHtml).appendTo(templateDropupDestination).each(function(){
                    
                    var templateLink = $(this).find(".templateNameInDropup");
                    var signatureLink = $(this).find(".insertSignature");
                    var addMessageAsTemplateLink = $(this).find(".add-this-message-as-template");
                    var editTemplatesAndSignaturesLink = $(this).find(".edit-templates-and-signatures");
                            
            		$(templateLink).on("click", function(e){
                		e.preventDefault();
                		addThisTemplateToMessage(this);
            		});
            		
            		$(signatureLink).on("click", function(e){
                		e.preventDefault();
                		insertSignature(this);
            		});
            		
            		$(addMessageAsTemplateLink).on("click", function(e){
                		e.preventDefault();
                		addThisMessageAsTemplate(this);	
            		});
            		
            		$(editTemplatesAndSignaturesLink).on("click", function(e){
                		e.preventDefault();
                		callKMInBackgroundPage('template-chooser-edit-option', {'Client':'CRX-New', 'Subclient' : currentLocation});
                		
                		chrome.runtime.sendMessage({
                    		openTemplatesAndSignaturesPane: true
                		}, function(response){
                    		console.log(response);
                		})
            		});
            		    		
        		})
			   $(iconThisClickWasTriggeredFrom).removeClass('fa-spinner fa-spin').addClass('fa-file-text');
		   }
		});

	}

function addTemplatesToDropdown(iconThisClickWasTriggeredFrom, templates)	
	{
		//CRV remove any previous dropdown html
		$(iconThisClickWasTriggeredFrom).parent().parent().parent().children('ul').remove();
		var signatureBody = 'none';
		
		var templateIdentifier = $(iconThisClickWasTriggeredFrom).attr('data-numclean');
		//alert(templateIdentifier);
		var templatesDropDownHtml = '';
		templatesDropDownHtml += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
		templatesDropDownHtml += '<li class="nav-header">Insert Template...</li>';
		if(templates.length > 0)
			{
				for(var i = 0; i < templates.length; i++)
					{
						var templateContent = jQuery.parseJSON(templates[i].content.value);
						var name = createHTMLEquivalentOfMessageBody(decodeURIComponent(templateContent.name));
						var body = decodeURIComponent(templateContent.body);
						if(name == 'MTSignature')
							{ //CRV template IS the user's signature
								signatureBody = body;
							}
						else
							{ //CRV template is not a signature
								templatesDropDownHtml += '<li role="presentation"><a class="templateNameInDropup" role="menuitem" tabindex="-1" href="#" data-content="' + templateContent.body + '">' + name + '</a></li>';	
							}
						
					}
				templatesDropDownHtml += '<li class="divider"></li>';
				
			}
		
			
			
		var redirectURLForEditTemplates = '#';
/* 		var optionalOnclickEditTemplates = 'onclick="openTemplateManager(this)"'; */
		var optionalTargetForATag = '';
//maybe we want to disable the user from editing their templates here too? Or just open a new tab to that tab int he settings pane KL 5/30/14			   
/*
	   if((threadDisplayModeGlobal == 'COMPOSE-NEW') || (threadDisplayModeGlobal == 'QUICK'))
	   	{ //CRV if this is a compose new window or quick reply window, then we should allow a pro user to edit their templates or signatures in a new window
		   	
		   	var currentURLPreHash = window.location.href.replace(window.location.hash, '');
		   	redirectURLForEditTemplates = currentURLPreHash + '#mode=settings&pane=templates';
		   	optionalTargetForATag = ' target="_blank"'
		   	optionalOnclickEditTemplates = '';
		   	
	   	}
*/
			   	
			   	
        var editTemplatesAndSignaturesHTML = '<li role="presentation"><a class="customPaddedDropDownItem edit-templates-and-signatures" role="menuitem" tabindex="-1" href="' + redirectURLForEditTemplates + '" ' + optionalTargetForATag + '><i class="fa fa-edit fa-lg customDropDownIcon fa-fw"></i>Edit templates / signature</a></li>';
			
			
			
		templatesDropDownHtml += editTemplatesAndSignaturesHTML;	
		templatesDropDownHtml += '<li role="presentation"><a class="customPaddedDropDownItem add-this-message-as-template" role="menuitem" tabindex="-1" href="#"><i class="fa fa-lg fa-save customDropDownIcon fa-fw"></i>Save as template</a></li>';
		templatesDropDownHtml += '<li class="divider"></li>';
		templatesDropDownHtml += '<li role="presentation"><a class="customPaddedDropDownItem insertSignature" role="menuitem" tabindex="-1" href="#" data-content="' + signatureBody + '"><i class="fa fa-lg fa-long-arrow-left customDropDownIcon fa-fw"></i>Insert Signature</a></li>';
		
		templatesDropDownHtml += '</ul>';
		
		//$(iconThisClickWasTriggeredFrom).parent().siblings('.dropdown-menu').empty().append(templatesDropDownHtml);
		
        $(iconThisClickWasTriggeredFrom).parent().parent().parent().children('ul').remove();
		
		var templateDropupDestination = $(iconThisClickWasTriggeredFrom).parent().parent().parent();
		
		$(templatesDropDownHtml).appendTo(templateDropupDestination).each(function(){
            
            var templateLink = $(this).find(".templateNameInDropup");
            var signatureLink = $(this).find(".insertSignature");
            var addMessageAsTemplateLink = $(this).find(".add-this-message-as-template");
            var editTemplatesAndSignaturesLink = $(this).find(".edit-templates-and-signatures");
                    
    		$(templateLink).on("click", function(e){
        		e.preventDefault();
        		addThisTemplateToMessage(this);
    		});
    		
    		$(signatureLink).on("click", function(e){
        		e.preventDefault();
        		insertSignature(this);
    		});
    		
    		$(addMessageAsTemplateLink).on("click", function(e){
        		e.preventDefault();
        		addThisMessageAsTemplate(this);	
    		});
    		
    		$(editTemplatesAndSignaturesLink).on("click", function(e){
        		e.preventDefault();
        		
        		callKMInBackgroundPage('template-chooser-edit-option', {'Client':'CRX-New', 'Subclient' : currentLocation});
        		chrome.runtime.sendMessage({
            		openTemplatesAndSignaturesPane: true
        		}, function(response){
            		console.log(response);
        		})
    		});
    		    		
		})
/* 		$(iconThisClickWasTriggeredFrom).parent().parent().parent().append(templatesDropDownHtml); */
        $(iconThisClickWasTriggeredFrom).removeClass('fa-spinner fa-spin').addClass('fa-file-text');
		
		
	}	


function insertSignature(templateOption)
	{
//		_gaq.push(["_trackEvent","WebApp","templates", "select-signature-into-msg"]);
		
		var responseArea = $(templateOption).parent().parent().parent().siblings(".messageContainer").find('.messageToSend');
		var templateBody = $(templateOption).attr('data-content');
		
		if((templateBody == 'none') || (templateBody.length == 0))
			{
                triggerCustomConfirm("It appears you do not have a signature set. You can set and edit your signature in settings.");
			}
		else
			{
				$(responseArea).append(createHTMLEquivalentOfMessageBody(templateBody));
		
				//CRV move cursor to end of response area
				
                callKMInBackgroundPage('signature-inserted', {'Client':'CRX-New', 'Subclient' : currentLocation});
                callIntercomInBackgroundPage('pro-signature-inserted');
				setEndOfContenteditable(responseArea);
			}
	}

function buildTemplatesDropDownHTML(templateIdentifier)
	{
		var html = '';
		
/*
		var alignLeftOrRightClass = 'pull-left'
		if(templateIdentifier == 'newSMS_templatesDropDown')
			{
				alignLeftOrRightClass = 'pull-right';
			}
			
		if(threadDisplayModeGlobal == 'QUICK')
			{
				alignLeftOrRightClass = 'pull-right';
			}
*/
		
		html += '<div id="' + templateIdentifier + '" class="dropup templateDropUpIcon">';
		html += '<a class="dropdown-toggle" data-toggle="dropdown" href="#" style="text-decoration:none;" tabindex="-1"><div class="addTemplateIcon"><i class="fa fa-file-text add-template-fa-icon"></i><i class="fa fa-caret-down caretIconMargin"></i></div></a>';
		html += '</div>';
	
		
		
		
		
		return(html);
	}	
	
	
function addThisTemplateToMessage(templateOption)
	{
    	
        callGAInBackgroundPage('CRX-Gmail', 'templates', 'select-template-into-msg')		;
		callKMInBackgroundPage('template-inserted', {'Client':'CRX-New', 'Subclient' : currentLocation});
        callIntercomInBackgroundPage('pro-template-inserted');
        
		var responseArea = $(templateOption).parent().parent().parent().siblings(".messageContainer").find('.messageToSend');
		var templateBody = decodeURIComponent($(templateOption).attr('data-content'));
		
		//CRV changed to prepend so that the template will display before any added content (in this case a signature)
		$(responseArea).prepend(createHTMLEquivalentOfMessageBody(templateBody));
		
		//CRV move cursor to end of response area
/* 		var element = $(responseArea).get(0); */
		setEndOfContenteditable(responseArea);
		
	}
	
function addThisMessageAsTemplate(templateOption)
	{
		var responseArea = $(templateOption).parent().parent().parent().siblings(".messageContainer").find('.messageToSend');
		
		var textMessageContent = sanitizeTextResponse(responseArea);
		
		//console.error(textMessageContent);
		
		if(isStringJustWhiteSpaceCharacters(textMessageContent)){
// 			alert("Please enter some text before saving a template");
    		triggerCustomConfirm('Please enter some text before saving a template', function(){return false;});
// 			return(false);
		} else if (textMessageContent.length > 1000){
    		triggerCustomConfirm('Template is too long.  1000 is the maximum number of characters.', function(){return false;});
		} else {
			createNewUserTemplate(textMessageContent);	
			callKMInBackgroundPage('template-saved-from-message', {'Client':'CRX-New', 'Subclient' : currentLocation});
		}
	}

function createNewUserTemplate(body, optionalName, optionalIsSignature)
	{
		//only triggered when a user saves a new template
		
		var name = body
		
		if(optionalName)
			{
				name = optionalName;
			}
		
		//CRV this is for creating a template that will serve as the user's signature
		if(optionalIsSignature)
			{
				name = 'MTSignature';
				//displayAlertMessage('Updating Signature...', 'info', 3000);
			}
		
		
		var templateInfo = '{"body":"' + encodeURIComponent(body) + '","name":"' + encodeURIComponent(name) + '"}';
		
		var postVarBuilder = "content=" + encodeURIComponent(templateInfo);
		
        $.ajax({
            type: "POST",
            url: baseUrl + "/usertemplates?function=createUserTemplate",
            dataType: "json",
            data: postVarBuilder,
            xhrFields: { withCredentials: true},
            success: function(reply_server){
                //console.error('createNewUserTemplate servlet success');
                //console.error(reply_server);
                if(reply_server['user']  && (reply_server['user'] == 'not_premium')){			   	
                    displayNonProUserAlertModal('add-template')
                    $('#template_new_template').remove();
                    $("div:contains('Updating Signature...')").remove();
                    $('#signature_editor_textResponse').html('');
                    return(false);
                } else {
                    notifyUserSendConfirmation(null, "template-created", "template_created");
                }
            },
            error: function(reply_server){
                console.error('createNewUserTemplate servlet error');
                //console.error(reply_server);
            }
        });
        
		
	}

	
function isStringJustWhiteSpaceCharacters(string)
	{
		if (string.trim().length > 0)
			{
				return(false);
			}
		else
			{
				return(true);
			}
	}

/* Start Draft Code KL 6/10/14 */
//!Start of Drafts code

function buildSaveDraftButton(id)
	{		
		var html = '';
    		html += '<div class="save-draft-button-holder"><i id="' + id + '_save-draft" class="save-draft-icon fa fa-save"></i></div>';
		return(html);	
	}

function setInstructionsForSaveDraftButton(id)
	{
	
    	console.log(id);
	
		$('#' + id).parent().on("click", function(){
    		
    		console.log(isAProUser);
    		
			//CRV only pro users can save drafts
			if(!isAProUser)
				{
    				displayNonProUserAlertModal("drafts");
					return(false);
				}
			
			//CRV if there are no updates to the draft, don't save it
			if(!$(this).children('.save-draft-icon').hasClass('can-save'))
				{
					return(false);
				}
				
			var saveDraftButtonID = $(this).children('.save-draft-icon').attr('id');
		
			var textMessageContent = sanitizeTextResponse($(this).siblings('.messageContainer').children(".messageToSend"));
			
			var phoneNumOfThread = $(this).siblings('.messageContainer').data('name');
			
			var isComposeNew = false;
			
			console.log(phoneNumOfThread);
			
			if(!phoneNumOfThread)
				{
					console.log('new code called');
					//CRV this was called from compose new so we need to check for any intended recipients
					//CRV check to see if this compose new is in the magic composer or if it's in the regular compose new window
/*
					if($(this).siblings('.messageContainer').hasClass('responseAreaEEModal'))
						{
							var contactsToSendDraftTo = $(this).parent().parent().siblings('.modal-header').children().children('#sendTo').children('#sendToTheseContacts').children('.sendNewMessageToThisContact');
						}
					else	


						{
*/

/* //Don't need the code block above because GText does not that have an emoji compose mode. */

					var contactsToSendDraftTo = $(this).closest(".responseArea").siblings('.sendTo').children('.sendContacts').children('.contact');
/* 						} */
																				
					var composeNewContactArray = new Array();
					$.each(contactsToSendDraftTo, function(){
						var recipient = $(this).data('number');
						composeNewContactArray.push(recipient);
					});
					
					phoneNumOfThread = composeNewContactArray.join("|");
					isComposeNew = true;
				}
			
	
			//console.log('textMessageContent after sanitization:')
			//console.log(textMessageContent);
			//console.log('bytes array');
			//console.log(str2ab(textMessageContent));
			//textMessageContent = replaceEmoticonsWithText(textMessageContent);
			//CRV the Following two jQuery commands are a slopppy way to ensure that if the user was typing in this thread while a new text was recieved, then the unread status is removed via css
		
			var is_sms;
		
			var MMSBlobIDForThisThread = $(this).siblings(".mightdcfoot").children('.sendMMS').find('#mms-blob-id-holder').text();
		
			if (MMSBlobIDForThisThread.length > 0)
				{
				is_sms=false;
				//alert('is MMS');
				}
			else
				{
				is_sms=true;
				
				//CRV this is NOT an MMS, so we can set the MMS flag that will be passed to the create draft function as false
				MMSBlobIDForThisThread = false;
				
				//alert('is SMS');
				}
				
		console.log(phoneNumOfThread);
				
		//CRV get message type
		var messageType = getMessageTypeForComposedDraft(is_sms, isComposeNew, phoneNumOfThread);
		
		
		//CRV if there is no body, set the body flag passed to the createDraft function as false
		if(textMessageContent.length < 1)
			{
				textMessageContent = false;
			}
		
		//CRV if there is no phone num for this draft, set the phoneNum flag passed to the createDraft function as false
		if(phoneNumOfThread.length < 1)
			{
				phoneNumOfThread = false;
			}
			
		//CRV determine if this is a pre-existing draft.  If so, then edit the draft, rather than creating a new one
		var draftID = false;
		if($(this).children('.save-draft-icon').attr('data-draftid'))
			{
				draftID = $(this).children('.save-draft-icon').attr('data-draftid');
			}
		
		$(this).siblings('.messageContainer').children(".messageToSend").addClass("pendingMessage");
				
		createUnsentDraftOrEditExistingDraft(messageType, textMessageContent, MMSBlobIDForThisThread, phoneNumOfThread, saveDraftButtonID, draftID);
		
		});
	}
	
function getMessageTypeForComposedDraft(is_sms, optionalIsComposeNew, optionalPipeDelimitedPhoneNumOfThread)
	{
				
		if(optionalIsComposeNew){				
			//CRV check to see if the user wanted this message to be sent as a group or individual message.  We will only use this info if there are multiple intended recipients				
			var notAGroupMessage = true;
  			if($('.groupMMSContainer').children(".mightyDropup").data("selection") == "SendAsGroup"){
  				notAGroupMessage = false;
			}
		}
		  
		var draftRecipient = optionalPipeDelimitedPhoneNumOfThread.toString();
						
		//CRV check to see if this message is intented for multiple recipients
		var isMessageToMultipleRecipients = false;
		if(draftRecipient.indexOf('|') > -1)
			{
				isMessageToMultipleRecipients = true;
			}
		
		//CRV if there are NOT multiple recipients for this message and there is NO MMS BLOBID, then this is an sms type = 10
		if(!isMessageToMultipleRecipients)
			{
				if(is_sms)
					return(10);
				else
					return(11);
			}
			
		//CRV if this message is to multiple recipients and was triggered from a thread, then we know it's a group message draft
		if(isMessageToMultipleRecipients && !optionalIsComposeNew)
			{
				return(21);
			}
			
		//CRV this is a draft triggerd from a compose new
		if(optionalIsComposeNew)
			{
				if(isMessageToMultipleRecipients)
					{
						if(notAGroupMessage)
							return(20);
						else
							return(21);
					}
				else
					{
						//CRV 0 or 1 recipients 
						if(is_sms)
							return(10);
						else
							return(11);
					}
			}
			
			
		return(false);
	}
	
function createUnsentDraftOrEditExistingDraft(type, optionalBody, optionalMMSObjectKey, optionalPhoneNum, saveDraftButtonID, optionalDraftID)
	{
	
		//CRV let if there is a scheduler label in the dom, let the user know that we don't save the scheduled time
		if($('#' + saveDraftButtonID).parent().siblings(".mightdcfoot").children(".schedulerContainer").children('.scheduledLabel').length > 0)
			{
/*     			alert("The draft you just saved contains a schedule time.  The message content and recipients were saved in the draft, but the scheduled date/time is not saved in the draft."); */
                notifyUserSendConfirmation(null, 'draft-schedule-attempt', 'draft-schedule-attempt');

				//displayAlertMessage(getLanguageSpecificText('no_scheduled_drafts_warning', globalDefaultLanguage), 'info', 10000);
			}
		
		
		//CRV start building the post var string.  The only required param is the type. 
		var postVarBuilder = 'source_client=31&type=' + encodeURIComponent(type);
		
		//CRV if a body was passed, add that to the post var string
		if(optionalBody)
			{
				postVarBuilder += '&msg_body=' + encodeURIComponent(optionalBody);
			}
		
		//CRV if a MMS object key was passed, add that to the post var string
		if(optionalMMSObjectKey)
			{
				postVarBuilder += '&mms_object_key=' + encodeURIComponent(optionalMMSObjectKey);
			}
		
		//CRV if a phonenum was passed, add that to the post var string
		if(optionalPhoneNum)
			{
				postVarBuilder += '&phone_num=' + encodeURIComponent(optionalPhoneNum);	
			}
			
		var servletFunction = 'createDraft';
		//CRV we are editing a pre-existing draft
		if(optionalDraftID)
			{
				postVarBuilder += '&id=' + encodeURIComponent(optionalDraftID);
				var servletFunction = 'updateDraft';
				
				console.log(optionalDraftID);
				
			}
		
		
		//CRV grey the message body so that the user knows save or update is in progress
		$('#' + saveDraftButtonID).siblings('.messageContainer').addClass('pendingMessage');
		
		//! grey this area!
				
		$('#' + saveDraftButtonID).removeClass('fa-save').addClass('fa-spinner fa-spin');
		
		
		$.ajax({
			type: "POST",
			url: baseUrl + '/draft?function=' + servletFunction,
			data: postVarBuilder,
			dataType: "json",
			xhrFields: { withCredentials: true},
			timeout: 10000,
			success: function(reply_server){
				console.log('success in createUnsentDraftOrEditExistingDraft');
				console.log(reply_server);
				
				//CRV remove grey state from response area
				//$('#' + saveDraftButtonID).siblings('.textResponse').removeClass('textAreaWhileMessageSendInProcess');
				
				var successMessage = 'draft-saved';
				var inAppMessageType = 'info';
				var KMEventName;
				
				if(optionalDraftID)
					{
						successMessage = 'draft-updated';
						
						KMEventName = "Update-Draft";
						
						if(reply_server.updated_draft == null)
							{
								inAppMessageType = 'error';
								successMessage = 'Draft not updated';
							}
				} else {
						//CRV this is a newly created Draft.  Let's add the draftID to the save-draft button
						var draftID = reply_server.created_draft.id;
						
						$('#' + saveDraftButtonID).attr('data-draftid', draftID);						

						fetchDraftsAndAppendFlagIfUserHasDraftsForThisThread(0, 10, reply_server.created_draft.phone_num, reply_server.created_draft.phone_num_clean);	
						
						KMEventName = "Create-Draft-Initial";
						callIntercomInBackgroundPage(KMEventName,{'Client':'CRX-New', 'Subclient': currentLocation});
						
				}
				
                callKMInBackgroundPage(KMEventName,{'Client':'CRX-New', 'Subclient' : currentLocation});

                notifyUserSendConfirmation(null, successMessage, successMessage);
				
				refreshConversationNotification($('#' + saveDraftButtonID).parent().siblings('.messageContainer').children(".messageToSend"), false, true);				
				
				$('#' + saveDraftButtonID).addClass('fa-save').removeClass('fa-spinner fa-spin');
				
        		var elem = $('#' + saveDraftButtonID).parent().siblings('.messageContainer').children(".messageToSend");//This is the element that you want to move the caret to the end of
        		setEndOfContenteditable(elem);
				
				$('#' + saveDraftButtonID).parent().removeClass('can-save-holder');
				
			},
			error: function(reply_server){
				console.log('error in createUnsentDraftOrEditExistingDraft');
				console.log(reply_server);	
				//CRV remove grey state from response area
				$('#' + saveDraftButtonID).siblings('.textResponse').removeClass('textAreaWhileMessageSendInProcess');
/* 				displayAlertMessage('Draft not saved', 'error', 7000); */

                triggerCustomConfirm("draft not saved");

				refreshConversationNotification($('#' + saveDraftButtonID).siblings('.messageContainer'));
				
				$('#' + saveDraftButtonID).addClass('fa-save').removeClass('fa-spinner fa-spin');
				
				//CRV if this is compose new mode, send the message to compose new mode that a draft was created or saved
/*
				if(threadDisplayModeGlobal == 'COMPOSE-NEW')
					{
						callParentFunctionToCloseIframeForComposeNewMode('user_draft_not_saved');
					}
*/
				
			}
		});
	}

function fetchDraftsAndAppendFlagIfUserHasDraftsForThisThread(startRange, endRange, optionalPhoneNum, optionalPhoneNumClean, optionalContactName)
	{
		
		//! fetchDraftsAndAppend
		
		var postVarBuilder = 'start_range=' + encodeURIComponent(startRange) + '&end_range=' + encodeURIComponent(endRange);
		
		//CRV if user passed phoneNum, then lets add that to the post var string
		if(optionalPhoneNum)
			{
				postVarBuilder += '&phone_num=' + encodeURIComponent(optionalPhoneNum);
			}
			
			
		$.ajax({
			type: "POST",
			url: baseUrl + '/draft?function=getDrafts',
			data: postVarBuilder,
			dataType: "json",
			xhrFields: { withCredentials: true},
			timeout: 10000,
			success: function(reply_server){
				console.log('success in fetchDrafts');
				console.log(reply_server);
				
				//CRV check to see if this is not a pro user
				if(reply_server.user == 'not_premium')
					{
						return(false);
					}

				
				//CRV this thread has drafts.  Let's append the flag and build the drafts UI for this message
				if(reply_server.messages.length > 0)
					{
    					
    					console.log(optionalPhoneNum);
    					
						buildAndAppendThreadLevelDraftsUI(reply_server.messages, optionalPhoneNum, reply_server.messages[0].phone_num_clean);
						//updateThreadCountInThreadList(reply_server.messages[0].phone_num_clean, reply_server.messages.length);
					}
				else
					{
						if(optionalPhoneNumClean)
							{
								removeDraftBadgesForThreadIfTheyExist(optionalPhoneNumClean);
							}
						
					}
			},
			error: function(reply_server){
				console.log('error in fetchDrafts');
				console.log(reply_server);	
			}
		});
		
	}	

function removeDraftBadgesForThreadIfTheyExist(phoneNumClean)
	{
/* 		$('#' + phoneNumClean + '_thread').find('.draft-count-badge').empty(); */
		$('#' + phoneNumClean + '_conversation').children('.responseArea').find('.draft-count-badge').remove();
	}

function buildAndAppendDraftModalInThread(phoneNum, phoneNumClean)
	{
   
        callKMInBackgroundPage('Open-Draft-Modal', {'Client':'CRX-New', 'Subclient' : currentLocation});
		
		var postVarBuilder = 'start_range=0&end_range=10&phone_num=' + encodeURIComponent(phoneNum);
			
		$.ajax({
			type: "POST",
			url: baseUrl + '/draft?function=getDrafts',
			data: postVarBuilder,
			dataType: "json",
			xhrFields: { withCredentials: true},
			timeout: 10000,
			success: function(reply_server){
				console.log('success in fetchDrafts');
				console.log(reply_server);
				
				//CRV remove any old modals that may be in the thread
				$('#' + phoneNumClean + '_draftModal').remove();
				
				//CRV this thread has drafts.  Let's append the flag and build the drafts UI for this message
				if(reply_server.messages.length > 0)
					{
						var drafts = reply_server.messages;
												
						var contactName = $('#' + phoneNumClean + '_conversation').siblings(".composeHeader").find('.title').html();
		
						var html = '';
						html += '<div id="' + phoneNumClean + '_draftModal" class="modal hide fade drafts-modal" data-numclean="' + phoneNumClean + '">';
						html += '<div class="modal-header">';
						html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
						html += '<h2 class="drafts-to-contact-header">Drafts to ' + contactName + '</h2>';
						html += '</div>';
						html += '<div class="modal-body">';
						html += buildDraftsTableHTML();
						html += '<div id="drafts-holder">';
						html += buildDraftHTMLAndAppendBatchToDraftPane(drafts, true);
						html += '</div>';
						html += '</div>';
						html += '</div>';
						
/* 						var appendLocation = $('#' + phoneNumClean + '_conversation'); */
                        var appendLocation = $("body");
						
						
						var modalInDom = $(html).appendTo(appendLocation);
						
						
						setDraftsListHTMLInstructions($(modalInDom).find('#drafts-holder'), true);
						
						$(modalInDom).modal({
    						show:true
						});
							
						//CRV update the draft badge counts
						buildAndAppendThreadLevelDraftsUI(reply_server.messages, phoneNum, reply_server.messages[0].phone_num_clean);
						//updateThreadCountInThreadList(reply_server.messages[0].phone_num_clean, reply_server.messages.length);
						
					}
				else
					{
						removeDraftBadgesForThreadIfTheyExist(phoneNumClean);
					}
					
					
			},
			error: function(reply_server){
				console.log('error in fetchDrafts');
				console.log(reply_server);	
			}
		});
			
	}

function buildAndAppendThreadLevelDraftsUI(drafts, phoneNum, phoneNumClean)
	{
		var numberOfDrafts = drafts.length;
//		console.error(numberOfDrafts);
		
		var draftCountBadgeAndDropUp = '';
		
		
		draftCountBadgeAndDropUp += buildAndReturnDraftCountBadge(numberOfDrafts, true); 
//		draftCountBadgeAndDropUp += '<div class="draft-modal-holder">';
		
//		draftCountBadgeAndDropUp += '</div>';
	
		
		var responseAreaToAppendTo = $('#' + phoneNumClean + '_conversation').children('.responseArea');
		
		
		//CRV if there is already a badge, let's remove it
		$('#' + phoneNumClean + '_conversation').children('.responseArea').find('.draft-count-badge').remove();
//		$('#' + phoneNumClean + '_entireConversation').children('.responseArea').find('.draft-modal-holder').remove();
		
		var dropUpInDom = $(draftCountBadgeAndDropUp).prependTo(responseAreaToAppendTo);
//		console.error(draftCountBadgeAndDropUp);
//		console.error(responseAreaToAppendTo);
//		console.error(dropUpInDom);
		
		$(dropUpInDom).click(function(){
			$(this).tooltip('destroy');
			buildAndAppendDraftModalInThread(phoneNum, phoneNumClean);
		});
		
		var numberOfDraftsText = numberOfDrafts;
		if(numberOfDrafts > 9)
			{
				numberOfDraftsText = '9+';
			}
		var tooltipString = 'draft';
		if(numberOfDrafts > 1)
			{
				tooltipString = 'drafts';	
			}
		
		var draftsBadgeTTOptions = {
			trigger: 'hover',
			title: numberOfDraftsText + " " + tooltipString,
			placement: 'left',
			delay: { show: tooltipShowDelayGlobal, hide: tooltipHideDelayGlobal }
		};
		$(dropUpInDom).tooltip(draftsBadgeTTOptions);
		
		
		/*
$.each($(modalInDom).find('.draft-recipient'), function(){
			setDraftInDraftPaneHoverInstructions($(this).parent());
		});
*/
		
	}

function deleteUserDraft(id)
	{
		var draftPhoneNum = $('#' + id + '_draft_in_pane').children('.draft-recipient').attr('data-phonenum');
		var draftPhoneNumClean = $('#' + id + '_draft_in_pane').children('.draft-recipient').attr('data-numclean');				
		
		$.ajax({
			type: "POST",
			url: baseUrl + '/draft?function=deleteDrafts&ids=' + encodeURIComponent(id),
			dataType: "json",
			xhrFields: { withCredentials: true},
			timeout: 10000,
			success: function(reply_server){
				console.log('success in deleteUserDraft');
				console.log(reply_server);
				
				//CRV remove the deleted drafts from the DOM
/*
				if(reply_server.num_deleted > 0 && threadDisplayModeGlobal == 'DRAFTS')
					{
						
						$('#delete-drafts-button').css('visibility', 'hidden');
					}
*/
				
				if(reply_server.num_deleted > 0){
					var draftIDsRemoved = reply_server.deleted_drafts;
					$.each(draftIDsRemoved, function(key, value){
						var draftIDInDom = '#' + value + '_draft_in_pane';
						$(draftIDInDom).remove();
					});
					
					if(reply_server.num_deleted > 1){
                    //multiple drafts deleted
					}
					
			        callKMInBackgroundPage('Delete-Draft-Single',{'Client':'CRX-New', 'Subclient' : currentLocation});

                    notifyUserSendConfirmation(null, "draft-deleted", "draft-deleted");
					
					//CRV get most recent draft info
					if(draftPhoneNum){
						fetchDraftsAndAppendFlagIfUserHasDraftsForThisThread(0, 10, draftPhoneNum, draftPhoneNumClean);
						if(draftPhoneNumClean){
							var numDraftsInModal = $('#' + draftPhoneNumClean + '_draftModal').children('.modal-body').find('.unsent-draft-holder').length;	
							
							if(numDraftsInModal == 0){
								$('#' + draftPhoneNumClean + '_draftModal').modal('hide');
							}
									
								//CRV check to see if the draft just deleted was populated in the dom.  If so, let's remove the the draftID from the save draft icon data attribute as that draft no longer exists.
							var draftCurrentlyInThread = $('#' + draftPhoneNumClean + '_save-draft').attr('data-draftid');
								
							if(draftCurrentlyInThread == id){
								$('#' + draftPhoneNumClean + '_save-draft').removeAttr('data-draftid');
							}
						}
					}
				}				
			},
			error: function(reply_server){
				console.log('error in deleteUserDraft');
				console.log(reply_server);	
			}
		});
	}

function populateDraftFromDraftPaneInComposeNew(draftHolder)
	{
		//CRV check to see if there is already a compose new in the DOM.  If so, do not switch to this new draft
		if($('#compose-new_save-draft').length > 0)
			{
				triggerCustomConfirm('You are already editing a message draft.');
				return(false);
			}
			
		
		var draftType = $(draftHolder).attr('data-type');
		//console.error(draftType);
		
		var draftId = $(draftHolder).children('.delete-draft-from-pane').attr('data-draftid');
		//console.error(draftId);
		
		var mmsBlobId = false;
		if($(draftHolder).children('.draft-body').find('.draft-mms-preview').length > 0)
			{
				mmsBlobId = $(draftHolder).children('.draft-body').find('.draft-mms-preview').attr('data-blob');
			}
		//console.error(mmsBlobId);
		
		if($(draftHolder).children('.draft-body').hasClass('empty-body'))
			{
				var draftBody = '';
			}
		else
			{
				var draftBody = $(draftHolder).children('.draft-body').find('.draft-body-in-message-bubble').html();
			}
		//console.error(draftBody);
		
		var recipient = '';
		if($(draftHolder).children('.draft-recipient').attr('data-phonenum'));
			{
				recipient = $(draftHolder).children('.draft-recipient').attr('data-phonenum');
			}
			
		//console.error(recipient);
	
	
		
		//CRV close any compose new windows that already exist in the dom
		$('#composeMessageHolder').find('.closeNewMessage').click();
		
		//CRV open the compose new window
		$('#newSms').click();
		
		//CRV if the draft has recipient(s), then let's add them to the compose new
		if(recipient)
			{
				var recipients = recipient.split('|');
				$.each(recipients, function(key, value){
					var phoneNum = value;
					var phoneNumClean = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(phoneNum, 'do_not_zeropad');
					var contactName = genericGetContactNameFromCaches(phoneNumClean, phoneNum);
					processContactForComposeSingleText(createHTMLEquivalentOfMessageBody(contactName, 'YES'), phoneNum);
				});
			}
		
		//CRV if there is a blob associated with this draft, add it to the response area
		if(mmsBlobId)
			{
				var whichCanvasAreaTarget = '#undefined_MMSCanvasArea';
				//CRV we are passing the draft ID here because we need to build a different MMS preview URL that references the content2ID rather than the blobID.  URLS referencing the blobID expire shortly after the blob is created.
				sendMightyPhoto(mmsBlobId, whichCanvasAreaTarget, draftId);
			}
		
		//CRV add the message body
		$('#send-one-text').append(draftBody);
		
		//CRV add the draftId to the save draft icon
		var draftIcon = $('#compose-new_save-draft');
		$(draftIcon).attr('data-draftid', draftId);
		
		//CRV if the message type is either 20 (send as multiple) or 21 (send as group, update the selector)
		
		if((draftType == 20) || (draftType == 21))
			{
				if(draftType == 20)
					{
						changeGroupSendMode('individual');
					}
				else if(draftType == 20)
					{
						changeGroupSendMode('group');
					}
			}

		//CRV resent the state of the draft icon to no pending changes 
		
		setTimeout(function(){toggleDraftSaveState(draftIcon, false);}, 50);
		
		//CRV set focus at end of response area
		var elem = $('#send-one-text').get(0);//This is the element that you want to move the caret to the end of
		setEndOfContenteditable(elem);
		
		
	}

function updateThreadCountInThreadList(phoneNumClean, draftCount)
	{
		var threadListID = '#' + phoneNumClean + '_conversation';		
		$(threadListID).find('.draft-count-badge').empty();
		
		var locationToPlaceDraftsBadge = $(threadListID).children('.msgCountAndTimeStampInTab').children('.draft-count-badge');
		
		if(draftCount > 0)
			{
				var newBadge = buildAndReturnDraftCountBadge(draftCount);
				$(locationToPlaceDraftsBadge).replaceWith(newBadge);
			}
		
	}	
	
function addDraftFromDraftModalToThread(draftIcon)
	{
		var draftType = $(draftIcon).attr('data-type');
// 		console.error(draftType);
		
		var draftId = $(draftIcon).children('.delete-draft-from-pane').attr('data-draftid');
// 		console.error(draftId);
		
		var mmsBlobId = false;
		if($(draftIcon).children('.draft-body').find('.draft-mms-preview').length > 0)
			{
				mmsBlobId = $(draftIcon).children('.draft-body').find('.draft-mms-preview').attr('data-blob');
			}
// 		console.error(mmsBlobId);
		
		if($(draftIcon).children('.draft-body').hasClass('empty-body'))
			{
				var draftBody = '';
			}
		else
			{
				var draftBody = $(draftIcon).children('.draft-body').find('.draft-body-in-message-bubble').html();
			}
// 		console.error(draftBody);
		
		var recipient = '';
		/*
if($(draftIcon).parent().siblings('.draft-recipient').attr('data-phonenum'));
			{
				recipient = $(draftIcon).parent().siblings('.draft-recipient').attr('data-phonenum');
			}
			
		console.error(recipient);
*/
		
		var phoneNumCleanOfThread = $(draftIcon).parent().parent().parent().attr('data-numclean');
// 		console.error(phoneNumCleanOfThread);
		
		//CRV if there is a blob associated with this draft, add it to the response area
		if(mmsBlobId)
			{
				var whichCanvasAreaTarget = $('#' + phoneNumCleanOfThread + '_conversation').find(".sendMMS");
				
				//CRV we are passing the draft ID here because we need to build a different MMS preview URL that references the content2ID rather than the blobID.  URLS referencing the blobID expire shortly after the blob is created.
				sendMightyPhoto(mmsBlobId, whichCanvasAreaTarget, draftId);
			}
		
		//CRV add the message body
		$('#' + phoneNumCleanOfThread + '_conversation').find(".messageToSend").append(draftBody);
		
		//CRV add the draftId to the save draft icon
		$('#' + phoneNumCleanOfThread + '_save-draft').attr('data-draftid', draftId);
		
		//CRV close the drafts modal. 
		$('#' + phoneNumCleanOfThread + '_draftModal').modal('hide');
		
		
		//CRV move cursor to end of the contenteditable response area
		var elem = $("#"+ phoneNumCleanOfThread +"_conversation").find(".messageToSend");//This is the element that you want to move the caret to the end of
		setEndOfContenteditable(elem);
	}
	
function saveAllDraftsInDom()
	{
		var threadsToSaveDraftsFor = new Array();
		
		//CRV loop through all response areas in the DOM and see if there are any unsent text bodies
		$('.messageToSend').each(function(i, obj) {
		
			var saveDraftID = $(this).parent().siblings('.save-draft-button-holder').children('.save-draft-icon').attr('id');
			
			var singleMessageContent = sanitizeTextResponse($(this), 'removeBRTags');
			if(singleMessageContent.length > 0){
				if(threadsToSaveDraftsFor.indexOf(saveDraftID) < 0){
					threadsToSaveDraftsFor.push(saveDraftID);
				}
			} else if(($(this).parent().siblings('.mightdcfoot').find('#mms-blob-id-holder').text().length > 0)){
				if(threadsToSaveDraftsFor.indexOf(saveDraftID) < 0){
    				
					threadsToSaveDraftsFor.push(saveDraftID);
				}
			}
				
			
			
			
			
		});
		
		
		$.each(threadsToSaveDraftsFor, function(key, value){
			$('#' + value).click();
		});	
		
		
	}

function toggleDraftSaveState(draftIcon, pendingChanges)
	{
		if(pendingChanges)
			{
				$(draftIcon).addClass('can-save');
				$(draftIcon).parent().addClass('can-save-holder');
			}
		else
			{
				$(draftIcon).removeClass('can-save');
				$(draftIcon).parent().removeClass('can-save-holder');
			}
	}

function buildAndReturnDraftCountBadge(numberOfDrafts, optionalHasBadgeStyling)
	{
		var numberOfDraftsText = numberOfDrafts;
		if(numberOfDrafts > 9)
			{
				numberOfDraftsText = '9+';
			}
		var optionals = '';
		if(numberOfDrafts > 1)
			{
				optionals = 's';
			}
		
		var badgeText = numberOfDraftsText + ' draft' + optionals;
		var badgeClass = ' badge-in-thread';
		if(optionalHasBadgeStyling)
			{
				badgeClass = ' badge';
				badgeText = numberOfDraftsText;	
			}
		return('<span class="draft-count-badge' + badgeClass + '" data-count="' + numberOfDrafts + '">' + badgeText +'</span>');
	}

function buildDraftsTableHTML()
	{
		var html = '';
		html += '<div id="drafts-pane-table-headers">';
		html += '<div class="draft-pane-table-header draft-body-spacing">Message</div>';
		html += '<div class="draft-pane-table-header draft-recipient-spacing">Recipient(s)</div>';
		html += '<div class="draft-pane-table-header draft-last-updated-spacing">Last Updated</div>';
		html += '</div>';
		return(html);
	}
function buildDraftHTMLAndAppendBatchToDraftPane(drafts, optionalIsModalBuild, optionalNumReceived, optionalNumRequested)
	{
		var html = '';
		var numDrafts = drafts.length;
		
		var numDraftsToAppend = numDrafts;
		
		//CRV if this is a draft pane build, then let's check to see if we should show all the content fetched or not show the last row (and show a load more button)
		if(!optionalIsModalBuild)
			{
				if(optionalNumReceived && optionalNumRequested && (optionalNumRequested == optionalNumReceived))
					{
						numDraftsToAppend = numDrafts - 1;	
					}
			}
		
		for(var i=0; i<numDraftsToAppend; i++)
			{
				var value = drafts[i];
				
				var optionalMMSPreview = '';
				if(value.mms_object_key)
					{
						optionalMMSPreview = '<div id="mms-scale-down" class="draft-mms-preview draft-mms-spacing" data-blob="' + value.mms_object_key + '"><img class="mmsImgWhole" src="' + baseUrl + '/imageserve?function=fetchViaServingUrl&id=' + value.id + '"></div>';
					}
			
				
				var draftDisplayBody = '';
				var optionalDraftHasNoBodyClass = ' empty-body';
				if(value.body)
					{
						draftDisplayBody = createHTMLEquivalentOfMessageBody(value.body, 'YES');
						
						optionalDraftHasNoBodyClass = '';
					}
					
				if(value.body || value.mms_object_key)
					{
						draftDisplayBody = '<div class="textWrapper outgoing">' + optionalMMSPreview + '<span class="draft-body-in-message-bubble">' + draftDisplayBody + '</span></div>';
					}
					
	
					
				var draftDisplayContact = 'No Contacts Selected';
				var optionalContactsDataAttr = '';
				if(value.phone_num)
					{
/* 						draftDisplayContact = genericGetContactNameFromCaches(value.phone_num_clean, value.phone_num); */
						draftDisplayContact = $("#"+value.phone_num_clean +"_conversation").siblings(".composeHeader").find(".title").html();
						optionalContactsDataAttr = 'data-phonenum="' + value.phone_num + '" data-numclean="' + value.phone_num_clean + '"';
					}
					
				
				
				var onclickEventToTrigger = 'onclick="populateDraftFromDraftPaneInComposeNew(this)"';
				if(optionalIsModalBuild)
					{
						onclickEventToTrigger = 'onclick="addDraftFromDraftModalToThread(this)"';
					}
				
			
				html += '<div id="' + value.id + '_draft_in_pane" class="unsent-draft-holder" data-type="' + value.type + '">';
				html += '<input type="checkbox" class="delete-draft-from-pane" data-draftid="' + value.id + '">';
				html += '<div class="draft-body draft-body-spacing' + optionalDraftHasNoBodyClass + '">' + draftDisplayBody + '</div>';
				html += '<div class="draft-recipient draft-recipient-spacing" ' + optionalContactsDataAttr + '>' + draftDisplayContact + '</div>';
				html += '<div class="draft-last-updated-spacing">' + cleanTimeDisplayPurposes(value.ts_server, true, false, false, false) + '</div>';
				
				html += '<div class="draft-pane-draft-tools">';
				//html += '<button class="mighty-app-button select-draft-to-add-in-thread" ' + onclickEventToTrigger + '><i class="fa fa-check"></i></button>';
				html += '<button class="mighty-app-button delete-single-draft-icon-in-draft-pane"><i class="fa fa-trash-o"></i></button>';
				html += '</div>';
	
				html += '</div>';
			}
		
		return(html);
	}	
function setDraftsListHTMLInstructions(draftsInDom, optionalIsModalBuild)
	{
	
		
		var deleteDraftTTOptions = {
			trigger: 'hover',
			title: "Delete",
			placement: 'left',
			delay: { show: tooltipShowDelayGlobal, hide: tooltipHideDelayGlobal }
		};
	
		$(draftsInDom).children('.unsent-draft-holder').each(function(){
		
			$(this).find('.delete-draft-from-pane').click(function(){
				event.stopPropagation();
				var numCheckBoxesChecked = $('.delete-draft-from-pane:checked').length;
				
				if(numCheckBoxesChecked > 0)
					{
						$('#delete-drafts-button').css('visibility', 'visible');
					}
				else
					{
						$('#delete-drafts-button').css('visibility', 'hidden');
					}
			});
			
			
			$(this).find('.delete-single-draft-icon-in-draft-pane').click(function(event){
				var draftID = $(this).parent().siblings('.delete-draft-from-pane').attr('data-draftid');
				event.stopPropagation();
				deleteUserDraft(draftID);
			});
			
			
			
			$(this).find('.delete-single-draft-icon-in-draft-pane').tooltip(deleteDraftTTOptions);
			
			$(this).click(function(event){	
    			
                callKMInBackgroundPage('select-draft-existing',{'Client':'CRX-New', 'Subclient' : currentLocation});
                
				if(optionalIsModalBuild)
					{
						addDraftFromDraftModalToThread($(this));
					}
				else
					{
						populateDraftFromDraftPaneInComposeNew($(this));
					}
			});
		});
	}

function getAndSetUserSignature(optionalNotifToUpdate)
	{
		if(!isAProUser){
			//CRV this isn't a pro user, so let's not make a server call
			return(false);
		}		
		
        $.ajax({
            type: "GET",
            url: baseUrl + "/usertemplates?function=getAllUserTemplates",
            dataType: "json",
            xhrFields: { withCredentials: true},
            success: function(reply_server){
                if(reply_server['user']  && (reply_server['user'] == 'not_premium')){
                    //not showing a modal here because this request is NOT triggered from a user action.  It's meant to be in the background
                    return(false);
            	}
                
            	//CRV we're not in the settings view, so let's check to see if the user has a signature. If so, let's append it. 				
            	var templates = reply_server['user_templates'];
                setUserSignatureInLocalStorage(templates);
                
            },
            error: function(reply_server){
                console.error('getAllUsersTemplates servlet error');
                //console.error(reply_server);
            }
        });

	}
function setUserSignatureInLocalStorage(templates){
    $(templates).each(function(index, template){
        var templateContent = jQuery.parseJSON(template.content.value);
        var name = decodeURIComponent(templateContent.name);
        var body = decodeURIComponent(templateContent.body);
        
        if(name == 'MTSignature'){
            var userSignature = body;
            chrome.storage.local.set({user_signature: userSignature});                                                            
        }
    });
}
function openPromoWebappInIframe(){
    var classicLink = $(".mightyMenuItem[data-appview='classic']");
    //click the texts link
    $(classicLink).attr("add-view", "promo").trigger("click");
    
    setTimeout(function(){
        //remove this new add-view attr.  Only need it for the purpose of displaying the pro feature list on load of the webapp iframe
        $(classicLink).removeAttr("add-view");
    }, 1000);  
}