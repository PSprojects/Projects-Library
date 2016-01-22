/* Add BinVal to reporting on accounts that need to have it on their gateway reporting
/* Lisa French - 8/20/2015
*/

$(function() {
	
	// Change all "names" to be id's for ease of use.
	// this might need to go away if there are any ID collisions
	$("#epayform input, #epayform select").each(function() {
		if(!$(this).attr('id')) {
			$(this).attr('id', $(this).attr('name'));
		}
	})
	// jQuery on function
	

	$('[name="submitbutton"]').click(function() {
	  // form validation
	  /*
	  var validator = $("#epayform").validate({
	   rules: formRules
	  });
	  */
	  
	  
	  // Start bin validation
	  
	  // call epayform collect bin and pass to url
	  if ( true || $("#epayform").valid() ) {
		var $card = $("#UMcard"),
			bin   = ("" + $card.val()).substr(0, 6),
			url   = "https://www.apsmemberservices.com/binvalrequest.php?bin=" + bin + "&key=ad1d8289efa7b86dddd2b64143c74211891938";
			
		console.log(bin);
		
		var onComplete = function(data, status) {
			console.log(status);
			// Collect payment method and pass to UMorderid 
			if(data && data[0] && data[0].PaymentMethod) {
				$("#UMorderid").val(data[0].PaymentMethod);
			} else {
				$("#UMorderid").val("null");
			}
			$('#epayform').submit();
		}
		
		$.ajax({
		  url: url,
		  dataType: 'json',
		  success: onComplete,
		  timeout: 3000 //3 second timeout
		});	
	}
	// End bin validation

});

