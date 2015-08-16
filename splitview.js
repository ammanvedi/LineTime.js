var SplitView = function(TrackCount){

	this.trackcount = TrackCount;


	this.createHolder = function(appendTo)
	{
		$(appendTo).append("<div id='sv_holder'></div>");

		for (var i = 0; i < this.trackcount; i++) {
			this.addTrackView();
		};

	}

	this.addTrackView = function()
	{
		$('#sv_holder').append('<div class="sv_trackview"> ' 
									+'<div class="sv_colbar"></div>'
									+'<div class="sv_expand"></div>'
									+'<div class="sv_title"></div>'
									+'<div class="sv_content"></div>'
								+'</div>');
	}

	this.setTitle = function(TVNum, title)
	{
		$(".sv_title").eq(TVNum).text(title)
	}

	this.setContent = function(TVNum, content)
	{

	}

	this.expandContent = function(TVNum)
	{

	}

	this.collapseContent = function(TVNum)
	{

	}




}