function Timeline(startDate, endDate){

	this.startdate = startDate;
	this.enddate = endDate;
	this.months = ["JAN", "FEB", "MAR", 
					"APR", "MAY", "JUN", 
					"JUL", "AUG", "SEP", 
					"OCT", "NOV", "DEC"
					];
	this.monthsize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	this.createTimeline = function(){
		console.log(this.startdate);
		console.log(this.enddate);
		$("body").append("<div class='tl_holder'></div>");
		$(".tl_holder").append("<div class='tl_inner'></div>");

		for(var x = 0; x < this.enddate - this.startdate; x++)
		{
			//console.log('x ' + x);
			//iterates number of years
			//add year marker
			var year = this.startdate + x;
			$(".tl_inner").append("<div class='tl_year'>" + year +"</div>")
			//for each month of the year add divs for each day
			for(var i=0; i< 12; i++)
			{
				//console.log('i ' + i + ' ' + this.months[i]);
				$(".tl_inner").append("<div class='tl_month " + year + " " + this.months[i] + "'></div>");
				$(".tl_month." + year +"." + this.months[i]).append("<div class='tl_monthname'>" + this.months[i] +"</div>");
				//$(".tl_month").append("<div class='tl_monthdays'></div>");
				//for each month

			}
		}
	}
}