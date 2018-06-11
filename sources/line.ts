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


import * as d3 from "d3";
import * as IAxis from "./interfaces/IAxis";

import { RegularChart } from "./abstract/regularChart";

import IData from "./interfaces/IData";

export class Line extends RegularChart {

    protected svg: d3.Selection<SVGElement, {}, HTMLElement, any>
    protected line;

    // ------------------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------------------
    constructor(selector) {
        super(selector);
        /**
        * Margin default
        */
        this.margin = { top: 8, right: 0, bottom: 18, left: 42 };
        /**
        * Create SVG
        */
        this.svg = this.createSVG();
    }

    // ==========================================================================================
    // Create bar chart
    // ==========================================================================================
    public create() {
        /**
        * This local reference
        */
        let main: Line = this;

        /**
        * References
        */
        let chartName = main.selector + "-chart";
        let settings = main.settings;
        let axis = settings.axis;
        let margin = this.margin;

        /**
        * Basic calculations
        */
        let width = main.getCanvasWidth();
        let height = main.getCanvasHeight();
        let chartW = width - (margin.left + margin.right);
        let chartH = height - (margin.top + margin.bottom);

        /**
        * Data manipulation
        */
        let data = settings.data[0];
        let values = data.values;
        let valuesLength = values.length;

        /**
        * Data calculations
        */
        let column = (chartW / valuesLength);

        /**
        * Filling missing data
        */
        this.fillDefaults();

        /**
        * SVG creation
        */
        main.svg = main.createSVG();

        /**
        * Other calculations
        */
        let xScale = main.getXScale(axis.x.type, chartW);
        let yScale = main.getYScale(chartH);

        var line: any = d3.line()
            .x(function (d: any) { return xScale(d.label) + (column / 2); })
            .y(function (d: any) { return yScale(d.value) + margin.top; })
            .curve(d3.curveMonotoneX);

        /**
        * Effects
        */
        let synchronizedMouseOver = function () {
            let arc = d3.select(this);
            let index = arc.attr("index");
            let color = arc.attr("color");

            let arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
            d3.selectAll(arcSelector).style("fill", color)
                .classed("animate", true);
        };

        let synchronizedMouseOut = function () {
            let arc = d3.select(this);
            let index = arc.attr("index");

            let arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
            let selectedArc = d3.selectAll(arcSelector);
            selectedArc.style("fill", "#ffffff")
                .classed("animate", false);
        };

        main.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
            .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

        main.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        // Create line
        main.svg.append("path")
            .datum(values)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("class", "line") // Assign a class for styling
            .attr("d", line);

        // Create dots
        main.svg.selectAll(".dot")
            .data(values)
            .enter().append("circle") // Uses the enter().append() method
            .attr("cx", function (d: IData) { return xScale(d.label) + (column / 2) })
            .attr("cy", function (d: IData) { return yScale(d.value) + margin.top })
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("stroke", function (d, i) {
                return main.getColor(0);
            })
            .attr("fill", "#fff")
            .attr("stroke-width", "2")
            .attr("r", 12);

        main.svg.selectAll(".dotSelected")
            .data(values)
            .enter().append("circle") // Uses the enter().append() method
            .attr("cx", function (d: IData) { return xScale(d.label) + (column / 2) })
            .attr("cy", function (d: IData) { return yScale(d.value) + margin.top })
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("fill", function (d, i) {
                return main.getColor(0);
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", "2")
            .attr("r", 6)
            .on("mouseover", synchronizedMouseOver)
            .on("mouseout", synchronizedMouseOut);

    };

}