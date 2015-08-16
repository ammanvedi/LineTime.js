function Timeline(startDate, endDate, data){

	this.timelinedata = data;
	this.startdate = startDate;
	this.enddate = endDate;
	this.trackassignments = new Object();
	this.months = ["JAN", "FEB", "MAR", 
					"APR", "MAY", "JUN", 
					"JUL", "AUG", "SEP", 
					"OCT", "NOV", "DEC"
					];
	this.monthsize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.eventslookup = new Object();
	this.splitview = null;
	this.paddingL = 600;
	this.paddingR = 300;
	this.dayresolution = 2;

	this.createTimeline = function(){

		$("body").append("<div class='tl_holder'></div>");
		$(".tl_holder").append("<div class='tl_inner'></div>");
		$(".tl_inner").css({
			"padding-left": this.paddingL+"px"
		})
		$(".tl_holder").append("<div id='tl_marker'></div>");
		$(".tl_inner").on("scroll", {context : this}, this.scrollStop);

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
																+ (this.monthsize[i]+1) *this.dayresolution
																+ "px;' MONTH=" 
																+ this.months[i]
																+ " YEAR="
																+ year
																+"></div>");
				$(".tl_month." + year +"." + this.months[i]).append("<div class='tl_monthname'>" + this.months[i] +"</div>");

			}
		}

		this.loadFromJSON(this.timelinedata);
		this.splitview = new SplitView($(".tl_track").length);
		this.splitview.createHolder("body");

	}

	this.addEventTrack = function()
	{
		$(".tl_inner").append('<div class="tl_track"></div>');
		$('.tl_track').css({
			width: $('.tl_inner')[0].scrollWidth-this.paddingL + "px",
			"padding-right": this.paddingR+"px"
		})
	}

	this.addEventMarker = function(eDate, whichtrack, rangeidx)
	{
		var color = this.timelinedata.eventranges[rangeidx].color;
		var pos = this.getPixelPositionDate(eDate)-this.paddingL;
		$('.tl_track').eq(whichtrack).append("<div class='tl_eventmarker' style='left:" 
														+ pos + "px; background-color:"
														+ color + ";"
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
			$('.tl_track').each(function(index){
				if(!self.determineDateCollision(sdate, edate, index))
				{
					//no date collision on this track so add data
					//but first add the range to the tracking obj
					// so future collisions can be detected
					freefound = true;
					if(typeof self.trackassignments[index.toString()] !== Array)
					{
						self.trackassignments[index.toString()] = new Array();
					}

					self.trackassignments[index.toString()].push({
						"start" : sdate,
						"end" : edate
					});

					//add actual range
					self.addEventRange(sdate, edate, index, range["color"]);
					self.addJSONEvents(index, range["events"], idx);
					
				}

			});

			if(!freefound)
			{
				//no free tracks at all, must create a new track altogether
				self.addEventTrack();
				if(typeof self.trackassignments[($(".tl_track").length-1).toString()] !== Array)
				{
					self.trackassignments[($(".tl_track").length-1).toString()] = new Array();
				}
				self.trackassignments[($(".tl_track").length-1).toString()].push({
					"start" : sdate,
					"end" : edate
				});
				self.addEventRange(sdate, edate, $(".tl_track").length-1, range["color"])
				self.addJSONEvents($(".tl_track").length-1, range["events"], idx);
			}
		});
	}

	this.addJSONEvents = function(track, events, ridx)
	{
		var self = this;
		events.forEach(function(itm, idx){
			self.addEventMarker(self.parseDateString(itm["date"]), track, ridx);
			if(typeof self.eventslookup[itm.date] != Array)
			{
				self.eventslookup[itm.date] = new Array();
				self.eventslookup[itm.date].push({
						trackno: track,
						rangeidx: ridx,
						evtidx: idx
				});
			}else
			{
				self.eventslookup[itm.date].push({
						trackno: track,
						rangeidx: ridx,
						evtidx: idx
				});
			}
		});

	}

	this.determineDateCollision = function(startdate, enddate, tracktocheck)
	{
		//make sure both startdate and end date do not fall into 
		//any already present range on track specified
		if(this.trackassignments[tracktocheck.toString()] == undefined)
		{
			return false;
		}

		var res;

		this.trackassignments[tracktocheck.toString()].forEach(function(daterangeobj, index){
			if((startdate > daterangeobj["end"]) || (enddate < daterangeobj["start"]))
			{
				//no conflict 
				res = false
			}else
			{
				//there is a conflicat with the dates, return true to indicate
				res = true;
			}
		});

		return res;

	}


	this.addEventRange = function(sDate, eDate, whichtrack, color)
	{

		var da = new Date();
		da.setDate(20);
		da.setFullYear(1990);
		da.setMonth(10);
		var startpos = this.getPixelPositionDate(sDate)-this.paddingL;
		var endpos = this.getPixelPositionDate(eDate)-this.paddingL;
		var elwidth = endpos - startpos;
		$(".tl_track").eq(whichtrack).append("<div class='tl_tracksegment' style='left:" 
														+ startpos + "px; width:"
														+ elwidth + "px; background-color:"
														+ color + ";"
														+"'></div>");
	}

	this.getPixelPositionDate = function(DateObj)
	{
		var xoff = $('.tl_inner').find(".tl_month." + DateObj.getFullYear() + "." + this.months[DateObj.getMonth()]).position().left;
		return xoff + parseInt(DateObj.getDate() * this.dayresolution);
	}

	this.makeDateString = function(day, mth, yr)
	{
		var combstr = ""
		if(parseInt(day) < 10)
		{
			combstr = "0"+day;
		}else
		{
			combstr = day.toString();
		}
		combstr += "-"
		if((parseInt(this.months.indexOf(mth)) + 1) < 10)
		{
			combstr += "0"+ (parseInt(this.months.indexOf(mth)) + 1);
		}else
		{
			combstr += (parseInt(this.months.indexOf(mth)) + 1).toString();
		}
		combstr += "-"
		combstr += yr;
		return combstr;
	}

	this.getEventsFromDate = function(day, month, year)
	{
		//console.log(this.eventslookup, day, month, year)
		

		var self = this;
		var lookup = self.eventslookup[this.makeDateString(day, month, year)]
		if(lookup !== undefined)
		{
			res = new Array()
			lookup.forEach(function(eventlook, idx){
				var tmp = self.timelinedata.eventranges[eventlook.rangeidx].events[eventlook.evtidx];
				tmp["track"] = eventlook.trackno;
				tmp["eventtrack"] = self.timelinedata.eventranges[eventlook.rangeidx]
				res.push(self.timelinedata.eventranges[eventlook.rangeidx].events[eventlook.evtidx])
			})
			//console.log(res);
			return res;
		}else
		{
			return 0;
		}

	}

	this.getClosestPreviousEvents = function(day, month, year)
	{
		//console.log()
		var self = this;
		var now = self.parseDateString(self.makeDateString(day, month, year))
		//console.log(now)
		//array holds in index n the closest event on track n
		var results = new Array();
		//iterate through events, with dates (Keys)
		Object.keys(self.eventslookup).forEach(function(key, keynum){
			//we have event/s on this date
			//console.log(key);
			var date = self.parseDateString(key);
			if(date < now)
			{
				//console.log("EVENT DATE IS BEFORE NOW ")

				//date is before now
				self.eventslookup[key].forEach(function(itm, idx){
					//is it closer than alredy stored for track?
					if(results[itm.trackno] == undefined)
					{
						//no assignment yet made
						//console.log("is UNDEF setting ", date)
						results[itm.trackno] = date;
					}else
					{
						//date already stored for track
						//is date greater than stored 
						//because we already know its less than now
						if(results[itm.trackno] < date)
						{
							//this date is less than now but greater than 
							//previous stored date, i.e. closer, store it
							results[itm.trackno] = date;
						}
					}
				}) 
			}
		})
		//for each get the associated event data
		var dta = new Array()
		results.forEach(function(itm){
			var evts = self.getEventsFromDate(itm.getDate(), self.months[itm.getMonth()], itm.getFullYear())
			dta = dta.concat(evts);
		})
		return dta

	}

	this.isElementInViewport = function(el) {

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

	this.checkWithin = function(element)
	{
		//get vp position from element
		//left = x

		var boundingmarker =  document.getElementById("tl_marker").getBoundingClientRect();
		var elbounding = element.getBoundingClientRect()
		var x2 = boundingmarker.left;
		var x1 = elbounding.left;
		var w = elbounding.width;

		if( (x2 < x1+w) && (x2 > x1) )
		{
			// the rect is intersecting
			return parseInt((x2 - x1)/this.dayresolution);
		}

		//check vp position vs vp position of the marker
		//if within return true

		return false;
	}

	this.scrollStop = function(event)
	{
		//console.log(event.data.context)



		$(".tl_month").each(function(idx){

			if(event.data.context.isElementInViewport(this))
			{
				//the el is in the vp can be processed
				//check if within
				var y = event.data.context.checkWithin(this)
				if(y)
				{
					//var evts = event.data.context.getEventsFromDate(y, this.getAttribute("month"), this.getAttribute("year"));
					var evts = event.data.context.getClosestPreviousEvents(y, this.getAttribute("month"), this.getAttribute("year"))

					if(evts.length > 0)
					{
						evts.forEach(function(itm, idx){
							event.data.context.splitview.setTitle(itm.track, itm.title)
						})
					}

					
					//the element is both within the marker and onscreen
					$(document).trigger("TimelineDateChanged:Scroll", [{
						"Day": y,
						"Month": this.getAttribute("month"),
						"Year": this.getAttribute("year"),
						"events": evts
					}]);
					return;
				}
			}
			
		});


	}
}




