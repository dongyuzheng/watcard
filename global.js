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

var login_html =  '<form>' +
                    'Waterloo ID:<br>' +
                    '<input type="text" id="uid">' +
                    '<br>' +
                    'WatCard Pin:<br>' +
                    '<input type="password" id="pin"><br>' +
                    '<input type="checkbox" id="remember">Remember me' +
                    '<br><br>' +
                  '</form>' +
                  '<button id="login_button" type="button">Login</button>';

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
        $("#popup-info").html(login_html);
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