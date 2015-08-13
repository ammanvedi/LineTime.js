
window.onload = function()
{
	linetime.test("THIS OS THE TEXT ");
	$('body').append("<div class='datereadout'></div>");
	$(document).on("TimelineDateChanged:Scroll", function(event, arg1)
	{
		console.log(arg1);
		$(".datereadout").text(arg1.Day + " " + arg1.Month + " " + arg1.Year);
	});

}

