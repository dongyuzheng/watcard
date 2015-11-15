var balanceLoaded = false;
var transactionsLoaded = false;

var name = "";
var balances = [];
var flex = 0;
var mealPlan = 0;
var transactions = [];



var currentClass = "loading";




function loadOverview() {
  if (balanceLoaded){
  	changeClass("overview")
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

//loading, overview, 
function changeClass(newClass) {
	$("#popup-info").removeClass(currentClass);
	currentClass = newClass;
	$("#popup-info").addClass(currentClass);

}