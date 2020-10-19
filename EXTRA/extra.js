import theData from "../data.json";

function print_filter(filter) {
    var f = eval(filter);
    if (typeof f.length != "undefined") {
    } else {
    }
    if (typeof f.top != "undefined") {
      f = f.top(Infinity);
    } else {
    }
    if (typeof f.dimension != "undefined") {
      f = f
        .dimension(function (d) {
          return "";
        })
        .top(Infinity);
    } else {
    }
    console.log(
      filter +
        "(" +
        f.length +
        ") = " +
        JSON.stringify(f)
          .replace("[", "[\n\t")
          .replace(/}\,/g, "},\n\t")
          .replace("]", "\n]")
    );
}
   var monthFormat = d3.timeFormat("%m");
function remove_empty_bins(source_group) {
  return {
    all: function () {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    },
  };
}

function setIntoYears(sourceGroup) {
  return {
    all: function () {
      return sourceGroup.all().filter;
    },
  };
}

const loadData = function (json) {;
  // var data = JSON.parse(json);
  var data = json;
  data.forEach(function (d, i) {
    // console.log(d.fieldData.CreationTimestamp)
    var theDate = d.fieldData.CreationTimestamp;
    var currDate = new Date(theDate);
    d.Date = currDate;
    d.ThisTerm = "",
    d.PrevTerm = ""
    var y = d.Date.getFullYear();
    d.Year = y;
    d.Month = monthFormat(currDate);
    console.log(d.Year);
  });

  var facts = crossfilter(data);

  
  var formatDate = d3.timeFormat("%m/%d/%y");
  var deptDim = facts.dimension(function (d) {
    return d.fieldData.Call_Log_Department;
  });

  // var yearDim = facts.dimension(function (d) {
  //   return d.Year;
  // });
  // var yearGroup = yearDim.group();

  var typeDim = facts.dimension(function (d) {
    return d.fieldData.Call_Log_Type;
  });
  var dateDim = facts.dimension(function (d) {
    return d3.timeDay(d.Date);
  });
  // var yearsGroup = dateDim.group().reduceCount(function (d) {
  //   return d.Year;
  // });
  var monthDim = facts.dimension(function (d) {
    return d.Month;
  });
//  print_filter(monthDim);

  
  var monthGroupByYear = monthDim.group().reduce(reducePeriodAdd, reducePeriodRemove, reducePeriodInitial);


  function reducePeriodAdd(i, d) {
  
if (d.Year ===2020) {++i.current} else{++i.previous}
return i
}
  function reducePeriodRemove(i,d) {
if (d.Year ===2020) {--i.current} else{--i.previous}
return i
  }

  function reducePeriodInitial(i,d) {
    return {
      current: 0,
      previous:0
}
  };

print_filter(monthGroupByYear)
  var overviewDim = facts.dimension(function (d) {
    return d3.timeDay(d.Date);
  });
  var personDim = facts.dimension(function (d) {
    return d.fieldData.CreatedBy;
  });
  var personGroup = personDim.group();
  var personGroupFiltered = remove_empty_bins(personGroup);
  var deptGroup = deptDim.group().reduceCount(function (d) {
    return d.Call_Log_Department;
  });
  var deptGroupFiltered = remove_empty_bins(deptGroup);

  var typeGroup = typeDim.group().reduceCount(function (d) {
    return d.Call_Log_Type;
  });
  var typeGroupFiltered = remove_empty_bins(typeGroup);

  var dateGroup = dateDim.group();
  var overviewGroup = overviewDim.group();
  var filteredDateGroup = remove_empty_bins(dateGroup);
  // print_filter("overviewGroup");
  window.overviewChart = new dc.LineChart("#overview");
  window.chartCountMonths = new dc.LineChart("#chartCountMonths");
  window.chartCountMonthsPrev = new dc.LineChart("#chartCountMonths");
  window.chartCallsByType = new dc.RowChart("#chartCallsByType");
  window.chartCallsByPerson = new dc.RowChart("#chartCallsByPerson");
  window.chartCallsByDepartment = new dc.PieChart("#chartCallsByDepartment");
  // window.chartMonth = new dc.BarChart("#chartMonth");
  // window.chartYear = new dc.BarChart("#chartYear");

  // chartYear
  //   .dimension(yearDim)
  //   // .yAxisLabel("This is the Y Axis!")
  //   .group(yearGroup)
  //   .height(400)
  //   .ordinalColors(["#001EBA", "#05147D", "#35459E", "#003B74", "#0B42FF"])
  //   .x(d3.scaleLinear())
  //   .clipPadding(10)
  //   .centerBar(true)
  //   .elasticY(true)
  //   .colorAccessor(function (d, i) {
  //     return i;
  //   })

  //   .elasticX(true);
  // chartMonth
  //   .dimension(monthDim)
  //   .group(monthGroup)
  //   .ordinalColors(["#001EBA", "#05147D", "#35459E", "#003B74", "#0B42FF"])
  //   .height(400)
  //   // .dotRadius(4)
  //   .x(d3.scaleLinear())
  //   .clipPadding(10)
  //   .centerBar(true)
  //   .elasticX(true)
  //   .elasticY(true)
  //   .colorAccessor(function (d, i) {
  //     return i;
  //   });
  overviewChart

    .height(100)
    .elasticX(true)
    .mouseZoomable(true)
    .brushOn(true)
    .xAxisLabel("Total Calls")
    .clipPadding(10)
    .dimension(overviewDim)
    .group(overviewGroup)
    .x(d3.scaleTime())

    .xUnits(dc.timeDays);

  chartCountMonths
    // .rangeChart(overviewChart)
    .dimension(dateDim)
    // .yAxisLabel("This is the Y Axis!")
    .group(monthGroupByYear)
     .valueAccessor(function (d) {

          return d.value.current;

     })
   
    .height(400)
    .dotRadius(4)
    .brushOn(false)
    .elasticX(true)

    .curve(d3.curveCardinal)
    // .mouseZoomable(true)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .margins({
      top: 30,
      right: 50,
      bottom: 25,
      left: 40,
    })

    .x(d3.scaleTime())
    .xUnits(dc.timeDays);

  // .seriesAccessor(function (d) {
  //     return "Expt: " + d.key[0];
  // })
  // .keyAccessor(function (d) {
  //     return +d.key[1];
  // })
  // .valueAccessor(function (d) {
  //     return +d.value - 500;
  // });

  chartCallsByType.dimension(typeDim).group(typeGroupFiltered).height(400);
  chartCallsByPerson
    .dimension(personDim)
    .group(personGroupFiltered)
    .height(400);
  chartCallsByDepartment
    .dimension(deptDim)
    .group(deptGroupFiltered)
    .innerRadius(50)
    .height(400)
    .ordinalColors(["#540045", "#C60052", "#FF714B", "#EAFF87"])
    .legend(
      dc.legend().legendText(function (d) {
        return d.name + " || " + d.data;
      })
    )

    .on("pretransition", function (chart) {
      chart.selectAll("text.pie-slice").text(function (d) {
        var a = d.data.key;
        var v = d.data.value;
        // var label = a ? "Canceled" : "Not Canceled"
        return (
          dc.utils.printSingleValue(
            ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
          ) + "%"
        );
      });
    });

  dc.renderAll();
  chartCountMonths.renderDataPoints({
    fillOpacity: 0.8,
    strokeOpacity: 0.0,
    radius: 3,
  });
  // overviewChart.yAxis().tickFormat(function (v) {
  //     return "";
  // });
  overviewChart.on("filtered", function (chart) {
    var filters = overviewChart.filters();
    if (filters.length) {
      var range = filters[0];
      console.log("range:", range[0], range[1]);
    } else console.log("no filters");
  });
};

window.filterData = function (obj) {
  var dates = JSON.parse(obj);
  var st = dates.start;
  var end = dates.end;

  overviewChart.filter(null);
  overviewChart.filter(dc.filters.RangedFilter(new Date(st), new Date(end)));
  overviewChart.x(d3.scaleTime().domain([st, end]));
  //moveChart.redraw();
  dc.redrawAll();
};

function brushed() {
  timeChart.x.domain(brush.empty() ? timeChart.x.domain() : brush.extent());
  //focus.select("timeChart.area").attr("d", area);
  //focus.select("timeChart.x.axis").call(xAxis);
}

loadData(theData);
