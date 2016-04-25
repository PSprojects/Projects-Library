/* var billingOverlay; */
$(function() {
/*	billingOverlay = $('#billing-terms').overlay({ mask: '#000', load: false }); */

	// recurring billing toggle
	$('#UMaddcustomer').click(function() {
		$('#recurring').toggle();
		if ( $('#recurring').is(":visible") ) {
			$('#UMbillamount').val(
				$('#UMbillamount').val() || $('#UMamount').val()
			);
		}
		else {
			$('#UMbillamount').val('');
		}
	});

	// format amounts entered
	$('#UMamount').blur(function(){jQueryCurrencyFormat(this)});
	$('#UMbillamount').blur(function(){jQueryCurrencyFormat(this)});

	// strip non-numbers from relevant fields
	$(".number-only").blur(function() { jQueryForceNum(this) });	

	$('#submitbutton').click(function() {
		// form validation
		var validator = $("#epayform").validate({
			rules: formRules
		});
		if ( $("#epayform").valid() ) {
			showBillingTerms();
		}
		else {
			validator.focusInvalid();
		}
	});	

	$('span[title]').tooltip();
	
	// make the card type match the card
	$('#UMcard').blur(function() {
		var thisCard = getCardType( $(this).val() );
		$('#payment_type').val( thisCard );
	});
	
	// hack in old switch buttons to work now validation is added
	$('#button-pay-creditcard').click(function() {
		$('#switchToCc').submit();
	});
	$('#button-pay-check').click(function() {
		$('#switchToBank').submit();
	});
	
	// fix recurring"checked on reload" display issue
	$(':checkbox:checked').removeAttr('checked');

	// recurring billing start date
	$('#recurringStartDateDisplay').datepicker({
		showOn: "button",
		dateFormat: "yymmdd",
		altField: "#recurringStartDate",
		altFormat: "yymmdd",
		minDate: 1,
		maxDate: "+1M"
	});

	// if convenience fee, UMamount is calculated from #paymentAmount and #convenienceFee and populated in #totalCharge and UMamount
	$('#paymentAmount').blur(function(){
		jQueryCurrencyFormat(this);
		calculateConvenienceFee();
	});
});

function calculateConvenienceFee() {
	alert("Overload this in client JS");
}


// helper methods - common to all
function showBillingTerms() {
	// configure overlay
	var popupMessage;
	var isRecurring = $("#UMaddcustomer").is(':checked');
	var isCc = $('input').val() ? 1 : 0;

	merchantData['paymentDate']           = $('#UMorderdate').html();
	                                     // amount                              convenience fee
	merchantData['initialChargeAmount']   = parseFloat( $('#UMamount').val() ) + (parseFloat( $('#UM02amount').val()||0) );
	merchantData['recurringChargeAmount'] = $('#UMbillamount').val();
	merchantData['recurringStartDate']    = $('#recurringStartDateDisplay').val();
	merchantData['frequency']             = $('#UMschedule option:selected').text();
	merchantData['bankName']              = $('#bankName').val();
	
	if ( isCc ) {
		// Cc payment
		var cardNumber = $('#UMcard').val();
		merchantData['ccLastFour'] = cardNumber.substr(cardNumber.length-4);
		if (isRecurring) {
			popupMessage = nano( nanoTemplates['cc_recurring'], merchantData );
		}
		else {
			popupMessage = nano( nanoTemplates['cc_single'], merchantData );
		}
	}
	else {
		// Bank payment
		merchantData['bankAccountNumber'] = $('#UMaccount').val();
		merchantData['bankRoutingNumber'] = $('#UMrouting').val();
		if (isRecurring) {
			popupMessage = nano( nanoTemplates['bank_recurring'], merchantData );
		}
		else {
			popupMessage = nano( nanoTemplates['bank_single'], merchantData );
		}
	}

	popupMessage = popupMessage + "<p>You may <a href='javascript:printTerms()'>print this information</a> for your records.</p>";
	$('#billing-terms-text').html(popupMessage);

	$( "#billing-terms-text" ).dialog({
		resizable: false,
		width: 600,
		modal: true,
		buttons: {
			"Cancel": function() {
				$( this ).dialog( "close" );
			},
			"Proceed": function() {
				$( this ).dialog( "close" );
				$('#submitbutton')
					.html('Please Wait... Processing')
					.attr('disabled','disabled');
				$('#epayform').submit();
			}
		}
	});
	
}

function getCardType(number) {
	var re = new RegExp("^4");
	if (number.match(re) != null) {
		return "Visa";
	}
	
	re = new RegExp("^5[1-5][0-9]{14}");
	if (number.match(re) != null) {
		return "MasterCard";
	}
	
	re = new RegExp("^6(?:011|5[0-9]{2})[0-9]{12}");
	if (number.match(re) != null) {
		return "Discover";
	}
	
	re = new RegExp("^3[47][0-9]{13}");
	if (number.match(re) != null) {
		return "American Express";
	}
	
	return "";
}

function jQueryCurrencyFormat(fieldObj) {
	jQueryForceNum(fieldObj);
	var amount = new Number( $(fieldObj).val() );
	$(fieldObj).val( amount.toFixed(2) );
}

function jQueryForceNum(fieldObj) {
	var value= $(fieldObj).val().replace(/[^\d\.]/g, '');
	$(fieldObj).val(value);
}

function printTerms() {
	$('#billing-terms-text').printElement();
}

function isRecurringPayment() {
	return $('#UMaddcustomer').attr('checked') ? 1 : 0
}

function isCreditCardPayment() {
	return $('input[name=paybycredit]').val() ? 1 : 0
}

function isBankPayment() {
	return $('input[name=paybycheck]').val() ? 1 : 0
}

function isValidCurrency(fieldAmount) {
	fieldAmount
}


/* add regex rule to validator plugin */
$.validator.addMethod(
        "regex",
        function(value, element, regexp) {
			// console.log( "Validate! " + value + " = " + regexp );
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
);

/* warn of expired/insecure browsers */
var $buoop = {
  reminder: 24,
  text: "Your browser is out of date and may contain security vulnerabilities. We recommend you update to the latest release."
}; 
$buoop.ol = window.onload; 
window.onload=function(){ 
 try {if ($buoop.ol) $buoop.ol();}catch (e) {} 
 var e = document.createElement("script"); 
 e.setAttribute("type", "text/javascript"); 
 e.setAttribute("src", "//browser-update.org/update.js"); 
 document.body.appendChild(e);
} 
