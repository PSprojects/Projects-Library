// Set source to Recurring Web Javascript
// Must have set up source key in Gateway
// Add appropriate UM codes and see the companion html (recurringweb.html)
// Lisa French - 8/20/2015

$(function() {

	if (document.getElementById('UMaddcustomer').checked) {
		$('#epayform').append('<input type="hidden" name="UMsourcekey" value="yes">' && '<input type="hidden" name="UMkey" value="[key goes here]">');
		}
		else {
		$('#epayform').append('<input ype="hidden" name="UMsourcekey" value="yes">' && '<input type="hidden" name="UMkey" value="[key goes here]">');
		}
	});
