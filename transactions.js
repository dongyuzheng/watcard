///////////////////////////////////////////////////////////////////////
//                             CLASSES                               //
///////////////////////////////////////////////////////////////////////

function transaction(date, tod, amount, account, units, transtype, terminal) {
    this.date = date;
    this.tod = tod;
    this.amount = Number(amount);
    this.account = Number(account);
    this.units = Number(units);
    this.transtype = transtype;
    this.terminal = terminal;
}


///////////////////////////////////////////////////////////////////////
//                            FUNCTIONS                              //
///////////////////////////////////////////////////////////////////////

function getSpendingsCallBack(data) {
  
  if (data.indexOf("The Account or PIN code is incorrect!") > -1) {
    return loadLogin();
  }

  var m;
 
  re = /<tr><td id='oneweb_financial_history_td_date'>(\d{2}\/\d{2}\/\d{4})<\/td><td id='oneweb_financial_history_td_time'>(\d{2}:\d{2}:\d{2})<\/td><td id='oneweb_financial_history_td_amount' align='right'> *(.*?)<\/td><td id='oneweb_financial_history_td_bal'>(.)<\/td><td id='oneweb_financial_history_td_units' align='right'>(\d)<\/td><td id='oneweb_financial_history_td_trantype'>\(.*\)(.*?)<\/td><td id='oneweb_financial_history_td_terminal'>\(.*\)(.*?) *<\/td>\s*<\/tr>/g;
  
  while (m = re.exec(data)) {
    transactions.push(new transaction(m[1],m[2],m[3],m[4],m[5],m[6],m[7]));
  }

  transactionsLoaded = true;
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