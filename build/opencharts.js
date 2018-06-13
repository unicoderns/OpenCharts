var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Types;
    (function (Types) {
        Types[Types["pie"] = 0] = "pie";
    })(Types = exports.Types || (exports.Types = {}));
    ;
    var VAlign;
    (function (VAlign) {
        VAlign[VAlign["top"] = 0] = "top";
        VAlign[VAlign["middle"] = 1] = "middle";
        VAlign[VAlign["bottom"] = 2] = "bottom";
    })(VAlign = exports.VAlign || (exports.VAlign = {}));
    ;
    var Align;
    (function (Align) {
        Align[Align["left"] = 0] = "left";
        Align[Align["center"] = 1] = "center";
        Align[Align["right"] = 2] = "right";
    })(Align = exports.Align || (exports.Align = {}));
    ;
    var Colors;
    (function (Colors) {
        Colors[Colors["#98abc5"] = 0] = "#98abc5";
        Colors[Colors["#8a89a6"] = 1] = "#8a89a6";
        Colors[Colors["#7b6888"] = 2] = "#7b6888";
        Colors[Colors["#6b486b"] = 3] = "#6b486b";
        Colors[Colors["#a05d56"] = 4] = "#a05d56";
        Colors[Colors["#d0743c"] = 5] = "#d0743c";
        Colors[Colors["#ff8c00"] = 6] = "#ff8c00";
    })(Colors = exports.Colors || (exports.Colors = {}));
    ;
    ;
});
define("abstract/chart", ["require", "exports", "d3"], function (require, exports, d3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Chart = (function () {
        function Chart(selector) {
            this.width = 400;
            this.height = 200;
            this.margin = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
            this.legend = {
                shapeSize: 14
            };
            this.selector = selector.replace("#", "");
            this.colors = d3.schemeCategory20c;
        }
        Chart.prototype.setSettings = function (settings) {
            if (settings !== undefined) {
                this.settings = settings;
                if (settings.width) {
                    this.width = settings.width;
                }
                if (settings.height) {
                    this.height = settings.height;
                }
            }
            else {
                console.error("Opencharts error: no data provided");
            }
        };
        Chart.prototype.createSVG = function (type) {
            var width = this.width;
            var height = this.height;
            return d3.select("#" + this.selector)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + width + " " + height)
                .classed("openchart", true)
                .classed(type, true)
                .classed("svg-content-responsive", true);
        };
        ;
        Chart.prototype.getCanvasWidth = function () {
            var width = this.width;
            var margin = this.margin;
            return width - (margin.left + margin.right);
        };
        ;
        Chart.prototype.getCanvasHeight = function () {
            var height = this.height;
            var margin = this.margin;
            return height - (margin.top + margin.bottom);
        };
        ;
        Chart.prototype.getColor = function (index) {
            return this.settings.data[index].color || this.colors[index];
        };
        ;
        return Chart;
    }());
    exports.Chart = Chart;
});
define("interfaces/IAxis", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var X;
    (function (X) {
        X[X["time"] = 0] = "time";
        X[X["string"] = 1] = "string";
    })(X = exports.X || (exports.X = {}));
});
define("interfaces/IData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("abstract/regularChart", ["require", "exports", "d3", "interfaces/IAxis", "abstract/chart"], function (require, exports, d3, IAxis, chart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegularChart = (function (_super) {
        __extends(RegularChart, _super);
        function RegularChart() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RegularChart.prototype.fillDefaults = function () {
            var main = this;
            if (main.settings.axis === undefined) {
                main.settings.axis = {};
            }
            if (main.settings.axis.x === undefined) {
                main.settings.axis.x = {};
            }
            if (main.settings.axis.x.ticks === undefined) {
                main.settings.axis.x.ticks = 10;
            }
            if (main.settings.axis.x.type === undefined) {
                main.settings.axis.x.type = IAxis.X.string;
            }
            if (main.settings.axis.x.type === "string") {
                main.settings.axis.x.type = IAxis.X.string;
            }
            if (main.settings.axis.x.type === "time") {
                main.settings.axis.x.type = IAxis.X.time;
                if (main.settings.axis.x.format === undefined) {
                    main.settings.axis.x.format = "%m/%d/%y";
                }
            }
        };
        RegularChart.prototype.getXScale = function (type, width) {
            var scale;
            var values = this.settings.data[0].values;
            var labels = [];
            if (type === IAxis.X.time) {
                scale = d3.scaleTime()
                    .domain([
                    new Date(values[0].label * 1000),
                    d3.timeDay.offset(new Date(values[values.length - 1].label * 1000), 1)
                ])
                    .range([0, width]);
            }
            else {
                values.forEach(function (item) {
                    labels.push(item.label);
                });
                scale = d3.scaleBand()
                    .domain(labels)
                    .rangeRound([0, width]);
            }
            return scale;
        };
        RegularChart.prototype.getYScale = function (height) {
            var scale;
            var values = this.settings.data[0].values;
            scale = d3.scaleLinear()
                .domain([
                d3.max(values, function (d) { return d.value; }),
                d3.min(values, function (d) { return d.value; })
            ])
                .range([0, height]);
            return scale;
        };
        return RegularChart;
    }(chart_1.Chart));
    exports.RegularChart = RegularChart;
});
define("abstract/roundChart", ["require", "exports", "abstract/chart"], function (require, exports, chart_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RoundChart = (function (_super) {
        __extends(RoundChart, _super);
        function RoundChart() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.height = 400;
            return _this;
        }
        RoundChart.prototype.createSVGLegends = function (svg) {
            var main = this;
            var calculatedLegends = [];
            var data = this.settings.data;
            var width = this.width;
            var margin = this.margin;
            var shapeSize = this.getLegendShapeSize();
            var legend = svg.selectAll(".legend")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "legend");
            legend.append("text")
                .text(function (d) { return d.label; })
                .attr("x", function (d, i) {
                var dimensions = this.getBoundingClientRect();
                console.log(dimensions.height);
                return main.getLegendX(calculatedLegends, i, dimensions.width, dimensions.height);
            })
                .attr("y", function (d, i) {
                return main.getLegendY(calculatedLegends, i);
            });
            var circleR = shapeSize / 2;
            legend.append("circle")
                .attr("r", circleR)
                .attr("fill", function (d, i) {
                return main.getColor(i);
            })
                .attr("cx", function (d, i) {
                return calculatedLegends[i].left + circleR;
            })
                .attr("cy", function (d, i) {
                return -1 * (margin.top + (calculatedLegends[i].height / 2)) + calculatedLegends[i].top + (circleR / 2);
            });
            legend.attr("transform", function (d, i) {
                var horz = margin.left;
                var vert = margin.top + calculatedLegends[i].height;
                return "translate(" + horz + "," + vert + ")";
            });
            return calculatedLegends;
        };
        ;
        RoundChart.prototype.getLegendX = function (calculatedLegends, i, legendWidth, legendHeight) {
            var width = this.width;
            var canvasWidth = this.getCanvasWidth();
            var shapeSize = this.getLegendShapeSize();
            calculatedLegends[i] = {};
            calculatedLegends[i].height = legendHeight;
            if (calculatedLegends[i - 1]) {
                var legendLeft = calculatedLegends[i - 1].left + calculatedLegends[i - 1].width + (shapeSize * 2);
                if ((legendLeft + legendWidth) <= canvasWidth) {
                    calculatedLegends[i].left = legendLeft;
                    calculatedLegends[i].top = calculatedLegends[i - 1].top || 0;
                }
                else {
                    calculatedLegends[i].left = 0;
                    calculatedLegends[i].top = calculatedLegends[i - 1].top + legendHeight;
                }
                calculatedLegends[i].width = legendWidth + shapeSize;
            }
            else {
                calculatedLegends[i].top = 0;
                calculatedLegends[i].left = 0;
                calculatedLegends[i].width = legendWidth + shapeSize;
            }
            return calculatedLegends[i].left + (shapeSize * 1.5);
        };
        ;
        RoundChart.prototype.getLegendY = function (calculatedLegends, i) {
            calculatedLegends.height = calculatedLegends[i].top + calculatedLegends[i].height;
            return calculatedLegends[i].top;
        };
        ;
        RoundChart.prototype.getLegendShapeSize = function () {
            return this.legend.shapeSize;
        };
        ;
        return RoundChart;
    }(chart_2.Chart));
    exports.RoundChart = RoundChart;
});
define("bar", ["require", "exports", "abstract/regularChart", "d3", "interfaces/IAxis"], function (require, exports, regularChart_1, d3, IAxis) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar(selector) {
            var _this = _super.call(this, selector) || this;
            _this.update = function () {
                var main = this;
                this.fillDefaults();
                var settings = main.settings;
                var data = settings.data[0];
                var axis = settings.axis;
                var width = main.getCanvasWidth();
                var height = main.getCanvasHeight();
                var values = data.values;
                var valuesLength = values.length;
                var margin = this.margin;
                var chartW = width - (margin.left + margin.right);
                var chartH = height - (margin.top + margin.bottom);
                var gap = 2;
                var barWidth = (chartW / valuesLength) - gap;
                var xScale = main.getXScale(axis.x.type, chartW);
                var yScale = main.getYScale(chartH);
                this.svg.selectAll("rect")
                    .data(values)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .delay(0)
                    .attr("fill", function (d, i) {
                    return main.getColor(0);
                })
                    .attr("x", function (d, i) {
                    return gap + i * (barWidth + gap) + margin.left;
                })
                    .attr("y", function (d) {
                    return (chartH + margin.top) - yScale(d.value);
                })
                    .attr("width", barWidth)
                    .attr("height", function (d) {
                    return yScale(d.value) || 0;
                });
            };
            _this.margin = { top: 1, right: 0, bottom: 18, left: 22 };
            return _this;
        }
        Bar.prototype.create = function () {
            var main = this;
            this.fillDefaults();
            var settings = main.settings;
            var data = settings.data[0];
            var axis = settings.axis || { x: {} };
            var width = main.getCanvasWidth();
            var height = main.getCanvasHeight();
            var values = data.values;
            var valuesLength = values.length;
            var margin = this.margin;
            var chartW = width - (margin.left + margin.right);
            var chartH = height - (margin.top + margin.bottom);
            var gap = 2;
            var barWidth = (chartW / valuesLength) - gap;
            var chartName = main.selector + "-chart";
            main.svg = main.createSVG("barchart");
            var xScale = main.getXScale(axis.x.type, chartW);
            var yScale = main.getYScale(chartH);
            this.svg.selectAll("rect")
                .data(values)
                .enter()
                .append("rect")
                .classed("bar", true)
                .classed("hover", true)
                .attr("fill", function (d, i) {
                return main.getColor(0);
            })
                .attr("x", function (d, i) {
                return gap + i * (barWidth + gap) + margin.left;
            })
                .attr("y", function (d) {
                return (chartH + margin.top) - yScale(d.value);
            })
                .attr("width", barWidth)
                .attr("height", function (d) {
                return yScale(d.value) || 0;
            });
            this.createXLegends(xScale, height);
            this.createYLegends(yScale);
        };
        ;
        Bar.prototype.createXLegends = function (xScale, height) {
            var main = this;
            var axis = main.settings.axis;
            var margin = main.margin;
            if (axis.x.type === IAxis.X.time) {
                this.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                    .call(d3.axisBottom(xScale)
                    .ticks(axis.x.ticks)
                    .tickFormat(d3.timeFormat(axis.x.format)));
            }
            else {
                this.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                    .call(d3.axisBottom(xScale)
                    .ticks(axis.x.ticks));
            }
        };
        Bar.prototype.createYLegends = function (yScale) {
            var main = this;
            var margin = main.margin;
            this.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(d3.axisLeft(yScale)
                .ticks(10));
        };
        return Bar;
    }(regularChart_1.RegularChart));
    exports.Bar = Bar;
});
define("line", ["require", "exports", "d3", "abstract/regularChart"], function (require, exports, d3, regularChart_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(selector) {
            var _this = _super.call(this, selector) || this;
            _this.update = function () {
                var main = this;
                var settings = main.settings;
                var margin = this.margin;
                var axis = settings.axis || { x: {} };
                var width = main.getCanvasWidth();
                var height = main.getCanvasHeight();
                var chartW = width - (margin.left + margin.right);
                var chartH = height - (margin.top + margin.bottom);
                var data = settings.data[0];
                var values = data.values;
                var valuesLength = values.length;
                var column = (chartW / valuesLength);
                var xScale = main.getXScale(axis.x.type, chartW);
                var yScale = main.getYScale(chartH);
                var line = d3.line()
                    .x(function (d) { return xScale(d.label) + (column / 2); })
                    .y(function (d) { return yScale(d.value) + margin.top; })
                    .curve(d3.curveMonotoneX);
                main.svg.selectAll("path.line")
                    .datum(values)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .delay(0)
                    .attr("d", line);
                main.svg.selectAll(".outer-line-dot")
                    .data(values)
                    .attr("r", 0)
                    .attr("cx", function (d) { return xScale(d.label) + (column / 2); })
                    .attr("cy", function (d) { return yScale(d.value) + margin.top; });
                main.svg.selectAll(".inner-line-dot")
                    .data(values)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .delay(0)
                    .attr("cx", function (d) { return xScale(d.label) + (column / 2); })
                    .attr("cy", function (d) { return yScale(d.value) + margin.top; });
            };
            _this.margin = { top: 8, right: 0, bottom: 18, left: 42 };
            return _this;
        }
        Line.prototype.create = function () {
            var main = this;
            var chartName = main.selector + "-chart";
            var settings = main.settings;
            var axis = settings.axis || { x: {} };
            var margin = this.margin;
            var width = main.getCanvasWidth();
            var height = main.getCanvasHeight();
            var chartW = width - (margin.left + margin.right);
            var chartH = height - (margin.top + margin.bottom);
            var data = settings.data[0];
            var values = data.values;
            var valuesLength = values.length;
            var column = (chartW / valuesLength);
            this.fillDefaults();
            main.svg = main.createSVG("linechart");
            var xScale = main.getXScale(axis.x.type, chartW);
            var yScale = main.getYScale(chartH);
            var line = d3.line()
                .x(function (d) { return xScale(d.label) + (column / 2); })
                .y(function (d) { return yScale(d.value) + margin.top; })
                .curve(d3.curveMonotoneX);
            var synchronizedMouseOver = function () {
                var arc = d3.select(this);
                var index = arc.attr("index");
                var arcSelector = "." + "outer-line-dot-" + chartName + "-dot-index-" + index;
                d3.selectAll(arcSelector).transition().duration(400).delay(0)
                    .attr("r", 12)
                    .attr("stroke", function (d, i) {
                    return main.getColor(0);
                });
            };
            var synchronizedMouseOut = function () {
                var arc = d3.select(this);
                var index = arc.attr("index");
                var arcSelector = "." + "outer-line-dot-" + chartName + "-dot-index-" + index;
                d3.selectAll(arcSelector).transition().duration(100).delay(0)
                    .attr("r", 0)
                    .attr("stroke", "#fff");
            };
            main.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                .call(d3.axisBottom(xScale));
            main.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(d3.axisLeft(yScale));
            main.svg.append("path")
                .datum(values)
                .classed("line", true)
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .attr("d", line);
            main.svg.selectAll(".dot")
                .data(values)
                .enter().append("circle")
                .attr("cx", function (d) { return xScale(d.label) + (column / 2); })
                .attr("cy", function (d) { return yScale(d.value) + margin.top; })
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .attr("class", function (d, i) {
                return "line-dot outer-line-dot outer-line-dot-" + chartName + "-dot-index-" + i;
            })
                .attr("stroke", function (d, i) {
                return main.getColor(0);
            })
                .attr("fill", "#fff")
                .attr("stroke-width", "2")
                .attr("r", 0);
            main.svg.selectAll(".dotSelected")
                .data(values)
                .enter().append("circle")
                .classed("line-dot", true)
                .classed("inner-line-dot", true)
                .attr("cx", function (d) { return xScale(d.label) + (column / 2); })
                .attr("cy", function (d) { return yScale(d.value) + margin.top; })
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .attr("index", function (d, i) { return i; })
                .attr("fill", function (d, i) {
                return main.getColor(0);
            })
                .attr("stroke", "#fff")
                .attr("stroke-width", "4")
                .attr("r", 7)
                .on("mouseover", synchronizedMouseOver)
                .on("mouseout", synchronizedMouseOut);
        };
        ;
        return Line;
    }(regularChart_2.RegularChart));
    exports.Line = Line;
});
define("pie", ["require", "exports", "d3", "abstract/roundChart"], function (require, exports, d3, roundChart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pie = (function (_super) {
        __extends(Pie, _super);
        function Pie(selector) {
            var _this = _super.call(this, selector) || this;
            _this.update = function () {
                var main = this;
                var data = main.settings.data;
                function arcTween(a) {
                    var i = d3.interpolate(this.current, a);
                    this.current = i(0);
                    return function (t) {
                        return main.arc(i(t));
                    };
                }
                main.svg.selectAll(".arc .inner-arc")
                    .data(main.pie(data))
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .delay(0)
                    .attrTween("d", arcTween);
                main.svg.selectAll(".arc .outer-arc")
                    .data(main.pie(data))
                    .attr("d", function (d) {
                    return main.outArc(d);
                });
            };
            _this.svg = _this.createSVG("piechart");
            return _this;
        }
        Pie.prototype.create = function () {
            var main = this;
            var chartName = main.selector + "-chart";
            var canvasWidth = main.getCanvasWidth();
            var canvasHeight = main.getCanvasHeight();
            var data = main.settings.data;
            var calculatedLegends = main.createSVGLegends(main.svg);
            var legendHeight = calculatedLegends.height + 10;
            canvasHeight = canvasHeight - legendHeight;
            var radius = Math.min(canvasWidth, canvasHeight) / 2;
            main.arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
            main.outArc = d3.arc().innerRadius(radius).outerRadius(radius - 6);
            main.pie = d3.pie().value(function (d) {
                return d.value;
            });
            var g = main.svg.selectAll(".arc")
                .data(main.pie(data))
                .enter()
                .append("g")
                .classed("arc", true)
                .classed("hover", true)
                .attr("transform", "translate(" + (canvasWidth / 2) + "," + (radius + legendHeight) + ")")
                .attr("index", function (d, i) { return i; })
                .attr("color", function (d, i) {
                return main.getColor(i);
            });
            g.append("path")
                .attr("class", function (d, i) {
                return "inner-arc pie-" + chartName + "-arc-index-" + i;
            })
                .attr("fill", function (d, i) {
                return main.getColor(i);
            })
                .attr("d", function (d) {
                return main.arc(d);
            })
                .each(function (d) { this.current = d; });
            g.append("path")
                .attr("class", function (d, i) {
                return "outer-arc pie-outer-arc pie-outer-" + chartName + "-arc-index-" + i;
            })
                .attr("fill", "#ffffff")
                .attr("d", function (d) {
                return main.outArc(d);
            })
                .each(function (d) { this.current = d; });
            var synchronizedMouseOver = function () {
                var arc = d3.select(this);
                var index = arc.attr("index");
                var color = arc.attr("color");
                var arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
                d3.selectAll(arcSelector)
                    .style("fill", color)
                    .classed("animate", true);
            };
            var synchronizedMouseOut = function () {
                var arc = d3.select(this);
                var index = arc.attr("index");
                var arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
                var selectedArc = d3.selectAll(arcSelector)
                    .style("fill", "#ffffff")
                    .classed("animate", false);
            };
            g.on("mouseover", synchronizedMouseOver)
                .on("mouseout", synchronizedMouseOut);
        };
        ;
        return Pie;
    }(roundChart_1.RoundChart));
    exports.Pie = Pie;
});
define("opencharts", ["require", "exports", "bar", "pie", "line"], function (require, exports, bar_1, pie_1, line_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(bar_1);
    __export(pie_1);
    __export(line_1);
});
//# sourceMappingURL=opencharts.js.map