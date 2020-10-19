function print_filter(filter) {
    var f = eval(filter);
    if (typeof f.length != "undefined") {} else {}
    if (typeof f.top != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof f.dimension != "undefined") {
        f = f.dimension(function(d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}
var data = **Data** ;
var marginBottom = 20;
var marginBottomRot = 100;
var marginLeft = 20;
var marginTop = 20;
var chartHeightOne = 200;
var chartHeightTwo = 400;
var monthNameFormat = d3.time.format("%b");
var yearFormat = d3.time.format("%Y");
var monthFormat = d3.time.format("%m");
var fullDateFormat = d3.time.format("%m/%d");
var monYrFormat = d3.time.format("%Y %m");
var dayFormat = d3.time.format("%d");
var dayFormat = d3.time.format("%m/%d");
var dollarFormat = d3.format("$,.2f");
var percentFormat = d3.format(".0%");
var dollarFormatLarge = d3.format("$,.2s");
var dollarRoundFormat = d3.format("$,.3s");
var weekFormat = d3.format("%U");
var numFormat = d3.format(",");
var numFormatLg = d3.format(",s");
var numRoundFormat = d3.format(",.5");
var numSmallFormat = d3.format(".5");
var fullFormat = d3.time.format("%Y-%m-%d");
var daysArray = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
data.forEach(function(d, i) {
    var theDate = d.Date;
    var currDate = new Date();
    var tempDate = new Date(theDate);
    var momentDate = moment(tempDate);
    var currYear = currDate.getFullYear();
    var monFormat = monthFormat(tempDate);
    d.Date = tempDate;
    var dow = tempDate.getDay();
    d.UseDate = fullDateFormat(tempDate);
    d.Year = yearFormat(tempDate);
    d.Month = monthFormat(tempDate);
    d.All = "All";
    // var ran = Math.random();
    // console.log(ran);
    var chooseNum = Math.round(Math.random() * 50);
    var chooseNumTwo = Math.round(Math.random() * 50);
    // d.Insurance = "Company" + chooseNum;
    // d.Vendor = "Company" + chooseNum;
    // d.Duplicated = Math.random() < 0.3 ? 1 : 0;
    d.DupValidate = d.Duplicated ? "Duplicated" : "Manual";
    var weekOfDate = moment(tempDate).startOf("week");
    var useWeekOfDate = new Date(weekOfDate);
    d.weekOf = useWeekOfDate;
});
var facts = crossfilter(data);
var all = facts.groupAll();
var dataCount = dc.dataCount(".dc-data-count").dimension(facts).group(all).html({
    some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records. || <a href="javascript:dc.filterAll() ; dc.renderAll();">Reset All </a></div>',
    all: "All records selected",
});
var userDimension = facts.dimension(function(d) {
    return d.Employee;
});
var allDimension = facts.dimension(function(d) {
    return d.All;
});
var categoryDimension = facts.dimension(function(d) {
    return d.Category;
});
var currentDimension = facts.dimension(function(d) {
    return d.Current;
});
var dateDimension = facts.dimension(function(d) {
    return d.Date;
});
var monthDimension = facts.dimension(function(d) {
    return d.Month;
});
var statusDimension = facts.dimension(function(d) {
    return d.Status;
});
var statusGroup = statusDimension.group();
var vendorBilledDimension = facts.dimension(function(d) {
    return d.VendorBill;
});
var weekDimension = facts.dimension(function(d) {
    return d.weekOf;
});
var duplicatedDimension = facts.dimension(function(d) {
    return d.DupValidate;
});
var insuranceDimension = facts.dimension(function(d) {
    return d.Insurance;
});
var vendorDimension = facts.dimension(function(d) {
    return d.Vendor;
});
var yearDimension = facts.dimension(function(d) {
    return d.Year;
});
var windowWidth = window.innerWidth;
var legendPlace = windowWidth - 300;
var minDate = dateDimension.bottom(1)[0].Date;
var maxDate = dateDimension.top(1)[0].Date;
var userGroup = userDimension.group();
var allGroup = allDimension.group();
var categoryGroup = categoryDimension.group();
var currentGroup = currentDimension.group();
var stepOneGroup = allDimension.group();
var stepTwoGroup = allDimension.group();
var stepThreeGroup = allDimension.group();
var stepFourGroup = allDimension.group();
var stepFiveGroup = allDimension.group();
var allAvgGroup = allDimension.group();
var insuranceGroup = insuranceDimension.group();
var insGroup = insuranceGroup.size();
var insHeight = insGroup * 21;
print_filter("insuranceGroup");
console.log(insGroup);
// var topInsuranceGroup = insuranceGroup.top(10);
// print_filter("topInsuranceGroup");
var vendorGroup = vendorDimension.group();
// var venGroup = vendorGroup.size();
var venHeight = 500;
// var topVendorGroup = vendorGroup.top(10);
print_filter("vendorGroup");
// console.log(topVendorGroup);
var monthGroup = monthDimension.group();
var yearGroup = yearDimension.group();
var dateGroup = dateDimension.group();
// print_filter("insuranceDimension");
var dateGroupFiltered = remove_binsGen(dateGroup);
var filteredMonthGroup = remove_binsGen(monthGroup);
var filteredInsuranceGroup = remove_binsGen(insuranceGroup);
var filteredVendorGroup = remove_binsGen(vendorGroup);
var weekGroup = weekDimension.group();
var weekGroupFiltered = remove_binsGen(weekGroup);
var dateDimensionMargin = facts.dimension(function(d) {
    return d.Month;
});
var aiapGroup = dateDimensionMargin.group().reduce(reduceAddAIAP, reduceRemoveAIAP, reduceInitialAIAP);
print_filter("aiapGroup");

function reduceAddAIAP(i, d) {
    ++i.count;
    i.income += d.AmountInsurancePaid;
    i.expense += d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function reduceRemoveAIAP(i, d) {
    --i.count;
    i.income -= d.AmountInsurancePaid;
    i.expense -= d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function reduceInitialAIAP(i, d) {
    return {
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
var aiepGroup = dateDimensionMargin.group().reduce(reduceAddAIEP, reduceRemoveAIEP, reduceInitialAIEP);

function reduceAddAIEP(i, d) {
    ++i.count;
    i.income += d.AmountExpectedPay;
    i.expense += d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function reduceRemoveAIEP(i, d) {
    --i.count;
    i.income -= d.AmountExpectedPay;
    i.expense -= d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function reduceInitialAIEP(i, d) {
    return {
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
var eiapGroup = dateDimensionMargin.group().reduce(reduceAddEIAP, reduceRemoveEIAP, reduceInitialEIAP);

function reduceAddEIAP(i, d) {
    ++i.count;
    i.income += d.AmountExpectedPay;
    i.expense += d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function reduceRemoveEIAP(i, d) {
    --i.count;
    i.income -= d.AmountExpectedPay;
    i.expense -= d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function reduceInitialEIAP(i, d) {
    return {
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
// print_filter("aiepGroup")
var eiepGroup = dateDimensionMargin.group().reduce(reduceAddEIEP, reduceRemoveEIEP, reduceInitialEIEP);

function reduceAddEIEP(i, d) {
    ++i.count;
    i.income += d.AmountExpectedPay;
    i.expense += d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function reduceRemoveEIEP(i, d) {
    --i.count;
    i.income -= d.AmountExpectedPay;
    i.expense -= d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function reduceInitialEIEP(i, d) {
    return {
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
//START: Actual Income Actual Expenses
var marginAIAE = allDimension.group().reduce(addMarginAIAE, removeMarginAIAE, initialMarginAIAE);

function addMarginAIAE(i, d) {
    ++i.count;
    i.income += d.AmountInsurancePaid;
    i.expense += d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function removeMarginAIAE(i, d) {
    --i.count;
    i.income -= d.AmountInsurancePaid;
    i.expense -= d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function initialMarginAIAE(i, d) {
    return {
        count: 0,
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
var numDisplayColor = "#55024A";
dc.numberDisplay("#aiaeIncome").group(marginAIAE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.income;
});
dc.numberDisplay("#aiaeExpense").group(marginAIAE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.expense;
});
dc.numberDisplay("#aiaeMargin").group(marginAIAE).formatNumber(d3.format("%")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.margin;
});
//END: Actual Income Actual Expenses
//START: Actual Income Expected Expenses
var marginAIEE = allDimension.group().reduce(addMarginAIEE, removeMarginAIEE, initialMarginAIEE);

function addMarginAIEE(i, d) {
    ++i.count;
    i.income += d.AmountInsurancePaid;
    i.expense += d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function removeMarginAIEE(i, d) {
    --i.count;
    i.income -= d.AmountInsurancePaid;
    i.expense -= d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function initialMarginAIEE(i, d) {
    return {
        count: 0,
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
dc.numberDisplay("#aieeIncome").group(marginAIEE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.income;
});
dc.numberDisplay("#aieeExpense").group(marginAIEE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.expense;
});
dc.numberDisplay("#aieeMargin").group(marginAIEE).formatNumber(d3.format("%")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.margin;
});
//END: Actual Income Expected Expenses
//START: Expected Income Actual Expenses
var marginEIAE = allDimension.group().reduce(addMarginEIAE, removeMarginEIAE, initialMarginEIAE);

function addMarginEIAE(i, d) {
    ++i.count;
    i.income += d.AmountExpectedPay;
    i.expense += d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function removeMarginEIAE(i, d) {
    --i.count;
    i.income -= d.AmountExpectedPay;
    i.expense -= d.AmountPaidVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function initialMarginEIAE(i, d) {
    return {
        count: 0,
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
dc.numberDisplay("#eiaeIncome").group(marginEIAE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.income;
});
dc.numberDisplay("#eiaeExpense").group(marginEIAE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.expense;
});
dc.numberDisplay("#eiaeMargin").group(marginEIAE).formatNumber(d3.format("%")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.margin;
});
//END: Expected Income Actual Expenses
//START: Expected Income Expected Expenses
var marginEIEE = allDimension.group().reduce(addMarginEIEE, removeMarginEIEE, initialMarginEIEE);

function addMarginEIEE(i, d) {
    ++i.count;
    i.income += d.AmountExpectedPay;
    i.expense += d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    i.margin = i.profit / i.income;
    return i;
}

function removeMarginEIEE(i, d) {
    --i.count;
    i.income -= d.AmountExpectedPay;
    i.expense -= d.AmountToPayToVendor;
    i.profit = i.income - i.expense;
    if (i.count == 0) {
        i.margin = 0;
    } else {
        i.margin = i.profit / i.income;
    }
    return i;
}

function initialMarginEIEE(i, d) {
    return {
        count: 0,
        income: 0,
        expense: 0,
        profit: 0,
        margin: 0,
    };
}
dc.numberDisplay("#eieeIncome").group(marginEIEE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.income;
});
dc.numberDisplay("#eieeExpense").group(marginEIEE).formatNumber(d3.format("$,.2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.expense;
});
dc.numberDisplay("#eieeMargin").group(marginEIEE).formatNumber(d3.format("%")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).valueAccessor(function(d) {
    return d.value.margin;
});
//END: Expected Income Expected Expenses
var grossProfitGroup = allDimension.group().reduceSum(function(d) {
    return d.GrossProfit;
});
var netProfitGroup = allDimension.group().reduceSum(function(d) {
    return d.NetProfit;
});
var amtPayVendorGroup = allDimension.group().reduceSum(function(d) {
    return d.AmountToPayToVendor;
});
var amtExpectedPayGroup = allDimension.group().reduceSum(function(d) {
    return d.AmountExpectedPay;
});
var amtPayVendorGroupMonth = monthDimension.group().reduceSum(function(d) {
    return d.AmountToPayToVendor;
});
var duplicatedGroup = duplicatedDimension.group();
var vendorBilledGroup = vendorBilledDimension.group();

function removeIncomplete(sGroup) {
    // console.log(bins);
    return {
        all: function() {
            return source_group.all().filter(function(d) {
                return d.key == "Done";
            });
        },
    };
}

function remove_binsGen(sGroup) {
    return {
        all: function() {
            // console.log(d);
            return sGroup.all().filter(function(d) {
                return d.value != 0;
            });
        },
    };
}
var avgReducerOne = reductio().count(true).avg(function(d) {
    return d.StepOneDays;
});
var avgReducerTwo = reductio().count(true).avg(function(d) {
    return d.StepTwoDays;
});
var avgReducerThree = reductio().count(true).avg(function(d) {
    return d.StepThreeDays;
});
var avgReducerFour = reductio().count(true).avg(function(d) {
    return d.StepFourDays;
});
var avgReducerFive = reductio().count(true).avg(function(d) {
    return d.StepFiveDays;
});
var avgReducerTotal = reductio().count(true).avg(function(d) {
    return d.TotalDays;
});
avgReducerOne(stepOneGroup);
var stepOneAvg = stepOneGroup.top(Infinity)[0].value.avg;
avgReducerTwo(stepTwoGroup);
avgReducerThree(stepThreeGroup);
avgReducerFour(stepFourGroup);
avgReducerFive(stepFiveGroup);
avgReducerTotal(allAvgGroup);
var stepTwoAvg = stepTwoGroup.top(Infinity)[0].value.avg;
var stepThreeAvg = stepThreeGroup.top(Infinity)[0].value.avg;
var stepFourAvg = stepFourGroup.top(Infinity)[0].value.avg;
var stepFiveAvg = stepFiveGroup.top(Infinity)[0].value.avg;
var avgAll = allAvgGroup.top(Infinity)[0].value.avg;

function reCalc() {
    // console.log(stepOneAvg);
}
var avgOneDisplay = dc.numberDisplay("#avgStepOne").valueAccessor(function(d) {
    // console.log(d.value.avg);
    return d.value.avg;
}).formatNumber(d3.format(".2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).group(stepOneGroup);
var avgTwoDisplay = dc.numberDisplay("#avgStepTwo").valueAccessor(function(d) {
    // console.log(d.value.avg);
    return d.value.avg;
}).formatNumber(d3.format(".2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).group(stepTwoGroup);
var avgThreeDisplay = dc.numberDisplay("#avgStepThree").valueAccessor(function(d) {
    // console.log(d.value.avg);
    return d.value.avg;
}).formatNumber(d3.format(".2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).group(stepThreeGroup);
var avgFourDisplay = dc.numberDisplay("#avgStepFour").valueAccessor(function(d) {
    // console.log(d.value.avg);
    return d.value.avg;
}).formatNumber(d3.format(".2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).group(stepFourGroup);
var avgFiveDisplay = dc.numberDisplay("#avgStepFive").valueAccessor(function(d) {
    // console.log(d.value.avg);
    return d.value.avg;
}).formatNumber(d3.format(".2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).group(stepFiveGroup);
var avgAllDisplay = dc.numberDisplay("#avgStepTotal").valueAccessor(function(d) {
    // console.log(d.value.avg);
    return d.value.avg;
}).formatNumber(d3.format(".2f")).html({
    some: '<span style="color:' + numDisplayColor + '; font-size: 18px;">%number</span>',
}).group(allAvgGroup);
var colorIncome = "#1ebf02";
var colorExpense = "#bf0202";
var colorProfit = "#02acbf";
var colorMargin = "#F3A358";
var gap = 35;
var moveLeft = -7;
var moveCenter = 5;
var moveLine = 25;
var moveRight = 17;
var compWidth = 700;
var compositeAIAP = dc.compositeChart("#compositeAIAP");
var aiapIncome = dc.barChart(compositeAIAP).group(aiapGroup, "Income").gap(gap).title(function(d) {
    return dollarFormat(d.value.income);
}).colors(colorIncome).valueAccessor(function(d) {
    return d.value.income;
});
var aiapExpense = dc.barChart(compositeAIAP).group(aiapGroup, "Expense").gap(gap).title(function(d) {
    return dollarFormat(d.value.expense);
}).colors(colorExpense).valueAccessor(function(d) {
    return d.value.expense;
});
var aiapProfit = dc.barChart(compositeAIAP).group(aiapGroup, "Profit").gap(gap).title(function(d) {
    return dollarFormat(d.value.profit);
}).colors(colorProfit).valueAccessor(function(d) {
    return d.value.profit;
});
var aiapMargin = dc.lineChart(compositeAIAP).group(aiapGroup, "Margin").colors(colorMargin).title(function(d) {
    // console.log(d.value.margin)
    return percentFormat(d.value.margin);
}).useRightYAxis(true).valueAccessor(function(d) {
    return d.value.margin * 100;
});
compositeAIAP.height(300)
    // .width(compWidth)
    .shareTitle(false).margins({
        top: 30,
        right: 50,
        bottom: 25,
        left: 60,
    }).legend(dc.legend().x(40).y(0).itemHeight(13).gap(5).horizontal(true)).rightYAxisLabel("Profit Margin %").yAxisLabel("Dollars").dimension(dateDimensionMargin).group(aiapGroup).elasticY(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).compose([aiapIncome, aiapExpense, aiapProfit, aiapMargin]);
compositeAIAP.renderlet(function(chart) {
    chart.selectAll("g._3").attr("transform", "translate(" + moveLine + ", 0)");
    chart.selectAll("g._2").attr("transform", "translate(" + moveRight + ", 0)");
    chart.selectAll("g._1").attr("transform", "translate(" + moveCenter + ", 0)");
    chart.selectAll("g._0").attr("transform", "translate(" + moveLeft + ", 0)");
});
var compositeAIEP = dc.compositeChart("#compositeAIEP");
var aiepIncome = dc.barChart(compositeAIEP).group(aiepGroup, "Income").gap(gap).title(function(d) {
    // console.log(d.value.income)
    return dollarFormat(d.value.income);
}).colors(colorIncome).valueAccessor(function(d) {
    // console.log(d.value.income)
    return d.value.income;
});
var aiepExpense = dc.barChart(compositeAIEP).group(aiepGroup, "Expense").gap(gap).title(function(d) {
    return dollarFormat(d.value.expense);
}).colors(colorExpense).valueAccessor(function(d) {
    return d.value.expense;
});
var aiepProfit = dc.barChart(compositeAIEP).group(aiepGroup, "Profit").gap(gap).title(function(d) {
    return dollarFormat(d.value.profit);
}).colors(colorProfit).valueAccessor(function(d) {
    return d.value.profit;
});
var aiepMargin = dc.lineChart(compositeAIEP).group(aiepGroup, "Margin").colors(colorMargin).title(function(d) {
    // console.log(d.value.margin)
    return percentFormat(d.value.margin);
}).useRightYAxis(true).valueAccessor(function(d) {
    return d.value.margin * 100;
});
compositeAIEP.height(300)
    // .width(compWidth)
    .shareTitle(false).legend(dc.legend().x(40).y(0).itemHeight(13).gap(5).horizontal(true)).rightYAxisLabel("Profit Margin %").yAxisLabel("Dollars").dimension(dateDimensionMargin).group(aiepGroup).elasticY(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).compose([aiepIncome, aiepExpense, aiepProfit, aiepMargin]);
compositeAIEP.renderlet(function(chart) {
    chart.selectAll("g._3").attr("transform", "translate(" + moveLine + ", 0)");
    chart.selectAll("g._2").attr("transform", "translate(" + moveRight + ", 0)");
    chart.selectAll("g._1").attr("transform", "translate(" + moveCenter + ", 0)");
    chart.selectAll("g._0").attr("transform", "translate(" + moveLeft + ", 0)");
});
var compositeEIAP = dc.compositeChart("#compositeEIAP");
var eiapIncome = dc.barChart(compositeEIAP).group(eiapGroup, "Income").gap(gap).title(function(d) {
    return dollarFormat(d.value.income);
}).colors(colorIncome).valueAccessor(function(d) {
    return d.value.income;
});
var eiapExpense = dc.barChart(compositeEIAP).group(eiapGroup, "Expense").gap(gap).title(function(d) {
    return dollarFormat(d.value.expense);
}).colors(colorExpense).valueAccessor(function(d) {
    return d.value.expense;
});
var eiapProfit = dc.barChart(compositeEIAP).group(eiapGroup, "Profit").gap(gap).title(function(d) {
    return dollarFormat(d.value.profit);
}).colors(colorProfit).valueAccessor(function(d) {
    return d.value.profit;
});
var eiapMargin = dc.lineChart(compositeEIAP).group(eiapGroup, "Margin").colors(colorMargin).title(function(d) {
    // console.log(d.value.margin)
    return percentFormat(d.value.margin);
}).useRightYAxis(true).valueAccessor(function(d) {
    return d.value.margin * 100;
});
compositeEIAP.height(300)
    // .width(compWidth)
    .shareTitle(false).legend(dc.legend().x(40).y(0).itemHeight(13).gap(5).horizontal(true)).rightYAxisLabel("Profit Margin %").yAxisLabel("Dollars").dimension(dateDimensionMargin).group(eiapGroup).elasticY(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).compose([eiapIncome, eiapExpense, eiapProfit, eiapMargin]);
compositeEIAP.renderlet(function(chart) {
    chart.selectAll("g._3").attr("transform", "translate(" + moveLine + ", 0)");
    chart.selectAll("g._2").attr("transform", "translate(" + moveRight + ", 0)");
    chart.selectAll("g._1").attr("transform", "translate(" + moveCenter + ", 0)");
    chart.selectAll("g._0").attr("transform", "translate(" + moveLeft + ", 0)");
});
var compositeEIEP = dc.compositeChart("#compositeEIEP");
var eiepIncome = dc.barChart(compositeEIEP).group(eiepGroup, "Income").gap(gap).title(function(d) {
    return dollarFormat(d.value.income);
}).colors(colorIncome).valueAccessor(function(d) {
    return d.value.income;
});
var eiepExpense = dc.barChart(compositeEIEP).group(eiepGroup, "Expense").gap(gap).title(function(d) {
    return dollarFormat(d.value.expense);
}).colors(colorExpense).valueAccessor(function(d) {
    return d.value.expense;
});
var eiepProfit = dc.barChart(compositeEIEP).group(eiepGroup, "Profit").gap(gap).title(function(d) {
    return dollarFormat(d.value.profit);
}).colors(colorProfit).valueAccessor(function(d) {
    return d.value.profit;
});
var eiepMargin = dc.lineChart(compositeEIEP).group(eiepGroup, "Margin").colors(colorMargin).title(function(d) {
    // console.log(d.value.margin)
    return percentFormat(d.value.margin);
}).useRightYAxis(true).valueAccessor(function(d) {
    return d.value.margin * 100;
});
compositeEIEP.height(300)
    // .width(compWidth)
    .shareTitle(false).renderHorizontalGridLines([true]).useRightAxisGridLines(true).legend(dc.legend().x(40).y(0).itemHeight(13).gap(5).horizontal(true)).rightYAxisLabel("Profit Margin %").yAxisLabel("Dollars").dimension(dateDimensionMargin).group(eiepGroup).elasticY(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).compose([eiepIncome, eiepExpense, eiepProfit, eiepMargin]);
compositeEIEP.renderlet(function(chart) {
    chart.selectAll("g._3").attr("transform", "translate(" + moveLine + ", 0)");
    chart.selectAll("g._2").attr("transform", "translate(" + moveRight + ", 0)");
    chart.selectAll("g._1").attr("transform", "translate(" + moveCenter + ", 0)");
    chart.selectAll("g._0").attr("transform", "translate(" + moveLeft + ", 0)");
});
var color = d3.scale.linear().domain([0, 10, 30, 50, insGroup]).range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2", ]);
var insuranceCountRowChart = dc.rowChart("#insuranceCt").colors(color)
    // .fixedBarHeight(15)
    .dimension(insuranceDimension).renderLabel(true).elasticX(true).group(insuranceGroup).height(600).x(d3.scale.ordinal()).colorAccessor(function(d, i) {
        return i;
    });
var vendorCountRowChart = dc.rowChart("#vendorCt")
    // .ordinalColors(["#001EBA", "#05147D", "#35459E", "#003B74", "#0B42FF"])
    .colors(color).dimension(vendorDimension).renderLabel(true).elasticX(true).group(vendorGroup).height(600)
    // .cap(10)
    .x(d3.scale.ordinal()).colorAccessor(function(d, i) {
        return i;
    });
var totalPOsBarChart = dc.barChart("#totalPOs").renderLabel(true).elasticX(true).ordinalColors(["#001EBA", "#05147D", "#35459E", "#003B74", "#0B42FF"]).elasticY(true).height(chartHeightOne).dimension(currentDimension).group(currentGroup).renderLabel(true).title(function(d) {
    return d.key + ": " + numFormat(d.value);
}).label(function(d) {
    return numFormat(d.data.value);
}).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).elasticY(true).clipPadding(100).colorAccessor(function(d, i) {
    return i;
});
var categoryBarChart = dc.barChart("#category").renderLabel(true).renderHorizontalGridLines(true).elasticX(true).ordinalColors(["#230A59", "#3E38F2", "#0029FA", "#5C73F2", "#829FD9"]).elasticY(true).height(chartHeightOne).dimension(categoryDimension).group(categoryGroup).renderLabel(true).title(function(d) {
    return d.value;
}).label(function(d) {
    return d.data.value;
}).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).elasticY(true).clipPadding(100).colorAccessor(function(d, i) {
    return i;
});
var grossProfitBarCart = dc.barChart("#grossProfit").renderLabel(true).elasticX(true).colors("#CDECCC").elasticY(true).height(chartHeightOne).dimension(allDimension).group(grossProfitGroup).renderLabel(true).title(function(d) {
    return dollarFormat(d.value);
}).label(function(d) {
    return dollarFormat(d.data.value);
}).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).elasticY(true).clipPadding(100).colorAccessor(function(d, i) {
    return i;
});
var netProfitBarChart = dc.barChart("#netProfit").renderLabel(true).elasticX(true).colors("#EDD269").elasticY(true).height(chartHeightOne).dimension(allDimension).group(netProfitGroup).renderLabel(true).title(function(d) {
    return dollarFormat(d.value);
}).label(function(d) {
    return dollarFormat(d.data.value);
}).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).elasticY(true).clipPadding(100).colorAccessor(function(d, i) {
    return i;
});
var amtPayVendorBarChart = dc.barChart("#amtPay").renderLabel(true).elasticX(true).colors("#E88460").elasticY(true).height(chartHeightOne).dimension(allDimension).group(amtExpectedPayGroup).renderLabel(true).title(function(d) {
    return dollarFormat(d.value);
}).label(function(d) {
    return dollarFormat(d.data.value);
}).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).elasticY(true).clipPadding(100).colorAccessor(function(d, i) {
    return i;
});
var amtExpectedBarChart = dc.barChart("#amtExpected").renderLabel(true).elasticX(true).colors("#F23460").elasticY(true).height(chartHeightOne).dimension(allDimension).group(amtExpectedPayGroup).renderLabel(true).title(function(d) {
    return dollarFormat(d.value);
}).label(function(d) {
    return dollarFormat(d.data.value);
}).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).elasticY(true).clipPadding(100).colorAccessor(function(d, i) {
    return i;
});
var userBarChart = dc.barChart("#users").ordinalColors(["#230A59", "#3E38F2", "#0029FA", "#5C73F2", "#829FD9"]).dimension(userDimension).height(chartHeightOne).group(userGroup).renderLabel(true).label(function(d) {
        return d.data.value;
    }).elasticX(true).x(d3.scale.ordinal()).xUnits(dc.units.ordinal)
    // .on("filtered", function() {
    //   reCalc();
    // })
    .elasticY(true).clipPadding(100)
    // .colors(colorScale)
    .title(function(d) {
        return d.key + ": " + d.value;
    }).colorAccessor(function(d, i) {
        return i;
    });
var POStatusBarChart = dc.pieChart("#POStatus").dimension(statusDimension).group(statusGroup).innerRadius(50).height(chartHeightOne).ordinalColors(["#540045", "#C60052", "#FF714B", "#EAFF87"]).legend(dc.legend().legendText(function(d) {
    // console.log(d);
    return d.name + " || " + d.data;
})).on("pretransition", function(chart) {
    chart.selectAll("text.pie-slice").text(function(d) {
        var a = d.data.key;
        var v = d.data.value;
        // var label = a ? "Canceled" : "Not Canceled";
        return (dc.utils.printSingleValue(
            ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100) + "%");
    });
});
var vendorBilledPieChart = dc.pieChart("#vendorBilling").dimension(vendorBilledDimension).group(vendorBilledGroup).innerRadius(50).height(chartHeightOne).ordinalColors(["#8EBE94", "#827085", "#DC5B3E"]).legend(dc.legend().legendText(function(d) {
    // console.log(d);
    return d.name + " || " + d.data;
})).on("pretransition", function(chart) {
    chart.selectAll("text.pie-slice").text(function(d) {
        var a = d.data.key;
        var v = d.data.value;
        // var label = a ? "Canceled" : "Not Canceled";
        return (dc.utils.printSingleValue(
            ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100) + "%");
    });
});
var yearBarChart = dc.barChart("#year").ordinalColors(["#001EBA", "#05147D", "#35459E", "#003B74", "#0B42FF"]).dimension(yearDimension).renderLabel(true).elasticX(true).elasticY(true).colors("#35459E").group(yearGroup).clipPadding(100).height(chartHeightOne).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).colorAccessor(function(d, i) {
    return i;
});
var monthBarChart = dc.barChart("#months").ordinalColors(["#001EBA", "#05147D", "#35459E", "#003B74", "#0B42FF"]).dimension(monthDimension).renderLabel(true).elasticX(true).elasticY(true).colors("#35459E").group(filteredMonthGroup).clipPadding(100).height(chartHeightOne).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).colorAccessor(function(d, i) {
    return i;
});
var duplicatedBarChart = dc.barChart("#duplicated").ordinalColors(["#001EBA", "#05147D"]).dimension(duplicatedDimension).renderLabel(true).clipPadding(100).height(300).elasticX(true).elasticY(true).group(duplicatedGroup).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).colorAccessor(function(d, i) {
    return i;
});
var weekBarChart = dc.barChart("#weeks").dimension(weekDimension).ordinalColors(["#230A59", "#3E38F2", "#0029FA", "#5C73F2", "#829FD9"]).group(weekGroupFiltered).renderLabel(true).elasticX(true).elasticY(true).clipPadding(100).brushOn(true).height(chartHeightOne).x(d3.scale.ordinal()).xUnits(dc.units.ordinal).colorAccessor(function(d, i) {
    return i;
});
var dateBarChart = dc.barChart("#days").renderLabel(true).elasticX(true).clipPadding(100).elasticY(true).dimension(dateDimension).group(dateGroupFiltered).height(200).brushOn(false).title(function(d) {
        return fullDateFormat(d.key) + ": " + d.value;
    })
    // .centerBar(true)
    .x(d3.scale.ordinal()).xUnits(dc.units.ordinal);
// .xUnits(d3.time.day)
// .x(d3.time.scale().domain([minDate, maxDate]));
// dateBarChart.xUnits(function () {
//   return 5;
// });
dateBarChart.xAxis().ticks(5);
dateBarChart.xAxis().tickFormat(d3.time.format("%m-%d"));
weekBarChart.xAxis().tickFormat(d3.time.format("%m-%d"));
grossProfitBarCart.yAxis().tickFormat(dollarFormatLarge);
netProfitBarChart.yAxis().tickFormat(dollarFormatLarge);
// duplicatedBarChart.yAxis().tickFormat(dollarFormatLarge);
amtExpectedBarChart.yAxis().tickFormat(dollarFormatLarge);
amtPayVendorBarChart.yAxis().tickFormat(dollarFormatLarge);
totalPOsBarChart.yAxis().tickFormat(numFormatLg);
compositeAIAP.yAxis().tickFormat(numFormatLg);
compositeAIAP.margins().top = 20;
// duplicatedBarChart.margins().top = 20;
compositeAIAP.margins().left = 40;
compositeAIAP.margins().right = 80;
insuranceCountRowChart.on("pretransition", function() {
    insuranceCountRowChart.select("g.axis").attr("transform", "translate(0,-20)");
    insuranceCountRowChart.selectAll("line.grid-line").attr("y2", insuranceCountRowChart.effectiveHeight());
});
vendorCountRowChart.on("pretransition", function() {
    vendorCountRowChart.select("g.axis").attr("transform", "translate(0,-20)");
    vendorCountRowChart.selectAll("line.grid-line").attr("y2", vendorCountRowChart.effectiveHeight());
});
vendorCountRowChart.data(function(group) {
    return group.top(10);
});
insuranceCountRowChart.data(function(group) {
    return group.top(10);
});
compositeAIEP.yAxis().tickFormat(numFormatLg);
compositeAIEP.margins().top = 20;
compositeAIEP.margins().left = 40;
compositeEIAP.yAxis().tickFormat(numFormatLg);
compositeEIAP.margins().top = 20;
compositeEIAP.margins().left = 40;
compositeEIEP.yAxis().tickFormat(numFormatLg);
compositeEIEP.margins().top = 20;
compositeEIEP.margins().left = 40;
userBarChart.margins().top = 20;
weekBarChart.margins().top = 20;
categoryBarChart.margins().top = 20;
totalPOsBarChart.margins().top = 20;
grossProfitBarCart.margins().top = 20;
netProfitBarChart.margins().top = 20;
amtExpectedBarChart.margins().top = 50;
amtPayVendorBarChart.margins().top = 20;
duplicatedBarChart.margins().top = 80;
duplicatedBarChart.margins().left = 40;
amtPayVendorBarChart.margins().left = 40;
amtExpectedBarChart.margins().left = 40;
netProfitBarChart.margins().left = 40;
grossProfitBarCart.margins().left = 40;
monthBarChart.margins().top = 20;
// numberNotesBC.margins().top = 20;
dateBarChart.margins().top = 20;
dateBarChart.margins().left = 40;
yearBarChart.margins().top = 20;
dateBarChart.margins().bottom = 40;
categoryBarChart.margins().bottom = 60;
weekBarChart.margins().bottom = 40;
dc.renderAll();
var sizeHeight = 35;

function showIns() {
    var info = document.getElementById("subIns").innerHTML;
    console.log(info);
    var newGroup = insuranceDimension.group();
    console.log("Size", size);
    if (info == "Top Ten") {
        var size = newGroup.size() * sizeHeight;
        var newTop = "Infinity";
        document.getElementById("showInsurance").innerHTML = "Show Top Ten";
        document.getElementById("subIns").innerHTML = "All";
    } else {
        var newTop = 10;
        var size = 500;
        document.getElementById("showInsurance").innerHTML = "Show All";
        document.getElementById("subIns").innerHTML = "Top Ten";
    }
    insuranceCountRowChart.height(size);
    insuranceCountRowChart.data(function(g) {
        return g.top(newTop);
    });
    insuranceCountRowChart.render();
}

function showVend() {
    var info = document.getElementById("subVen").innerHTML;
    console.log(info);
    var newGroup = vendorDimension.group();
    console.log("Size", size);
    if (info == "Top Ten") {
        var size = newGroup.size() * sizeHeight;
        var newTop = "Infinity";
        document.getElementById("showVendor").innerHTML = "Show Top Ten";
        document.getElementById("subVen").innerHTML = "All";
    } else {
        var newTop = 10;
        var size = 500;
        document.getElementById("showVendor").innerHTML = "Show All";
        document.getElementById("subVen").innerHTML = "Top Ten";
    }
    vendorCountRowChart.height(size);
    vendorCountRowChart.data(function(g) {
        return g.top(newTop);
    });
    vendorCountRowChart.render();
}
var btnIns = document.getElementById("showInsurance");
btnIns.onclick = showIns;
var btnVend = document.getElementById("showVendor");
btnVend.onclick = showVend;