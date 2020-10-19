import theData from "./data.json";

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

var dayFormat = d3.time.format("%d");
var numFormatLg = d3.format(",s");
var numFormat = d3.format(",");
var monthName = d3.format("%B");
var monthFormat = d3.time.format("%m");
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

window.loadData = function (json) {
  // var data = JSON.parse(json);

  var data = json;
  data.forEach(function (d, i) {
    // console.log(d.fieldData.CreationTimestamp)
    var theDate = d.fieldData.CreationTimestamp;
    var currDate = new Date(theDate);
    // console.log(currDate);
    d.Date = currDate;

    var y = d.Date.getFullYear();
    d.Year = y;
    d.Day = dayFormat(currDate);
    d.Month = monthFormat(currDate);
    console.log(d.Month);
  });

  var facts = crossfilter(data);

  var deptDim = facts.dimension(function (d) {
    return d.fieldData.Call_Log_Department;
  });

  var typeDim = facts.dimension(function (d) {
    return d.fieldData.Call_Log_Type;
  });
  var dateDim = facts.dimension(function (d) {
    return d.Date;
  });

  var monthDim = facts.dimension(function (d) {
    return d.Month;
  });
  var typeGroup = typeDim.group().reduceCount(function (d) {
    return d.Call_Log_Type;
  });
  var typeGroupFiltered = remove_empty_bins(typeGroup);
  var monthGroupByYear = monthDim
    .group()
    .reduce(reducePeriodAdd, reducePeriodRemove, reducePeriodInitial);

  // var yearPrev = yearCurrent - 1;

  function reducePeriodAdd(i, d) {
    if (d.Year === 2020) {
      ++i.current;
    } else {
      ++i.previous;
    }
    return i;
  }
  function reducePeriodRemove(i, d) {
    if (d.Year === 2020) {
      --i.current;
    } else {
      --i.previous;
    }
    return i;
  }

  function reducePeriodInitial(i, d) {
    return {
      current: 0,
      previous: 0,
    };
  }
  // print_filter(monthGroupByYear);
  window.overviewComposite = dc.compositeChart("#overview");
  window.overviewCurrent = dc.lineChart(overviewComposite);
  window.overviewPrevious = dc.lineChart(overviewComposite);
  window.chartCallsByType = dc.rowChart("#chartCallsByType");

  overviewCurrent
    .colors("red")
    .group(monthGroupByYear, "Current")
    .valueAccessor(function (d) {
      return d.value.current;
    });

  overviewPrevious
    .colors("blue")
    .interpolate(d3.curveStep)
    .dashStyle([2, 2])
    .group(monthGroupByYear, "Previous")
    .valueAccessor(function (d) {
      return d.value.previous;
    })
    .title(function (d) {
      return d.value.previous;
    });

  overviewComposite
    .height(350)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .dimension(monthDim)
    .group(monthGroupByYear)
    .elasticX(true)
    .elasticY(true)
    ._rangeBandPadding(1)
    .brushOn(false)
    .compose([overviewCurrent, overviewPrevious]);

  chartCallsByType.dimension(typeDim).group(typeGroupFiltered).height(400);

  // overviewComposite.xAxis().tickFormat(d3.time.format("%B"));

  dc.renderAll();

  // document.getElementById("showPrev").onclick = addPrevious;
};

window.loadData(theData);
