function login(id,pin) {
  getBalance(id,pin);

  var date = new Date();
  var dd = date.getDate() + 1;
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();

  var today = mm+'/'+dd+'/'+yyyy;

  date.setMonth(date.getMonth() - 1);
  dd = date.getDate();
  mm = date.getMonth() + 1; //January is 0!
  yyyy = date.getFullYear();

  getSpendings(id,pin,mm+'/'+dd+'/'+yyyy,today);
}


function performLogin() {
  var id = $("#uid").val();
  var pin = $("#pin").val();
  if (id.length != 8 || pin.length != 4) {
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

$("body").on('keypress', '#uid,#pin', function(e) {
  if(e.which == 13) {
      performLogin();;
  }
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
