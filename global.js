var balanceLoaded = false;
var transactionsLoaded = false;

var name = "";
var balances = [];
var flex = 0;
var mealPlan = 0;
var transactions = [];
var startTime, endTime;

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

// Loads the login page
function loadLogin() {
    changeClass("loading");
    $("#popup-info").load(chrome.extension.getURL("login.html"), function() {
        changeClass("login");
    })
}

// Loads the overview page
function loadOverview() {
  if (balanceLoaded){
    changeClass("loading");

    $("#popup-info").load(chrome.extension.getURL("popupContent.html"), function() {
        changeClass("overview");
        $("#user").html(name);
        $("#flex").html("$"+flex);
        $("#meal-plan").html("$"+mealPlan);
    });
  }
}

// Loads either graph page
function loadGraphs() {
    if (transactionsLoaded) {
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
        case "net":
            generateBalanceChart();
            break;
        default:
            generateIntervalData();
            break;
    }
}

function generateIntervalChart() {
    generateBasicData();

    if (dataSet.length >= 2) { // fills in empty days
        var dateOne, dateTwo;
        
        for (var i = 0; i < dataSet.length-1; i++) {
            dateOne = dataSet[i]["date"];
            dateTwo = dataSet[i+1]["date"];
            if (dateTwo - dateOne > 24 * 3600 * 1000) {
                dataSet.splice(i + 1, 0, {
                    date: dateOne + 24 * 3600 * 1000,
                    y: 0,
                    transactions: []
                });
            }
        }
    }

    dataSeries = {
        showInLegend: false,
        data: dataSet,
        pointStart: dataSet[0]["date"],
        pointInterval: 24 * 3600 * 1000
    }

    options = generateBasicOptions();
    options['chart']['type'] = 'column';
    options['title']['text'] = 'Spendings in the Past Month';
    options['yAxis']['title']['text'] = "Money Spent";
    options['plotOptions'] = {
      'column': {
        color: "#fcd905"
      }
    };
    options.series.push(dataSeries); 
    chart = new Highcharts.Chart(options)

    var sum = 0;
    for (var i = 0; i < dataSet.length; i++) {
        //console.log(dataSet[i]['y']);
        sum += dataSet[i]['y'];
    }

    $("#information").html("Average expenditure per day: $" + formatNum(sum/30));
}

function generateBalanceChart() {
    generateBasicData();
    var currentDate = new Date();
    dataSet.push({
        date: currentDate.getTime(),
        y: flex + mealPlan,
        transactions: []
    });
    for (var i = 0; i < dataSet.length; i++) {
      dataSet[i]["x"] = dataSet[i]["date"];
    }
    for (var i = dataSet.length-2; i >= 0; i--) {
      dataSet[i]["y"] += dataSet[i+1]["y"];
    }

    dataSeries = {
        showInLegend: false,
        data:dataSet,
        pointStart: dataSet[0]["date"]
        //pointInterval: 24 * 3600 * 1000
    }


    options = generateBasicOptions();
    options['chart']['type'] = 'area';
    options['title']['text'] = 'Balance Over Time';
    options['yAxis']['min'] = 0;
    options['yAxis']['title']['text'] = "Balance";
    options['plotOptions'] = {
      'area': {
        color: "#f8e779"
      }
    };
    options.series.push(dataSeries);

    chart = new Highcharts.Chart(options);

    var changeInBalance = dataSet[0]['y'] - dataSet[dataSet.length-1]['y'];
    if (changeInBalance > 0 && dataSet[dataSet.length-1]['y'] > 0) {
        var daysUntilZeroBalance = dataSet[dataSet.length - 1]['y'] / (dataSet[0]['y'] - dataSet[dataSet.length-1]['y']) * 30;
        var d = new Date(currentDate.getYear() + 1900, currentDate.getMonth(), currentDate.getDate() + Math.round(daysUntilZeroBalance));
        $("#information").html("Projected date to have zero balance: " + d.toDateString());
    }
}

function generateBasicData() {
    dataSet.push({
        date:startTime,
        y: 0,
        transactions:[]
    })
    dataSet.push({
        date:endTime,
        y: 0,
        transactions:[]
    })
  for (var i = 0; i < transactions.length; i++) { // generates dataSet from transactions
    var transaction = transactions[i];
    var date = new Date(transaction["date"]).getTime();
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
      dataSet[existingObj]["transactions"].push({location: location , amount: -1 * amount});
    } else {
      var dateObj = {
        date: date,
        y: -1 * amount,
        transactions:[{location: location, amount: -1 * amount}]
      }
      dataSet.push(dateObj);
    }
  }
  dataSet.sort(sortByDate());
}

function generateBasicOptions() {
    return options = {
        chart: {
          renderTo:'container'
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          labels: {
            step: 2,
            rotation: -45
          },
          tickInterval: 1000 * 3600 * 24,
          alternateGridColor: '#FAFAFA'
        },
        yAxis: {
          min: 0,
          labels: {
            format: "${value}"
          },
          title: {
            text: ""
          }
        },
        plotOptions: {},
        series: [],
        tooltip: {
            followPointer: true,
            hideDelay: 100,
            formatter: function() {
                var pt = this.point;
                var d = new Date(pt["date"]);
                var str= d.toDateString() + " - $" + formatNum(pt["y"]) + "<br>";
                for (var i = 0; i < pt["transactions"].length; i++) {
                    var tr = pt["transactions"][i];
                    str += tr["location"] + ": <b>$" + formatNum(tr["amount"]) + "</b><br>";
                }
            return str;
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                },
                fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                },
                stickyTracking : true
            }     
        },
        credits: {
            enabled: false
        }
    };
}

function formatNum(num) {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function sortByDate() {
    return function(a,b) {
        if (a["date"] < b["date"]){ 
            return -1;
        } 
        else if (a["date"] > b["date"]) {
            return 1;
        }
        return 0;
    }
}

//loading, overview, graphs
function changeClass(newClass) {
    $("#popup-info").removeClass(currentClass);
    currentClass = newClass;
    $("#popup-info").addClass(currentClass);
}