var balanceLoaded = false;
var transactionsLoaded = false;

var name = "";
var balances = [];
var flex = 0;
var mealPlan = 0;
var transactions = [];


var currentClass = "loading";
/*
	"loading" : displays loading .gif
	"overview" : displays current balance
	"graphs" : displays in-depth information
*/
var currentGraph = "interval";
/*
 	"interval" : spendings per interval (day, week, month); bar graph
	"net" : total balance over time (change); area
*/
function resetVariables() {
  balanceLoaded = false;
  transactionsLoaded = false;

  name = "";
  balances = [];
  flex = 0;
  mealPlan = 0;
   transactions = [];
}

function loadLogin() {
  changeClass("login");
  $("#popup-info").load(chrome.extension.getURL("login.html"), function() {

  })
}

function loadOverview() {
  if (balanceLoaded){
  	changeClass("overview")
  	$("#popup-info").load(chrome.extension.getURL("popupContent.html"), function() {
  	  $("#user").html(name);
  	  $("#flex").html("$"+flex);
  	  $("#meal-plan").html("$"+mealPlan);

  	  $("#details").click(function() {
  	  	loadGraphs();
      })

      $("#logout").click(function() {
        chrome.storage.sync.clear();
        resetVariables();
        loadLogin();
      })

    });
  }
}

function loadGraphs() {
	if (transactionsLoaded) {
	  changeClass("");
	  $("#popup-info").load(chrome.extension.getURL("graphs.html"), function() {
    });
	}
}


//loading, overview, graphs
function changeClass(newClass) {
	$("#popup-info").removeClass(currentClass);
	currentClass = newClass;
	$("#popup-info").addClass(currentClass);

}