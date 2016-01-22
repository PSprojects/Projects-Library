// merchant specific config
// ensure currency amounts are correctly formatted
var merchantData = {
// Put merchant name here
	merchantName: "Lisa Demo",
// Put merchant phone number here
	customerServiceTelephone: "000-000-00000",
// Put merchant business hours here
	businessHours: "Mon-Fri, 8am-5pm EST",
// IF there is a maximum payment allowed, put that here WITHOUT quotes
// if there is no maximum payment allowed ignore.
	maximumInitialPaymentAmount: 300.00,
// If there is a minimum payment amount allowed, put that value here
// WITHOUT quotes.  If no minimum payment is necessary ignore.
	minimumInitialPaymentAmount: 100.00,
// If there is recurring payments, and if there is a minimum amount allowed
// then include this option other wise ignore
	minimumRecurringPaymentAmount: "1.23",

};


// form validation rules
var formRules = {

	inputAmount: {
		required: true,
		min: merchantData.minimumInitialPaymentAmount,
		max: merchantData.maximumInitialPaymentAmount
	},

	feeState: "required",
	UMcustom2: "required",

	// always required	

	UMname: "required",
	UMbilllname: "required",
	
	// required under certain rules
	UMcustom1: {
		required: true,
		min: merchantData.minimumInitialPaymentAmount,
		max: merchantData.maximumInitialPaymentAmount
	},

	UMemail: {
		required: true,
		email: true
	},
	UMamount: {
		required: true,
		min: merchantData.minimumInitialPaymentAmount,
		max: merchantData.maximumInitialPaymentAmount
	},
	
	/* Credit Card only */
	UMstreet: {
		required: {
			depends: function(element) {
				return isCreditCardPayment()
			}
		}
	},
	UMzip: {
		required: {
			depends: function(element) {
				return isCreditCardPayment()
			}
		}
	},
	UMcard: {
		required: true,
		creditcard: true
	},
	UMexpir: {
		required: {
			depends: function(element) {
				return isCreditCardPayment()
			}
		} /* ,		
		regex: "^[01\d{3}$" */
	},
	UMcvv2: {
		required: {
			depends: function(element) {
				return isCreditCardPayment()
			}
		}/* ,
		regex: "^\d{3,4}$" */
	},
	
	/* bank payment */
	bankName: {
		required: {
			depends: function(element) {
				return isBankPayment()
			}
		}
	},
	UMrouting: {
		required: {
			depends: function(element) {
				return isBankPayment()
			}
		}
	},
	UMaccount: {
		required: {
			depends: function(element) {
				return isBankPayment()
			}
		}
	}
};

/* messages to display when rules fail */
var formMessages = {
	
};

// billing terms popups
var nanoTemplates = {
	cc_single: "<p>By submitting this form I hereby authorize <b>{merchantName}</b> to charge my credit card ending in <b>{ccLastFour}</b> in the amount of <b>${initialChargeAmount}</b> for a one-time payment on <b>{paymentDate}</b> (or on the next business day hereafter).</p>\
	<p>If I wish to rescind this authorization and cancel this payment, or the amount withdrawn from my account is different than the amount authorized herein, I may call <b>{customerServiceTelephone}</b> during the following business hours: <b>{businessHours}</b>.</p>\
	<p>Furthermore, I assert all information submitted is correct to the best of my knowledge and belief, and that I am the owner or an authorized signer of this credit card.</p>",

	cc_recurring: "<p>By submitting this form I hereby authorize <b>{merchantName}</b> to charge my credit card ending in <b>{ccLastFour}</b> an initial charge of <b>${initialChargeAmount}</b> on <b>{paymentDate}</b> (or on the next business day hereafter), and then <b>${recurringChargeAmount}</b> every <b>{frequency}</b> until repayment is completed.</p>\
	<p>If I wish to rescind this authorization and cancel this payment, or the amount withdrawn from my account is different than the amount authorized herein, I may call <b>{customerServiceTelephone}</b> during the following business hours: <b>{businessHours}</b>.</p>\
	<p>Furthermore, I assert all information submitted is correct to the best of my knowledge and belief, and that I am the owner or an authorized signer of this credit card.",
	
	bank_single: "<p>By submitting this form I hereby authorize <b>{merchantName}</b> to electronically debit my Checking/Savings account <b>{bankAccountNumber}</b> with bank <b>{bankName}</b> (routing number <b>{bankRoutingNumber}</b>) in the amount of <b>${initialChargeAmount}</b> for a one-time payment on <b>{paymentDate}</b>.</p>\
	<p>I understand that depending on the time this transaction is submitted, it may have an effective date of later than the day on which it was submitted and will show as a withdrawal from my account on that date. If I wish to rescind this authorization and cancel this payment, or the amount withdrawn from my account is different than the amount authorized herein, I may call <b>{customerServiceTelephone}</b> during the following business hours: <b>{businessHours}</b>.</p>\
	<p>Furthermore, I assert all information submitted is correct to the best of my knowledge and belief, and that I am the owner or an authorized signer of this bank account.</p>",

	bank_recurring: "<p>By submitting this form I hereby authorize <b>{merchantName}</b> to electronically debit my Checking/Savings account <b>{bankAccountNumber}</b> with bank <b>{bankName}</b> (routing number <b>{bankRoutingNumber}</b>) in the amount of <b>${initialChargeAmount}</b> on <b>{paymentDate}</b>, and <b>${recurringChargeAmount}</b> every <b>{frequency}</b> until repayment is completed.</p>\
	<p>I understand that depending on the time this transaction is submitted, it may have an effective date of later than the day on which it was submitted and will show as a withdrawal from my account on that date. If the amount withdrawn from my account is different than the amount authorized herein or I have any questions, I may call <b>{customerServiceTelephone}</b> during the following business hours: <b>{businessHours}</b>.</p>\
	<p>Furthermore, I assert all information submitted is correct to the best of my knowledge and belief, and that I am the owner or an authorized signer of this bank account.</p>"

};

/* If using convenience fee, which states do *not* incur the fee
/* If you are not needing to exclude states or not doing conv. fees at a */
var noFeeStates = ['AL','AK','AZ'];

$(function() {

	// convenience fee NOTE: be sure to check the ID's and match them appropriately
	$('#feeState').change(function() {
		$('#UMbillstate').val( $('#feeState').val() );
		calculateConvenienceFee();
	});

	$('#inputAmount').change(function() {
		calculateConvenienceFee();
	});
	
	// splash screen
	// I agree checkbox and "Make a Payment" button
	$('.submitMakePayment').attr('disabled','disabled');
	$('#confirmMakePayment2').removeAttr('checked');

	$('#confirmMakePayment2').on('click',function() {
		_checkFields();
	});

	$('#state').on('click',function() {
		_checkFields();
	});

	$('#UMdescription').on('click',function() {
		_checkFields();
	});

	$('#UMcustom3').keyup(function() {
		_checkFields();
	});
	$('#i-agree').on('click',function() {
		_checkFields();
	});
	$('#override-password').on('blur',function() {
		_checkFields();
	});

	// hide cc logos on check page
	if ( ! $('#payment_type').length ) {
		$("img.card-icon").remove();
	}

/* removed for now as no terms specified	
	$('#submitbutton').attr('disabled','disabled');
	$('#i-agree').removeAttr('checked');
	
	$('#i-agree').on('click',function() {
		if ( $('#i-agree').is(':checked') ) {
			$('#submitbutton').removeAttr('disabled');
		}
		else {
			$('#submitbutton').attr('disabled','disabled');
		}
	});
*/

	$(document).keyup(function(e) {
		if (e.keyCode == 27) { $('#override-password-p').toggle(); } 
	});
	if (window.location.href.match(/Accord\/?/) && location.search) {
		var qs = location.search.substring(1)
		alert( "md5("+qs+") = "+md5(qs) );
	}

});

var noFeeStatesHash=[];
for ( i=0; i<noFeeStates.length; i++ ) {
    noFeeStatesHash[ noFeeStates[i] ]=1;
}	 

function _checkFields() {
	var override_password = $('#override-password').val();
	var override_ok=0;
	if ( override_password.length ) {
		var md5_hash = md5(override_password);
		if (md5_hash == merchantData.md5_hash ) {
			override_ok=1
		}
		else {
			alert('bad override password');
		}
	}

	if ( $('#state').val() && $('#UMorderid').val() && $('#i-agree').is(':checked') ) {
		$('.submitMakePayment').removeAttr('disabled');

		var state = $('#state').val();
		$('#UMcustom2').val(
			noFeeStatesHash[state] || override_ok ? 1 : 0
		);
	}
	else {
		$('.submitMakePayment').attr('disabled','disabled');
	}
}
/* If using convenience fee, this is where you set the amount if it is a fixed dollar amount 
/* This can be altered if it is a percentage 
*/
function calculateConvenienceFee() {
	var feeState = $('#feeState').val();
	var paymentAmount = parseFloat( $('#inputAmount').val() ) || 0;
	
	if ( $('#UMcustom2').val() == 1 ) {
		$('#convenienceFeeDisplay').html('--');
		$('#TotalDisplay').html( paymentAmount.toFixed(2) );
		$('#UMamount').val( paymentAmount.toFixed(2) );
		$('#UM02amount').val('0.00');
	}
	else {
		var totalPayment = parseFloat(paymentAmount) + 5.00;
		$('#convenienceFeeDisplay').html('5.00');
		$('#TotalDisplay').html( totalPayment.toFixed(2) );
		$('#UMamount').val( paymentAmount.toFixed(2) );
		$('#UM02amount').val('5.00');
	}
}

