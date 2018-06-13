////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2015  Christopher Mejía Montoya - me@chrissmejia.com - chrissmejia.com   //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////


import { RegularChart } from "./abstract/regularChart";
import * as d3 from "d3";
import * as IAxis from "./interfaces/IAxis";

import IData from "./interfaces/IData";

export class Bar extends RegularChart {

    protected svg: d3.Selection<SVGElement, {}, HTMLElement, any>;
    protected bar;

    // ------------------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------------------
    constructor(selector) {
        super(selector);
        this.margin = { top: 1, right: 0, bottom: 18, left: 22 };
    }

    // ==========================================================================================
    // Create bar chart
    // ==========================================================================================
    public create() {
        // Main OpenCharts object
        let main: Bar = this;

        // Filling missing data
        this.fillDefaults();

        let settings = main.settings;
        let data = settings.data[0];
        let axis = settings.axis || { x: {} };
        let width = main.getCanvasWidth();
        let height = main.getCanvasHeight();

        // Configuration lets
        let values = data.values;
        let valuesLength = values.length;

        let margin = this.margin;
        let chartW = width - (margin.left + margin.right);
        let chartH = height - (margin.top + margin.bottom);
        let gap = 2;

        let barWidth = (chartW / valuesLength) - gap;

        let chartName = main.selector + "-chart";

        main.svg = main.createSVG("barchart");

        let xScale = main.getXScale(axis.x.type, chartW);
        let yScale = main.getYScale(chartH);

        // Filling SVG with data
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
            .attr("y", function (d: IData) {
                return (chartH + margin.top) - yScale(d.value);  // Height minus data value
            })
            .attr("width", barWidth)
            .attr("height", function (d: IData) {
                return yScale(d.value) || 0;
            });

        this.createXLegends(xScale, height);
        this.createYLegends(yScale);
    };

    // ==========================================================================================
    // Create legend for X Axis
    // ==========================================================================================
    public createXLegends(xScale, height) {
        let main: Bar = this;
        let axis = main.settings.axis;
        let margin = main.margin;

        if (axis.x.type === IAxis.X.time) {
            // Create X axis
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                .call(d3.axisBottom(xScale)
                    .ticks(axis.x.ticks)
                    .tickFormat(d3.timeFormat(axis.x.format))
                );
        } else {
            // Create X axis
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                .call(d3.axisBottom(xScale)
                    .ticks(axis.x.ticks)
                );
        }
    }

    // ==========================================================================================
    // Create legend for Y Axis
    // ==========================================================================================
    public createYLegends(yScale) {
        let main: Bar = this;
        let margin = main.margin;
        // Create Y axis
        this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(d3.axisLeft(yScale)
                .ticks(10)
            );
    }

    public update = function () {
        // Main OpenCharts object
        let main: Bar = this;

        this.fillDefaults();

        let settings = main.settings;
        let data = settings.data[0];

        let axis = settings.axis;

        let width = main.getCanvasWidth();
        let height = main.getCanvasHeight();

        // Configuration lets
        let values = data.values;
        let valuesLength = values.length;

        let margin = this.margin;
        let chartW = width - (margin.left + margin.right);
        let chartH = height - (margin.top + margin.bottom);
        let gap = 2;

        let barWidth = (chartW / valuesLength) - gap;

        let xScale = main.getXScale(axis.x.type, chartW);
        let yScale = main.getYScale(chartH);

        // Filling SVG with data
        //        main.bar
        //            .data(data)
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
            .attr("y", function (d: IData) {
                return (chartH + margin.top) - yScale(d.value);  // Height minus data value
            })
            .attr("width", barWidth)
            .attr("height", function (d: IData) {
                return yScale(d.value) || 0;
            });
    };

}