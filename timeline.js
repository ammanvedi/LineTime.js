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


		var start = new Date();
		start.setDate(20);
		start.setMonth(10);
		start.setFullYear(1990);

		var end = new Date();
		end.setDate(4);
		end.setMonth(6);
		end.setFullYear(1991);

		this.addEventRange(start, end);

		var start = new Date();
		start.setDate(20);
		start.setMonth(7);
		start.setFullYear(1991);

		var end = new Date();
		end.setDate(4);
		end.setMonth(6);
		end.setFullYear(1993);

		this.addEventRange(start, end);

		var start = new Date();
		start.setDate(20);
		start.setMonth(1);
		start.setFullYear(1991);

		var end = new Date();
		end.setDate(4);
		end.setMonth(11);
		end.setFullYear(1991);

		this.addEventRange(start, end);
	}


	this.addEventRange = function(sDate, eDate)
	{

		var da = new Date();
		da.setDate(20);
		da.setFullYear(1990);
		da.setMonth(10);
		var startpos = this.getPixelPositionDate(sDate);
		var endpos = this.getPixelPositionDate(eDate);
		var elwidth = endpos - startpos;
		console.log("will show elwidth");
		console.log(startpos);
		console.log(endpos);
		console.log(elwidth);
		$(".tl_inner").append("<div class='tl_eventrange' style='left:" 
														+ startpos + "px; width:"
														+ elwidth + "px;"
														+"'></div>")
	}

	this.getPixelPositionDate = function(DateObj)
	{
		var xoff = $('.tl_inner').find(".tl_month." + DateObj.getFullYear() + "." + this.months[DateObj.getMonth()]).position().left;
		return xoff + parseInt(DateObj.getDate() * 2);
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











