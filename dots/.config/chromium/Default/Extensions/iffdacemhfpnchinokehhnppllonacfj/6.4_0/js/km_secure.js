function setKMSecure(retry_count){
	if(retry_count > 10)
		return(false);
	else
		{
		if (typeof KM != 'undefined') //KM object is there 
			{
			if((KM.hasOwnProperty("td")) && (KM.hasOwnProperty("tds")))    //customize KM object to ensure HTTPS calls - MA Nov 21 2014
				{
    				console.log("Successfully set KM HTTPS override");
					KM.td = KM.tds;
				} 	
			}
		else
			{
			var retryDelay = 100;
			console.error('Unable to set HTTPS protocol for KM events because global KM js object not defined. Going to try again in ' + retryDelay + 'ms -- current retry count: ' + retry_count + '.');
			setTimeout(function(){	
				setKMSecure(retry_count + 1);
				}, retryDelay);
			}
		}
}

setKMSecure(0);