// import theData from "./data.json";

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

var typeCodes = {
  "Approve Repair": "App Rep",
  "Billing Question": "Bill Q",
  "Call for Eric": "C Eric",
  "Call for Harvey": "C Harvey",
  "Cancel Repair ": "Can Rep",
  "Cancel Service": "Can Ser",
  Complaint: "Comp",
  "Compliment - KUDDOS": "Kudos",
  "General Question": "Gen Q",
  "Question - BBQ": "Q BBQ",
  "Question - Chems": "Q Chems",
  "Question - Orders": "Q Ords",
  "Question - Pool Cleaner Repair": "Q Pool",
  "Questions - Parts": "Q Part",
  "Recent Repair Bad": "Rec Rep B",
  "Request Quote": "Req Qte",
  "Requires Action": "Req Act",
  "Schedule Repair": "Scd Rep",
  "Schedule Repair **RETAIL**": "Scd Ret",
  Scheduling: "Scd",
  Solicitor: "Sol",
  "Urgent - Const Call": "!Const Call",
  "Urgent - Sales Please Call": "!Sales Call",
};

var threeChartHeight = 400;

var dayFormat = d3.timeFormat("%d");
var numFormatLg = d3.format("~s");
var numFormat = d3.format(",");
var monthName = d3.timeFormat("%B");
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

function removeTypes_Empty(source_group) {
  return {
    all: function () {
      return source_group.all().filter(function (d) {
        return d.value === { current: {}, previous: {} };
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
  //Reduce functions
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
  function typeAdd(i, d) {
    if (d.Year === 2020) {
      i.current[d.Dept] = ++i.current[d.Dept] || 1;
    } else {
      i.previous[d.Dept] = ++i.previous[d.Dept] || 1;
    }

    return i;
  }

  function typeRemove(i, d) {
    if (d.Year === 2020) {
      i.current[d.Dept] = --i.current[d.Dept] || 0;
    } else {
      i.previous[d.Dept] = --i.previous[d.Dept] || 0;
    }

    return i;
  }
  function typeInitial(i, d) {
    return { current: {}, previous: {} };
  }

  //Set variables
  var currentYr = new Date().getFullYear();
  var previousYr = currentYr - 1;
  var currentColor = "orange";
  var previousColor = "green";
  //Configure data
  var data = JSON.parse(json);
  data.forEach(function (d, i) {
    var theDate = d.fieldData.CreationTimestamp;
    var currDate = new Date(theDate);
    d.Date = currDate;
    d.Year = d.Date.getFullYear();
    d.Type = d.fieldData.TypeCode
      ? d.fieldData.TypeCode
      : d.fieldData.Call_Log_Type;
    d.Dept = d.fieldData.Call_Log_Department;
    d.Day = dayFormat(currDate);
    d.Month = currDate.getMonth();
  });

  var facts = crossfilter(data);
  //Get unique departments
  function getUniqueDepts(value, index, self) {
    return self.indexOf(value) === index;
  }

  var depts = data
    .map(function (d) {
      return d.fieldData.Call_Log_Department;
    })
    .filter(getUniqueDepts);
  var lengthDepts = depts.length;

  //DIMENSION ****************************************
  //ALL CALLS
  var allCallsDim = facts.dimension(function (d) {
    return d.Year;
  });
  var allCallsGroup = allCallsDim.group();

  //DEPTARTMENTS
  var deptDim = facts.dimension(function (d) {
    return d.Dept;
  });
  var deptGroup = deptDim.group().reduceCount();

  //DEPT by TYPE
  var deptByTypeDim = facts.dimension(function (d) {
    return d.Type;
  });
  var deptByTypeGroup = deptByTypeDim
    .group()
    .reduce(typeAdd, typeRemove, typeInitial);

  //DEPT by PERSON
  var deptByPersonDim = facts.dimension(function (d) {
    return d.fieldData.CreatedBy;
  });
  var deptByPersonGroup = deptByPersonDim
    .group()
    .reduce(typeAdd, typeRemove, typeInitial);
  //TYPE DIMENSION
  var typeDim = facts.dimension(function (d) {
    return d.fieldData.Type;
  });
  var typeGroup = typeDim.group().reduceCount(function (d) {
    return d.Type;
  });

  //PERSON DIMENSION
  var createdByDim = facts.dimension(function (d) {
    return d.fieldData.CreatedBy;
  });
  var createdByGroup = createdByDim.group();

  var monthDim = facts.dimension(function (d) {
    return d.Month;
  });

  var monthGroup = monthDim
    .group()
    .reduce(reducePeriodAdd, reducePeriodRemove, reducePeriodInitial);

  // var yearPrev = yearCurrent - 1;

  window.chartAllCalls = dc.rowChart("#allCalls");

  window.overviewComposite = dc.compositeChart("#overview");
  window.overviewCurrent = dc.lineChart(overviewComposite);
  window.overviewPrevious = dc.lineChart(overviewComposite);
  window.chartCallsByType = dc.rowChart("#chartCallsByType");
  window.chartCallsByPerson = dc.pieChart("#chartCallsByPerson");
  window.chartCallsByDept = dc.pieChart("#chartCallsByDepartment");
  window.chartDeptByTypeTwoYears = dc.compositeChart(
    "#chartDeptByTypeTwoYears"
  );
  window.chartDeptByTypeCurrent = dc.barChart(chartDeptByTypeTwoYears);
  window.chartDeptByTypePrevious = dc.barChart(chartDeptByTypeTwoYears);

  window.chartDeptByPersonTwoYears = dc.compositeChart(
    "#chartDeptByPersonTwoYears"
  );
  window.chartDeptByPersonCurrent = dc.barChart(chartDeptByPersonTwoYears);
  window.chartDeptByPersonPrevious = dc.barChart(chartDeptByPersonTwoYears);
  var screenWidth = document.querySelector("#chartDeptByTypeTwoYears")
    .clientWidth;
  function sel_stack(i, state) {
    return function (d) {
      return d.value[state][i] || 0;
    };
  }
  var moveCurrent = 0;
  var movePrevious = 20;
  chartDeptByTypeCurrent
    // .dimension(deptByTypeDim)
    .gap(30)
    .centerBar(true)
    .elasticX(true)
    .ordinalColors(d3.schemeOranges[7])
    .on("pretransition", function (chart) {
      chart.selectAll("rect.bar").style("width", function (d) {
        return "30px";
      });
    })
    .title(function (d) {
      return (
        currentYr +
        " " +
        d.key +
        "[" +
        this.layer +
        "] " +
        d.value.current[this.layer]
      );
    })
    .group(deptByTypeGroup, depts[0], sel_stack(depts[0], "current"));

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByTypeCurrent.stack(
      deptByTypeGroup,
      "" + depts[i],
      sel_stack(depts[i], "current")
    );
  }
  chartDeptByTypePrevious
    .title(function (d) {
      return (
        previousYr +
        " " +
        d.key +
        "[" +
        this.layer +
        "] " +
        d.value.previous[this.layer]
      );
    })
    .centerBar(true)
    .colors(d3.scaleOrdinal(d3.schemeGreens[lengthDepts]))
    .elasticX(true)

    .group(deptByTypeGroup, depts[0], sel_stack(depts[0], "previous"));
  // .centerBar(true)

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByTypePrevious.stack(
      deptByTypeGroup,
      "" + depts[i],
      sel_stack(depts[i], "previous")
    );
  }
  chartDeptByTypeTwoYears
    .height(200)
    .xAxisPadding(200)
    .shareTitle(false)
    .legend(
      dc
        .legend()
        .x(screenWidth - (90 * lengthDepts + 12))
        .y(0)
        .legendWidth(90 * lengthDepts)
        .itemHeight(10)
        .itemWidth(80)
        .gap(12)
        .horizontal(true)
    )

    ._rangeBandPadding(4)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .dimension(deptByTypeDim)
    .group(deptByTypeGroup)
    .brushOn(true)
    .elasticY(true)

    .xAxisPadding(true)
    .brushOn(false)
    .compose([chartDeptByTypePrevious, chartDeptByTypeCurrent]);

  //Department by Person Composite
  chartDeptByPersonCurrent
    // .dimension(deptByPersonDim)
    .gap(30)
    .centerBar(true)
    .renderLabel(false)
    .ordinalColors(d3.schemeOranges[7])
    .on("pretransition", function (chart) {
      chart.selectAll("rect.bar").style("width", function (d) {
        return "30px";
      });
    })
    .title(function (d) {
      return (
        currentYr +
        " " +
        d.key +
        "[" +
        this.layer +
        "] " +
        d.value.current[this.layer]
      );
    })
    .group(deptByPersonGroup, depts[0], sel_stack(depts[0], "current"));
  // .centerBar(true)

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByPersonCurrent.stack(
      deptByPersonGroup,
      "" + depts[i],
      sel_stack(depts[i], "current")
    );
  }

  chartDeptByPersonPrevious

    .ordinalColors(d3.schemeGreens[lengthDepts])
    .centerBar(true)

    .title(function (d) {
      return (
        previousYr +
        " " +
        d.key +
        "[" +
        this.layer +
        "] " +
        d.value.previous[this.layer]
      );
    })
    .group(deptByPersonGroup, depts[0], sel_stack(depts[0], "previous"));
  // .centerBar(true)

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByPersonPrevious.stack(
      deptByPersonGroup,
      "" + depts[i],
      sel_stack(depts[i], "previous")
    );
  }
  chartDeptByPersonTwoYears
    .height(200)
    .shareTitle(false)
    .legend(
      dc
        .legend()
        .x(screenWidth - (90 * lengthDepts + 20))
        .y(0)
        .legendWidth(90 * lengthDepts)
        .itemHeight(10)
        .itemWidth(80)
        .gap(20)
        .horizontal(true)
    )
    ._rangeBandPadding(4)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)

    .dimension(deptByPersonDim)
    .group(deptByPersonGroup)
    .brushOn(true)
    .elasticY(true)

    .xAxisPadding(true)
    .brushOn(false)
    .compose([chartDeptByPersonPrevious, chartDeptByPersonCurrent]);

  overviewCurrent
    .colors(currentColor)
    .group(monthGroup, "" + currentYr)
    .curve(d3.curveMonotoneX)
    .renderLabel(false)
    .valueAccessor(function (d) {
      return d.value.current;
    });

  overviewPrevious
    .colors(previousColor)
    .curve(d3.curveMonotoneX)
    .renderLabel(false)
    .group(monthGroup, "" + previousYr)
    .valueAccessor(function (d) {
      return d.value.previous;
    });

  overviewComposite
    .height(150)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .x(d3.scaleOrdinal())
    .xUnits(dc.units.ordinal)
    // .legend(dc.legend().x(50).y(20).itemHeight(20).gap(5).horizontal(true))
    .dimension(monthDim)
    .group(monthGroup)
    .elasticX(true)
    .elasticY(true)
    ._rangeBandPadding(1)
    .brushOn(false)
    .title(function (d) {
      var obj =
        currentYr +
        ": " +
        d.value.current +
        "\n" +
        previousYr +
        ": " +
        d.value.previous;
      return obj;
    })
    .compose([overviewCurrent, overviewPrevious]);

  chartCallsByType
    .dimension(typeDim)
    .renderLabel(true)
    .elasticX(true)
    .group(typeGroup)
    .height(threeChartHeight)
    .x(d3.scaleOrdinal());

  chartAllCalls
    .dimension(allCallsDim)
    .ordinalColors([previousColor, currentColor])
    .legend(dc.legend().x(50).y(20).itemHeight(20).gap(5).horizontal(true))
    .fixedBarHeight(25)
    .renderLabel(true)
    .elasticX(true)
    .group(allCallsGroup)
    .height(125)
    .x(d3.scaleOrdinal());

  chartCallsByPerson
    .dimension(createdByDim)
    .group(createdByGroup)
    .innerRadius(50)
    .height(200)
    .slicesCap(5)
    .ordinalColors(d3.schemePaired)
    .legend(
      dc.legend().legendText(function (d) {
        return d.name + " || " + numFormat(d.data);
      })
    )
    .title(function (d) {
      return numFormat(d.value);
    })
    .on("pretransition", function (chart) {
      chart.selectAll("text.pie-slice").text(function (d) {
        var a = d.data.key;
        var v = d.data.value;
        // var label = a ? "Canceled" : "Not Canceled";
        return dc.utils.printSingleValue(
          d3.format(".0%")((d.endAngle - d.startAngle) / (2 * Math.PI))
        );
      });
    });

  chartCallsByDept
    .dimension(deptDim)
    .group(deptGroup)
    .innerRadius(50)
    .height(200)
    .title(function (d) {
      return numFormat(d.value);
    })
    .slicesCap(5)
    .ordinalColors(d3.schemeTableau10)
    .legend(
      dc.legend().legendText(function (d) {
        return d.name + " || " + numFormat(d.data);
      })
    )
    .on("pretransition", function (chart) {
      chart.selectAll("text.pie-slice").text(function (d) {
        var a = d.data.key;
        var v = d.data.value;
        // var label = a ? "Canceled" : "Not Canceled";
        return dc.utils.printSingleValue(
          d3.format(".0%")((d.endAngle - d.startAngle) / (2 * Math.PI))
        );
      });
    });
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  overviewComposite.xAxis().tickFormat(function (m) {
    return monthNames[m];
  });
  chartDeptByPersonTwoYears.yAxis().tickFormat(function (n) {
    return numFormatLg(n);
  });
  overviewComposite.yAxis().tickFormat(function (n) {
    return numFormatLg(n);
  });
  chartDeptByTypeTwoYears.yAxis().tickFormat(function (n) {
    return numFormatLg(n);
  });
  overviewComposite.clipPadding(100);
  dc.renderAll();
};

// window.loadData(theData);
