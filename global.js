var balanceLoaded = false;
var transactionsLoaded = false;

var name = "";
var balances = [];
var flex = 0;
var mealPlan = 0;
var transactions = [];

var interval = "day";
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
var dataSet = [];



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
  changeClass("loading");
  $("#popup-info").load(chrome.extension.getURL("login.html"), function() {
    changeClass("login");
  })
}

function loadOverview() {
  if (balanceLoaded){
    changeClass("loading");

  	$("#popup-info").load(chrome.extension.getURL("popupContent.html"), function() {
      changeClass("overview");
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
	  changeClass("loading");
	  $("#popup-info").load(chrome.extension.getURL("graphs.html"), function() {
      changeClass("graphs");
      generateChart();
    });
	}
}

function generateChart() {
  dataSet = [];
  switch(currentGraph) {
    case "interval":
      generateIntervalChart();
      break;
    default:
      generateIntervalData();
      break;
  }
}
function generateIntervalChart() {
  for (var i = 0; i < transactions.length; i++) { // generates dataSet from transactions
    var transaction = transactions[i];
    var date = transaction["date"];
    var amount = transaction["amount"];
    var location = transaction["terminal"];
    
    var existingObj = -1;
    for (var j = 0; j < dataSet.length; j++){
      if (dataSet[j]["date"] == date) {
        existingObj = j;
        break;
      }
    }
    if (existingObj != -1) {
      dataSet[existingObj]["y"] -= amount;
      dataSet[existingObj]["transactions"].push({location:location,amount:-1*amount});
    } else {
      var dateObj = {
        date: date,
        y:-1*amount,
        transactions:[{location:location,amount:-1*amount}]
      }
      dataSet.push(dateObj);
    }
  }

  dataSeries = {data:dataSet}
  options = generateChartOptions();
  options.series.push(dataSeries);

  chart = new Highcharts.Chart(options)
}



function generateChartOptions() {
  var options = {
    'chart': {
      'type':'column',
      'renderTo':'container'
    },
    'title': {
      'text': 'Spendings per day'
    },

   /* 'xAxis': {
      'categories': [],
      'labels' : {
        'step' : 1
      },
      'alternateGridColor': '#FAFAFA'
    },

    'yAxis': [{
      'title': {
        'text': yAxisLabel
      },
      'plotLines': []     
    },
    {
      'title' : {
        'text': yAxisLabel
      },
      'linkedTo':0,
      'opposite':true
    }],
    'legend': {
      'enabled':false
    },*/

    'series': [],
    'tooltip': {
      'followPointer':true,
      'hideDelay':100,
      'formatter':function() {
        var pt = this.point;
        var str="";
        for (var i = 0; i < pt["transactions"].length; i++) {
          var tr = pt["transactions"][i];
          str+=tr["location"] + ": $" + tr["amount"]+"\n";
        }
        return str;

      }
      /*'plotOptions': {
        'stickyTracking' : true
      }*/
    }
  };
  return options;
}









//loading, overview, graphs
function changeClass(newClass) {
	$("#popup-info").removeClass(currentClass);
	currentClass = newClass;
	$("#popup-info").addClass(currentClass);

}