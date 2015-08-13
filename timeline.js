function Timeline(startDate, endDate){

	this.startdate = startDate;
	this.enddate = endDate;
	this.trackassignments = new Object();
	this.months = ["JAN", "FEB", "MAR", 
					"APR", "MAY", "JUN", 
					"JUL", "AUG", "SEP", 
					"OCT", "NOV", "DEC"
					];
	this.monthsize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	this.createTimeline = function(){

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

		this.loadFromJSON(WBData);

/*
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

		this.addEventRange(start, end, 1);
		this.addEventMarker(end, 0);

		var start = new Date();
		start.setDate(20);
		start.setMonth(1);
		start.setFullYear(1991);

		var end = new Date();
		end.setDate(4);
		end.setMonth(11);
		end.setFullYear(1991);

		this.addEventRange(start, end, 0);

		var marker = new Date();
		end.setDate(4);
		end.setMonth(6);
		end.setFullYear(1991);

		this.addEventMarker(end, 0);


*/
	}

	this.addEventTrack = function()
	{
		$(".tl_inner").append('<div class="tl_track"></div>');
		$('.tl_track').css({
			width: $('.tl_inner')[0].scrollWidth + "px"
		})
	}

	this.addEventMarker = function(eDate, whichtrack)
	{
		$('.tl_track').eq(0).append("<div class='tl_eventmarker' style='left:" 
														+ this.getPixelPositionDate(eDate) + "px;"
														+"'></div>");
	}


	this.parseDateString = function(str)
	{
		var day = str.substring(0,2);
		var month = str.substring(3,5);
		var year = str.substring(6);
		var d = new Date();
		d.setDate(parseInt(day));
		d.setMonth(parseInt(month)-1);
		d.setFullYear(parseInt(year));

		return d;

	}

	this.loadFromJSON = function(JSONDATA)
	{
		var self = this;

		JSONDATA.eventranges.forEach(function(range, idx){
			var freefound = false;
			var sdate = self.parseDateString(range["startdate"]);
			var edate = self.parseDateString(range["enddate"]);
			console.log("DATE", sdate);
			console.log("DATE", edate);
			$('.tl_track').each(function(index){
				console.log("testing", sdate, edate, index)
				if(!self.determineDateCollision(sdate, edate, index))
				{
					//no date collision on this track so add data
					//but first add the range to the tracking obj
					// so future collisions can be detected
					freefound = true;
					console.log("FREEFOUND", self.determineDateCollision(sdate, edate, index), !undefined)

					if(typeof self.trackassignments[index.toString()] !== Array)
					{
						self.trackassignments[index.toString()] = new Array();
					}

					self.trackassignments[index.toString()].push({
						"start" : sdate,
						"end" : edate
					});

					//add actual range
					self.addEventRange(sdate, edate, index);
					
				}

			});

			if(!freefound)
			{
				//no free tracks at all, must create a new track altogether
				console.log("FREE NOT FOUND FOR ", sdate, edate)
				self.addEventTrack();
				if(typeof self.trackassignments[($(".tl_track").length-1).toString()] !== Array)
				{
					self.trackassignments[($(".tl_track").length-1).toString()] = new Array();
				}
				self.trackassignments[($(".tl_track").length-1).toString()].push({
					"start" : sdate,
					"end" : edate
				});
				self.addEventRange(sdate, edate, $(".tl_track").length-1)
			}
		});

		console.log(this)
		console.log(self)


	}

	this.determineDateCollision = function(startdate, enddate, tracktocheck)
	{
		//make sure both startdate and end date do not fall into 
		//any already present range on track specified
		if(this.trackassignments[tracktocheck.toString()] == undefined)
		{
			console.log("NO CONFLICT")
			return false;
		}

		var res;

		this.trackassignments[tracktocheck.toString()].forEach(function(daterangeobj, index){
			console.log("checking incoming", startdate, enddate)
			console.log("versus ", daterangeobj["start"], daterangeobj["end"])
			if((startdate > daterangeobj["end"]) || (enddate < daterangeobj["start"]))
			{
				//no conflict 
				console.log("NO CONFLICT")
				res = false
			}else
			{
				//there is a conflicat with the dates, return true to indicate
				console.log("CONFLICT", startdate, enddate, tracktocheck)
				res = true;
			}
		});

		return res;


	}


	this.addEventRange = function(sDate, eDate, whichtrack)
	{

		var da = new Date();
		da.setDate(20);
		da.setFullYear(1990);
		da.setMonth(10);
		var startpos = this.getPixelPositionDate(sDate);
		var endpos = this.getPixelPositionDate(eDate);
		var elwidth = endpos - startpos;
		$(".tl_track").eq(whichtrack).append("<div class='tl_tracksegment' style='left:" 
														+ startpos + "px; width:"
														+ elwidth + "px;"
														+"'></div>");
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











