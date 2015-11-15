///////////////////////////////////////////////////////////////////////
//                             CLASSES                               //
///////////////////////////////////////////////////////////////////////

function balance(num, balType, balName, price, amount, credit) {
    this.num = num;
    this.balType = balType;
    this.balName = balName;
    this.price = Number(price);
    this.amount = Number(amount);
    this.credit = Number(credit);
}


///////////////////////////////////////////////////////////////////////
//                            FUNCTIONS                              //
///////////////////////////////////////////////////////////////////////

function getBalanceCallBack(data) {

  var re = /<B><PRE id="oneweb_account_name">(.*?),(.*\.)<\/PRE><\/B>/;  
  var m = re.exec(data);
  name = m[2].replace(/\./g, ' ')+m[1];

  re = /<TD ID="oneweb_balance_information_td_number"  ALIGN=right>(.) *<\/TD>\s*<TD ID="oneweb_balance_information_td_type"  ALIGN=left> (.*?)<\/TD>\s*<TD ID="oneweb_balance_information_td_name"  ALIGN=left>(.*?) *<\/TD>\s*<TD ID="oneweb_balance_information_td_percent"  ALIGN=right>---- <\/TD>\s*<TD ID="oneweb_balance_information_td_price"  ALIGN=right> *(.*?)<\/TD>\s*<TD ID="oneweb_balance_information_td_amount"  ALIGN=right> *(.*?)<\/TD>\s*<TD ID="oneweb_balance_information_td_credit"  ALIGN=right> *(.*?)<\/TD>\s*<\/tr>/g;

  while (m = re.exec(data)) {
    balances.push(new balance(m[1],m[2],m[3],m[4],m[5],m[6]));
  }

  for (var i = 0; i < 3; i++) {
  	mealPlan += balances[i]["amount"];
  }
  for (var i = 3; i < 6; i++) {
  	flex += balances[i]["amount"];
  }

  balanceLoaded = true;
  loadOverview();
}

function getBalance(id,pin) {

  $.ajax({
      url : "https://account.watcard.uwaterloo.ca/watgopher661.asp",
      type: "POST",
      data : {
        acnt_1: id,
        acnt_2: pin,
        FINDATAREP: "ON",
        MESSAGEREP: "ON",
        STATUS: "STATUS",
        watgopher_title: "WatCard Account Status",
        watgopher_regex: "/<hr>([\s\S]*)<hr>/;",
        watgopher_style: "onecard_regular"
      },
      success: function(data, textStatus, jqXHR)
      {
        getBalanceCallBack(data);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
  });

}