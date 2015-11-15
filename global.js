var balanceLoaded = false;
var transactionsLoaded = false;
var name = "";
var flex = 0;
var mealPlan = 0;

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

function loadPopupIfReady() {
  if (balanceLoaded && transactionsLoaded){
  	$("#popup-info").load(chrome.extension.getURL("popupContent.html"), function() {
  	  $("#user").html(name);
  	  $("#flex").html("$"+flex);
  	  $("#meal-plan").html("$"+mealPlan);

  	  $("#details").click(function() {
  	  	alert("button pressed");
      })

      $("#logout").click(function() {
        $("#popup-info").html(login_html);
      })

    });
  }
}
