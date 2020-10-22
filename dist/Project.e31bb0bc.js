// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
// import theData from "./data.json";
function print_filter(filter) {
  var f = eval(filter);

  if (typeof f.length != "undefined") {} else {}

  if (typeof f.top != "undefined") {
    f = f.top(Infinity);
  } else {}

  if (typeof f.dimension != "undefined") {
    f = f.dimension(function (d) {
      return "";
    }).top(Infinity);
  } else {}

  console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
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
  "Urgent - Sales Please Call": "!Sales Call"
};
var threeChartHeight = 400;
var dayFormat = d3.timeFormat("%d");
var numFormatLg = d3.format("~s");
var numFormat = d3.format(",");
var monthName = d3.timeFormat("%B");
var monthFormat = d3.timeFormat("%m");

function remove_empty_bins(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    }
  };
}

function removeTypes_Empty(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value === {
          current: {},
          previous: {}
        };
      });
    }
  };
}

function setIntoYears(sourceGroup) {
  return {
    all: function all() {
      return sourceGroup.all().filter;
    }
  };
}

window.loadData = function (json) {
  //Reduce functions
  function reducePeriodAdd(i, d) {
    // console.log(d.Year);
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
      previous: 0
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
    return {
      current: {},
      previous: {}
    };
  }

  function getUniqueDepts(value, index, self) {
    return self.indexOf(value) === index;
  } //Set variables


  var currentYr = new Date().getFullYear();
  var previousYr = currentYr - 1;
  var currentColor = "orange";
  var previousColor = "green"; //Configure data

  var data = JSON.parse(json);
  data.forEach(function (d, i) {
    var theDate = d.fieldData.CreationTimestamp;
    var currDate = new Date(theDate); // console.log(currDate);

    d.Date = currDate;
    d.Year = d.Date.getFullYear();
    d.Type = typeCodes[d.fieldData.Call_Log_Type].split(" ").join("");
    d.Dept = d.fieldData.Call_Log_Department;
    d.Day = dayFormat(currDate);
    d.Month = currDate.getMonth();
  });
  var facts = crossfilter(data); //Get unique departments

  var depts = data.map(function (d) {
    return d.fieldData.Call_Log_Department;
  }).filter(getUniqueDepts);
  var lengthDepts = depts.length; //DIMENSION ****************************************
  //ALL CALLS

  var allCallsDim = facts.dimension(function (d) {
    return d.Year;
  });
  var allCallsGroup = allCallsDim.group(); //DEPTARTMENTS

  var deptDim = facts.dimension(function (d) {
    return d.Dept;
  });
  var deptGroup = deptDim.group().reduceCount(); //DEPT by TYPE

  var deptByTypeDim = facts.dimension(function (d) {
    return d.Type;
  });
  var deptByTypeGroup = deptByTypeDim.group().reduce(typeAdd, typeRemove, typeInitial); //DEPT by PERSON

  var deptByPersonDim = facts.dimension(function (d) {
    return d.fieldData.CreatedBy;
  });
  var deptByPersonGroup = deptByPersonDim.group().reduce(typeAdd, typeRemove, typeInitial); //TYPE DIMENSION

  var typeDim = facts.dimension(function (d) {
    return d.fieldData.Call_Log_Type;
  });
  var typeGroup = typeDim.group().reduceCount(function (d) {
    return d.Call_Log_Type;
  }); //PERSON DIMENSION

  var createdByDim = facts.dimension(function (d) {
    return d.fieldData.CreatedBy;
  });
  var createdByGroup = createdByDim.group();
  var monthDim = facts.dimension(function (d) {
    return d.Month;
  });
  var monthGroup = monthDim.group().reduce(reducePeriodAdd, reducePeriodRemove, reducePeriodInitial); // var yearPrev = yearCurrent - 1;

  window.chartAllCalls = dc.rowChart("#allCalls");
  window.overviewComposite = dc.compositeChart("#overview");
  window.overviewCurrent = dc.lineChart(overviewComposite);
  window.overviewPrevious = dc.lineChart(overviewComposite);
  window.chartCallsByType = dc.rowChart("#chartCallsByType");
  window.chartCallsByPerson = dc.pieChart("#chartCallsByPerson");
  window.chartCallsByDept = dc.pieChart("#chartCallsByDepartment");
  window.chartDeptByTypeTwoYears = dc.compositeChart("#chartDeptByTypeTwoYears");
  window.chartDeptByTypeCurrent = dc.barChart(chartDeptByTypeTwoYears);
  window.chartDeptByTypePrevious = dc.barChart(chartDeptByTypeTwoYears);
  window.chartDeptByPersonTwoYears = dc.compositeChart("#chartDeptByPersonTwoYears");
  window.chartDeptByPersonCurrent = dc.barChart(chartDeptByPersonTwoYears);
  window.chartDeptByPersonPrevious = dc.barChart(chartDeptByPersonTwoYears);
  console.log(document.querySelector("#chartDeptByTypeTwoYears").clientWidth);

  function sel_stack(i, state) {
    return function (d) {
      return d.value[state][i] || 0;
    };
  }

  var moveCurrent = 0;
  var movePrevious = 20;
  chartDeptByTypeCurrent // .dimension(deptByTypeDim)
  .gap(30).centerBar(true).elasticX(true).ordinalColors(d3.schemeOranges[7]).on("pretransition", function (chart) {
    chart.selectAll("rect.bar").style("width", function (d) {
      return "30px";
    });
  }).title(function (d) {
    return currentYr + " " + d.key + "[" + this.layer + "] " + d.value.current[this.layer];
  }).group(deptByTypeGroup, depts[0], sel_stack(depts[0], "current"));

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByTypeCurrent.stack(deptByTypeGroup, "" + depts[i], sel_stack(depts[i], "current"));
  }

  chartDeptByTypePrevious.title(function (d) {
    return previousYr + " " + d.key + "[" + this.layer + "] " + d.value.previous[this.layer];
  }).centerBar(true).ordinalColors(d3.schemeGreens[7]).elasticX(true).group(deptByTypeGroup, depts[0], sel_stack(depts[0], "previous")); // .centerBar(true)

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByTypePrevious.stack(deptByTypeGroup, "" + depts[i], sel_stack(depts[i], "previous"));
  }

  chartDeptByTypeTwoYears.height(200).xAxisPadding(200).shareTitle(false).legend(dc.legend().x(1000).y(0).autoItemWidth(true).itemHeight(10).itemWidth(100).gap(5).horizontal(true))._rangeBandPadding(4).x(d3.scaleBand()).xUnits(dc.units.ordinal).dimension(deptByTypeDim).group(deptByTypeGroup).brushOn(true).elasticY(true).xAxisPadding(true).brushOn(false).compose([chartDeptByTypePrevious, chartDeptByTypeCurrent]); //Department by Person Composite


  chartDeptByPersonCurrent // .dimension(deptByPersonDim)
  .gap(30).centerBar(true).renderLabel(false).ordinalColors(d3.schemeOranges[7]).on("pretransition", function (chart) {
    chart.selectAll("rect.bar").style("width", function (d) {
      return "30px";
    });
  }).title(function (d) {
    return currentYr + " " + d.key + "[" + this.layer + "] " + d.value.current[this.layer];
  }).group(deptByPersonGroup, depts[0], sel_stack(depts[0], "current")); // .centerBar(true)

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByPersonCurrent.stack(deptByPersonGroup, "" + depts[i], sel_stack(depts[i], "current"));
  }

  chartDeptByPersonPrevious.ordinalColors(d3.schemeGreens[7]).centerBar(true).title(function (d) {
    return previousYr + " " + d.key + "[" + this.layer + "] " + d.value.previous[this.layer];
  }).group(deptByPersonGroup, depts[0], sel_stack(depts[0], "previous")); // .centerBar(true)

  for (var i = 1; i < lengthDepts; ++i) {
    chartDeptByPersonPrevious.stack(deptByPersonGroup, "" + depts[i], sel_stack(depts[i], "previous"));
  }

  chartDeptByPersonTwoYears.height(200).shareTitle(false).legend(dc.legend().x(1000).y(0).autoItemWidth(true).itemHeight(10).itemWidth(100).gap(5).horizontal(true))._rangeBandPadding(4).x(d3.scaleBand()).xUnits(dc.units.ordinal).dimension(deptByPersonDim).group(deptByPersonGroup).brushOn(true).elasticY(true).xAxisPadding(true).brushOn(false).compose([chartDeptByPersonPrevious, chartDeptByPersonCurrent]);

  overviewCurrent.colors(currentColor).group(monthGroup, "" + currentYr).curve(d3.curveMonotoneX).renderLabel(false).valueAccessor(function (d) {
    return d.value.current;
  });
  overviewPrevious.colors(previousColor).curve(d3.curveMonotoneX).renderLabel(false).group(monthGroup, "" + previousYr).valueAccessor(function (d) {
    return d.value.previous;
  });

  overviewComposite.height(150).renderHorizontalGridLines(true).renderVerticalGridLines(true).x(d3.scaleOrdinal()).xUnits(dc.units.ordinal) // .legend(dc.legend().x(50).y(20).itemHeight(20).gap(5).horizontal(true))
  .dimension(monthDim).group(monthGroup).elasticX(true).elasticY(true)._rangeBandPadding(1).brushOn(false).title(function (d) {
    var obj = currentYr + ": " + d.value.current + "\n" + previousYr + ": " + d.value.previous;
    return obj;
  }).compose([overviewCurrent, overviewPrevious]);

  chartCallsByType.dimension(typeDim).renderLabel(true).elasticX(true).group(typeGroup).height(threeChartHeight).x(d3.scaleOrdinal());
  chartAllCalls.dimension(allCallsDim).ordinalColors([previousColor, currentColor]).legend(dc.legend().x(50).y(20).itemHeight(20).gap(5).horizontal(true)).fixedBarHeight(25).renderLabel(true).elasticX(true).group(allCallsGroup).height(125).x(d3.scaleOrdinal());
  chartCallsByPerson.dimension(createdByDim).group(createdByGroup).innerRadius(50).height(200).slicesCap(5).ordinalColors(d3.schemePaired).legend(dc.legend().legendText(function (d) {
    // console.log(d);
    return d.name + " || " + numFormat(d.data);
  })).title(function (d) {
    return numFormat(d.value);
  }).on("pretransition", function (chart) {
    chart.selectAll("text.pie-slice").text(function (d) {
      var a = d.data.key;
      var v = d.data.value; // var label = a ? "Canceled" : "Not Canceled";

      return dc.utils.printSingleValue(d3.format(".0%")((d.endAngle - d.startAngle) / (2 * Math.PI)));
    });
  });
  chartCallsByDept.dimension(deptDim).group(deptGroup).innerRadius(50).height(200).title(function (d) {
    return numFormat(d.value);
  }).slicesCap(5).ordinalColors(d3.schemeTableau10).legend(dc.legend().legendText(function (d) {
    // console.log(d);
    return d.name + " || " + numFormat(d.data);
  })).on("pretransition", function (chart) {
    chart.selectAll("text.pie-slice").text(function (d) {
      var a = d.data.key;
      var v = d.data.value; // var label = a ? "Canceled" : "Not Canceled";

      return dc.utils.printSingleValue(d3.format(".0%")((d.endAngle - d.startAngle) / (2 * Math.PI)));
    });
  });
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
}; // window.loadData(theData);
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61740" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/Project.e31bb0bc.js.map