function getMonthBack(d) {
  return new Date(d.getTime() - 30 * 24 * 60 * 60 * 1000);
}

function login(id,pin) {
  getBalance(id,pin);

  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  endTime = Date.parse(mm+"/"+dd+"/"+yyyy);
  var today = mm+'/'+dd+'/'+yyyy;

  date = getMonthBack(date);
  dd = date.getDate();
  mm = date.getMonth() + 1; //January is 0!
  yyyy = date.getFullYear();
  startTime = Date.parse(mm+"/"+dd+"/"+yyyy);

  getSpendings(id,pin,mm+'/'+dd+'/'+yyyy,today);
}


function performLogin() {
  var id = $("#uid").val();
  var pin = $("#pin").val();
  if (id.length != 8 || pin.length < 4 || pin.length > 6) {
    return;
  }
  if ($('#remember').prop('checked')) {
    chrome.storage.sync.set({login: {"uid" : id, "pin": pin}});
  }
  return login(id,pin);
}

$("body").on('click', '#login_button', function() {
  performLogin();
});

$("body").on('click', '#back_button', function() {
  loadOverview();
});

$("body").on('keypress', '#uid,#pin,#remember', function(e) {
  if(e.which == 13) {
      performLogin();;
  }
});

$("body").on('click', '#daily_spending_button', function(){
	currentGraph = "interval";
	loadGraphs();
});

$("body").on('click', '#balance_over_time_button', function() {
	currentGraph = "net";
	loadGraphs();
})

$("body").on('click', '#logout_button', function(){
	chrome.storage.sync.clear();
    resetVariables();
    loadLogin();
});


$(document).ready(function() {
  currentClass = "loading";

  chrome.storage.sync.get("login", function(obj) {
   
    var id, pin;

    if (obj.login == null) {
      loadLogin();
    }
    else {
      return login(obj.login.uid,obj.login.pin);
    }
  
  });
});
