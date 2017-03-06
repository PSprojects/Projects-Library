// merchant specific config
// ensure currency amounts are correctly formatted
var merchantData = {
	merchantName: "Collection Systems International, Inc.",
	customerServiceTelephone: "817-496-6500",
	businessHours: "Monday - Friday  8:00 AM - 5:00 PM",
	minimumInitialPaymentAmount: 0.00,
	minimumRecurringPaymentAmount: "1.23",
};

// form validation rules
var formRules = {
	// always required

	UMname: "required",
	UMcustid: "required",
	UMbillphone: "required",
	UMcustid: "required",
	

	// required under certain rules
	UMamount: {
		required: {
			depends: function(element) {
				// required only if non-recurring
				return ! isRecurringPayment()
			}
		},
		// TODO - what is the minimum payment amount?
		min: function(element) { 
			return $('#UMaddcustomer').attr('checked')
			       ? 0
				   : new Number(merchantData.minimumInitialPaymentAmount)
		}
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
		} /*,
		regex: "^\d{9}$" */
	},
	UMaccount: {
		required: {
			depends: function(element) {
				return isBankPayment()
			}
		} /*,
		regex: "^\w{1,17}" */
	}/* ,
	UMssn: {
		regex: "^(\d{9}|\s*)$"
	} */
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
$(function() {
	
	// Change all "names" to be id's for ease of use.
	// this might need to go away if there are any ID collisions
	$("#epayform input, #epayform select").each(function() {
		if(!$(this).attr('id')) {
			$(this).attr('id', $(this).attr('name'));
		}
	})
	// splash screen
	// I agree checkbox, Creditor select and "Make a Payment" button
	$('.submitMakePayment').attr('disabled','disabled');
	$('#confirmMakePayment').removeAttr('checked');

	$('#confirmMakePayment').on('click',function() {
		_checkFields();
	});
});
function _checkFields() {
	if ( $('#confirmMakePayment').is(':checked') ) {
		$('.submitMakePayment').removeAttr('disabled');
	}
	else {
		$('.submitMakePayment').attr('disabled','disabled');
	}
}
