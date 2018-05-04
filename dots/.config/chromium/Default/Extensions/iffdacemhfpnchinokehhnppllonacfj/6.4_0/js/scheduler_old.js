
function setInstructionsForScheduler(id)
	{
		
		$('#' + id).datepicker({
    	startDate: new Date(),
    	defaultDate: new Date()
	}).on('show', function(e){
		if($('#addedContent').length > 0)
			{
				//CRV don't need to append anything as selector is alreay in dom
			}
		else
			{
				var timeSelector = $(buildTimePickerHtml(id)).appendTo('.datepicker-days');
				setTimeSelectorInstructions(timeSelector);
			}
		
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
	
	
function setTimeSelectorInstructions(html)
	{
		var currentDate = new Date();
		//currentDate = new Date("November 6, 2013 14:54:00"); //CRV hardcode date for testing purposes. 
		var currentMinute = currentDate.getMinutes();
		var minuteToSet = (5 * Math.ceil(currentMinute/5)) + 5; //CRV find closest future increment of "5" and then add 5 more minutes
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
		
		if(currentHour > 12) //CRV this is a PM time
			{
				currentAmPm = 'pm';
				currentHour = currentHour - 12;
			}
		
		
		
		$(".minuteSelect").val(minuteToSet).attr('selected',true);
		$(".hourSelect").val(currentHour).attr('selected',true);
		$(".amPmSelect").val(currentAmPm).attr('selected',true);
		
		$(html).find('#setDateAndTimeButton').click(function(){
			var parentButtonID = $(this).attr('data-button-triggered-from');
			var date = $('#' + parentButtonID).datepicker('getDate');
			var amPm = $('.amPmSelect').val();
			var hours = parseInt($('.hourSelect').val());  //CRV Needed to turn this into an interger so that we can add 12 hours to the time
			if(amPm == "pm")
				{
					hours = hours + 12;
				}
			var minutes = $('.minuteSelect').val();
			
			console.log('hours: ');
			console.log(hours);
			console.log('minutes: ');
			console.log(minutes);
			
			var dateSelected = moment(date).add('hours', hours).add('minutes', minutes);
			
			
			var scheduledTextRecipient = $('#schedulerModalIDHolder').text();
			//alert(schedulerModalIDHolder);
			var UNIXscheduledTime = dateSelected.valueOf();
			if(isAValidSchedulerDateAndTime(UNIXscheduledTime))
				{
					createScheduledMessageLabelInDom(UNIXscheduledTime, scheduledTextRecipient);
					$('#' + parentButtonID).datepicker('hide');
					/*
$('#timepickerModal').val('');
					$('#datepickerModal').val('');
					$('#schedulerModalIDHolder').empty();
					$('#schedulerModal').modal('hide');
*/
				}
			else
				{
					
					return(false);
				}
		});
	}	
	
function buildTimePickerHtml(id)
	{
		var html = '';
		
		html += '<div id="addedContent">';
		html += '<select name="hour" class="hourSelect timeSelector" style="width: 60px"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>';
		html += '<select name="minute" class="minuteSelect timeSelector" style="width: 60px"><option value="0">00</option><option value="5">05</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="25">25</option><option value="30">30</option><option value="35">35</option><option value="40">40</option><option value="45">45</option><option value="50">50</option><option value="55">55</option></select>';
		html += '<select name="ampm" class="amPmSelect timeSelector" style="width: 60px"><option value="am">AM</option><option value="pm">PM</option></select>';
		html += '<button id="setDateAndTimeButton" data-button-triggered-from="' + id + '">Set</button>';
		html += '<span id="schedulerModalIDHolder">' + id + '</span>';
		html += '</div>';
		
		
		return(html);
	}

function getEventList(start, end)
	{
		$.ajax({
		   type: "GET",
		   url: baseUrl + '/event?function=getEventsFullDetails&start_range=' + start + '&end_range=' + end,
		   dataType: "json",
		   xhrFields: { withCredentials: true},
		   success: function(reply_server){
			   console.log('success in getEventList');
			   console.log(reply_server);
			   
			   numberRowsSuccessFullyAdded = 0; //CRV reset the global counter for number of rows loaded in the table
			   
			   $('#pinnedContent').empty().append('<div id="schedulerTableWrapper" class="standardContentSpacing genericTableStyling"><div id="scheduledMessagesHeader" class="contactPanelHeaderText mainSectionHeader">Scheduler</div>' + buildEventTableStructure() + '</div>');
			   
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
			   for(var i=0; i< reply_server.eventlist_full_details.length; i++)
				{
					if(reply_server.eventlist_full_details[i])
						{
							addEventRowToEventsTable(reply_server.eventlist_full_details[i])
						}
				}
				
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
							
							
			   
			   
			   var cancelledButton = '<div class="cancelEventButton" onclick="cancelEvent(\'' + event.event_id + '\')"><i class="icon-remove cancelEventInTable"></i></div>';
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
		console.error(messageInfo);
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
			delay: { show: 150, hide: 100 }
		};
		$(html).tooltip(groupEventTTOptions);
	}

function setDeleteIconTooltip(html)
	{
		var deleteEventTTOptions = {
			trigger: 'hover',
			title: 'Cancel Scheduled Message',
			placement: 'bottom',
			delay: { show: 150, hide: 100 }
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
			delay: { show: 150, hide: 100 }
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
		html += '<th>Scheduled</th>'
		html += '</tr>';
		html += '</thead>';
		html += '<tbody id="eventTableBody">';
		html += '</tbody>';
		html += '</table>'
		html += '</div>';
		html += '</div>';
		
		return(html);
	}

function cancelEvent(eventID)
	{
		
		if(confirm("Are you sure you want to cancel this scheduled message?"))
			{
				if(threadDisplayModeGlobal == 'EVENTS')
					{
						$('#event_' + eventID).children('.event_cancel').fadeOut().html('Cancelling Event...').fadeIn();
					}
				
				$.ajax({
				   type: "GET",
				   url: baseUrl + "/event?function=cancelEvent&event_id=" + eventID,
				   dataType: "json",
				   xhrFields: { withCredentials: true},
				   success: function(reply_server){
					   console.log('success in cancelEvent');
					   console.log(reply_server);
					   var event_id = reply_server.eventlist_details.event_id;
					   var status = reply_server.eventlist_details.status;
					   if(threadDisplayModeGlobal == 'EVENTS')
					   	{
						   	
						   	$('#event_' + event_id).children('.event_status').fadeOut().html(convertStatusCodeToIcon(reply_server.eventlist_details.status) + '<i id="eventHistory_' + event_id + '" class="icon-search moreInfoStatus"></i>' + convertStatusCodeToText(reply_server.eventlist_details.status)).fadeIn();  	
						   	
						   	var eventHistoryIcon = $('#event_' + event_id).children('.event_status').children('.moreInfoStatus');
			   
							
						   	setInstructionsForEventHistoryDropDown(eventHistoryIcon, event_id);
						   	
						   	//showEventHistory(event_id);
					   	}
					   else if((threadDisplayModeGlobal == 'CLASSIC') || (threadDisplayModeGlobal == 'POWERVIEW'))
					   	{
						   	//alert(reply_server.eventlist_details.ref_id);
						   	$('#sms-line-item-msgid-' + reply_server.eventlist_details.ref_id).find('.timestamp-msg').text('Cancelling Event...');
					   	}
					   
					   
					   
					   //alert('success in cancel');
					   
				   },
				   error: function(reply_server){
					   console.log('error in cancelEvent');
					   console.log(reply_server);
				   }
				});
			}
		else
			{
				return(false);
			}
		
		
		
	}
	
/*
function getContent2Info(event, totalNumEvents)
	{
		$.ajax({
		   type: "GET",
		   url: baseUrl + "/content?function=getMessageDetail&id=" + event.ref_id,
		   dataType: "json",
		   xhrFields: { withCredentials: true},
		   success: function(reply_server){
			   console.log('success in getContent2Info');
			   console.log(reply_server);
			   
			   
			   
			   var clean_phone_num = getSanitizedPhoneNumberRemoveHyphensParenthesisSpaces(reply_server.message.phone_num, 'do_not_zeropad');
			   var contact = genericGetContactNameFromCaches(clean_phone_num, reply_server.message.phone_num);
			   
			   
			   var cancelledButton = '<div class="cancelEventButton" onclick="cancelEvent(\'' + event.event_id + '\')">Cancel</div>';
			   var currentTS = new Date().getTime();
			   if(currentTS > event.ts_event_trigger)
			   	{
				   	cancelledButton = ' ';
			   	}
				if(event.status == 705)
					{
						cancelledButton = 'Cancelled';
					}
				if(event.status == 710)
					{
						cancelledButton = '<div class="successEventButton">Success</div>';
					}
					
				
				
			   var html = '';
			   html += '<td class="event_message">' + createHTMLEquivalentOfMessageBody(reply_server.message.body) + '</td>';
			   html += '<td class="event_contact">' + contact + '</td>';
			   html += '<td class="event_status">' + convertStatusCodeToText(event.status) + '  <i id="eventHistory_' + event.event_id + '" class="icon-chevron-up moreInfoStatus"></i></td>';
			   html += '<td class="event_ts_creation">' + cleanTimeDisplayPurposes(event.ts_creation,true) + '</td>';
			   html += '<td class="event_ts_trigger">' + cleanTimeDisplayPurposes(event.ts_event_trigger,false) + '</td>';
			   html += '<td class="event_cancel">' + cancelledButton + '</td>';

			   $('#event_' + event.event_id).append(html);
			   
			   showEventHistory(event.event_id);
			   
			   
			   //CRV we call this function in the callback of getContent2Info so that we only increment the count of the number of rows being shown once the ajax call for content2 info has returned
			   showTableOnlyIfLastRowHasBeenFilled(totalNumEvents);
			   
		   },
		   error: function(reply_server){
		   
		   //CRV we call this function in the callback of getContent2Info so that we only increment the count of the number of rows being shown once the ajax call for content2 info has returned
			   showTableOnlyIfLastRowHasBeenFilled(totalNumEvents);
			   console.log('error in getContent2Info');
			   console.log(reply_server);
		   }
		});

	}
*/


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
				statusImage = '<img src="scheduler_1_with_error_state_triangle.png" class="scheduledTableStatusIcon" alt="scheduler_error" width="18" height="18" />';
			}
		else if(status == 704)
			{
				statusImage = '<img src="assets/1382502427_time_clock_snack_alarm_wait.png" class="scheduledTableStatusIcon" alt="Scheduling" width="15" height="15" />';
			}
		else if(status == 705)
			{
				statusImage = '<img src="scheduler_1_with_red_cancel.png" class="scheduledTableStatusIcon" alt="cancelled" width="18" height="18" />';
			}
		else if(status == 706)
			{
				statusImage = '<img src="scheduler_1_with_error_state_triangle.png" class="scheduledTableStatusIcon" alt="scheduler_error" width="18" height="18" />';
			}
			
		else if(status == 710)
			{
				statusImage = '<img src="scheduler_1_with_green_checkmark.png" class="scheduledTableStatusIcon" alt="sent" width="18" height="18" />';
			}
		else if(status == 799)
			{
				statusImage = '<img src="scheduler_1_with_error_state_triangle.png" class="scheduledTableStatusIcon" alt="scheduler_error" width="18" height="18" />';
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



function getScheduledTimeIfExists(phoneNumClean)
	{
		if($('#' + phoneNumClean + '_Scheduler_label').length > 0)
			{
				var ts = $('#' + phoneNumClean + '_Scheduler_label').children('.scheduledTime').attr('data-unix');
				
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
    				   	console.log(messageJSON);
				   		var newMessage = buildMessageHTML(messageJSON);
				   		//console.error(messageJSON);
					   	console.error('newMessasge html:');
				   		console.log(newMessage);
					   	//console.error(newMessage);
					   	
					   	console.log($("#message-id-"+ref_id));
					   	
					   	$('#message-id-' + ref_id).fadeOut().replaceWith(newMessage).fadeIn();
					   	
					   	
					   	//CRV set instructions on this message
					   	var newContent = $('#message-id-' + ref_id);
					   	var windowChecked = $(newContent).closest("div.composeInnerContainer");
					   	//resetThreadResponseAreaAfterNewMessageHasBeenSentFromWebApp(newContent);
					   	addItemActionsEventHandlers(newContent, windowChecked, false);
					   	addToolTipToSentConfirmationIcon($(newContent).find(".sentMessageStatus"), "scheduled_event");
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
				alert('You must select a date and time in the future.');
				return(false);
			}
		else
			{
				if(unixTS < currentTSPlusFiveMinutes)
					{
						alert('You must select a date and time at least 5 minutes from now.');
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
		var scheduledMessageLabel = '';
		//scheduledMessageLabel += '<div id="' + scheduledTextRecipient + '_label" class="scheduledLabel"><span class="scheduledTime" data-unix="' + UNIXscheduledTime + '">' + cleanTimeDisplayPurposes(UNIXscheduledTime,false) + '</span><i class="icon-pencil editTimeIcon"></i><div class="closeSchedulerLabel" onclick="$(this).parent().remove();"><strong>x</strong></div></div>';
		
		scheduledMessageLabel += '<div id="' + scheduledTextRecipient + '_label" class="scheduledLabel"><span class="scheduledTime" data-unix="' + UNIXscheduledTime + '">' + cleanTimeDisplayPurposes(UNIXscheduledTime,false) + '</span><div class="closeSchedulerLabel" onclick="removeSchedulerLabel(this)"><strong>x</strong></div></div>';
		
		var label = $(scheduledMessageLabel).appendTo(appendHere);
		
		$(label).click(function(){
			//$('#datepickerModal').val(date);
			//$('#timepickerModal').val(time);
			$('#' + scheduledTextRecipient).click();
			
			//$('.closeSchedulerModal').text('Cancel Edit');
		});
		
		//CRV set hover for close icon
		$(label).mouseover(function(){
			$(this).children('.closeSchedulerLabel').show();
		});
		$(label).mouseout(function(){
			$(this).children('.closeSchedulerLabel').hide();
		});
		
		//CRV change the icon in the send button
		$(label).siblings('.responseButtonsHolder').children('.sendButton').children('.dcsendicon').addClass('dcsendiconScheduled');
		$(label).siblings('.responseButtonsHolder').children('.sendButton').append('<div class="scheduleButtonLabel">Schedule</div>');
		$(label).siblings('.responseButtonsHolder').children('.sendButton').addClass('expandedSendIcon');
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
	 
	   if(status == 705){//CRV event was cancelled
            console.log("MESSAGE ID!!!!!!!!!!!!!!!!");
            console.log(messageID);
//          message-id-13842878849248020699
		   	$('#message-id-' + messageID).removeClass('scheduledMessage').addClass('scheduledMessageCancelled');
		   	$('#message-id-' + messageID).find('.textTimeStamp').empty().text('Cancelled');
		   	alert(2);
		   	//$('#message-id-' + messageID).find('.sentMessageStatus').remove();
//		   	$('#message-id-' + messageID).children('.cancelEventInMessage').tooltip('destroy');
//		   	$('#message-id-' + messageID).children('.cancelEventInMessage').remove();
	   	}
	   	else//KL MAY NOT NEED THIS. UNCERTAIN IF THE USER SHOULD BE ABLE TO CANCEL MESSAGE IN GTEXT
	   		{
/*
		   		//CRV add cancel event icon only if it doesn't already exist
		   		if($('#sms-line-item-msgid-' + messageID).children('.cancelEventInMessage').length < 1)
		   			{
			   			var cancelEventTTOptions = {
							trigger: 'hover',
							title: 'Cancel Event',
							placement: 'bottom',
							delay: { show: 200, hide: 100 }
						};
				   	
				   		$('#sms-line-item-msgid-' + messageID).children('.sentMessageStatus').after('<i class="icon-remove cancelEventInMessage" onclick="cancelEvent(\'' + eventID + '\')"></i>');
				   		$('#sms-line-item-msgid-' + messageID).children('.cancelEventInMessage').tooltip(cancelEventTTOptions);
		   			}			
				
*/
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

	
