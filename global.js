var balanceLoaded = false;
var transactionsLoaded = false;
var name = "";
var flex = 0;
var mealPlan = 0;

function loadPopupIfReady() {
  if (balanceLoaded){
  	$("#popup-info").load(chrome.extension.getURL("popupContent.html"), function() {
  	  $("#user").html(name);
  	  $("#flex").html("$"+flex);
  	  $("#meal-plan").html("$"+mealPlan);

  	  $("#details").click(function() {
  	  	alert("button pressed");
      })
    });
  }
}
