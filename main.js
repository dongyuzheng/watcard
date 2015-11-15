function login(id,pin) {
  getBalance(id,pin);

  var date = new Date();
  var dd = date.getDate() + 1;
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();

  var today = mm+'/'+dd+'/'+yyyy;

  date.setMonth(date.getMonth() - 1);
  dd = today.getDate();
  mm = today.getMonth() + 1; //January is 0!
  yyyy = today.getFullYear();

  getSpendings(id,pin,mm+'/'+dd+'/'+yyyy,today);
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
      $("#popup-info").html(login_html);
    }
    else {
      return login(obj.login.uid,obj.login.pin);
    }
  
  });
});
