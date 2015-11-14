function transaction(date, time, price, type, loc) {
    this.date = date;
    this.tod = tod;
    this.price = price;
    this.account = account;
    this.loc = loc;
}

//var myFather = new person("John", "Doe", 50, "blue");
//var myMother = new person("Sally", "Rally", 48, "green");


function getSpendingsCallBack(data) {
  console.log(data);
}

function getSpendings(id,pin,from,to) {

  $.ajax({
      url : "https://account.watcard.uwaterloo.ca/watgopher661.asp",
      type: "POST",
      data : {
        acnt_1: id,
        acnt_2: pin,
        DBDATE: from,
        DEDATE: to,
        PASS: "PASS",
        STATUS: "HIST",
        watgopher_title: "WatCard History Report",
        watgopher_regex: "<hr>([\s\S]*wrong[\s\S]*)<p></p>|(<form[\s\S]*?(</center>|</form>))|(<pre><p>[\s\S]*</pre>)",
        watgopher_style: "onecard_narrow"
      },
      success: function(data, textStatus, jqXHR)
      {
        getSpendingsCallBack(data);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
  });

}


$(document).ready(function() {

  console.log(getSpendings("20561724","1237","3/1/2014","11/11/2015"));

});