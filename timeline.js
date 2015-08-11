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
				$(".tl_inner").append("<div class='tl_month " + year 
																+ " " 
																+ this.months[i] 
																+ "' style='width:" 
																+ (this.monthsize[i]+1) *2 
																+ "px;' MONTH=" 
																+ this.months[i]
																+ " YEAR="
																+ year
																+"></div>");
				$(".tl_month." + year +"." + this.months[i]).append("<div class='tl_monthname'>" + this.months[i] +"</div>");

			}
		}
	}


	this.addEventRange = function()
	{
		//find div with id for req month, find its offset
		//calc minor offset from day
		//create track
		//offset track iff overlap occurs
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

		var checkWithin = function(element)
		{
			//get vp position from element
			//left = x

			var boundingmarker =  document.getElementById("tl_marker").getBoundingClientRect();
			var elbounding = element.getBoundingClientRect()
			//console.log(boundingmarker);
			var x2 = boundingmarker.left;
			var x1 = elbounding.left;
			var w = elbounding.width;

			if( (x2 < x1+w) && (x2 > x1) )
			{
				// the rect is intersecting
				return parseInt((x2 - x1)/2);
			}


			//check vp position vs vp position of the marker
			//if within return true

			return false;
		}

		$(".tl_month").each(function(idx){

			if(isElementInViewport(this))
			{
				//the el is in the vp can be processed
				//check if within
				var y = checkWithin(this)
				if(y)
				{
					//the element is both within the marker and onscreen
					//console.log(y + " " + this.getAttribute("month") + " " + this.getAttribute("year"));
					//console.log(y)
					$(document).trigger("TimelineDateChanged:Scroll", [{
						"Day": y,
						"Month": this.getAttribute("month"),
						"Year": this.getAttribute("year")
					}])
					return;
				}
			}
			
		});


	}
}











