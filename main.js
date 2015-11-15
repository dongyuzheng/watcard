function login(id,pin) {
  getBalance(id,pin);
  getSpendings(id,pin,"3/1/2014","11/11/2015");
}

$("body").on('click', '#login_button', function() {
  var id = $("#uid").val();
  var pin = $("#pin").val();
  if ($('#remember').prop('checked')) {
    chrome.storage.sync.set({login: {"uid" : id, "pin": pin}});
  }
  return login(id,pin);
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
