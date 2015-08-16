var linetime = function(){

	var timeline;

	return {
		init: function(){
			timeline = new Timeline(2010, 2014, WBData);
			timeline.createTimeline();
		}
	}

}();