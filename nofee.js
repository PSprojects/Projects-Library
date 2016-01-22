// Split Fee Javascript
// States that are 'NO FEE' states are linked to a separate MID
// States that are allowed to have fees are linked to a MID that calculates Fee.
// Lisa French - Created 7/24/2015
// UPDATE - L.F. 1/19/2016

$(function() {

	$('#UMbillstate').change(function() {
		if ($('#UMbillstate').val() == 'CO' || $('#UMbillstate').val() == 'CT' || $('#UMbillstate').val() == 'ID') {
			$('#selectForm').attr('action', 'https://secure.usaepay.com/interface/epayform/[key goes here]/');
		}
		else {
			console.log($('#UMbillstate').val());
			$('#selectForm').attr('action', 'https://secure.usaepay.com/interface/epayform/[key goes here]/');
		}
	});
});