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
		$(".tl_holder").append("<div id='tl_marker'></div>");
		$(".tl_inner").scroll(this.scrollStop);

		for(var x = 0; x < this.enddate - this.startdate; x++)
		{
			var year = this.startdate + x;
			$(".tl_inner").append("<div class='tl_year'>" + year +"<div class='tl_yearline'></div></div>")
			for(var i=0; i< 12; i++)
			{
				$(".tl_inner").append("<div class='tl_month " + year + " " + this.months[i] + "'></div>");
				$(".tl_month." + year +"." + this.months[i]).append("<div class='tl_monthname'>" + this.months[i] +"</div>");

			}
		}
	}




	this.scrollStop = function()
	{

		var isElementInViewport = function(el) {

	    if (typeof jQuery === "function" && el instanceof jQuery) {
	        el = el[0];
	    }

	    var rect = el.getBoundingClientRect();

	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	    );
		}
//		console.log(typeof $(".tl_month"));
//		console.log($(".tl_month"))
		console.log(this);
		var fp = this.isElementInViewport;
		var x = new Array();
		$(".tl_month").each(function(idx){

			if(isElementInViewport(this))
			{
				//the el is in the vp can be processed
				x.push(this);
			}
			
		});
			if(x.length != 0)
			{
				console.log(x);
			}

	}
}











