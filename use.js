
window.onload = function()
{
	linetime.init();
	$('body').append("<div class='datereadout'></div>");
	$(document).on("TimelineDateChanged:Scroll", function(event, arg1)
	{
		if(arg1.events.length > 0)
		{
			//console.log(arg1);
		}

		$(".datereadout").text(arg1.Day + " " + arg1.Month + " " + arg1.Year);
	});

}

