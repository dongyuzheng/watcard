$(function(){
	console.log("entered onready");
	var url = "https://account.watcard.uwaterloo.ca";
	result = $.ajax({url: url})
	result.done(function(info) {
		console.log(info);
	});



})
