
window.onload = function()
{
	linetime.test("THIS OS THE TEXT ");
	$(document).on("TimelineDateChanged:Scroll", function(event, arg1)
	{
		console.log(arg1);
	});

}

