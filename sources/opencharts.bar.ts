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


import { Chart } from "./opencharts";
import * as d3 from "d3";
import * as IData from "./interfaces/IData";

export class Bar extends Chart {

    protected svg;
    protected bar;

    // ------------------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------------------
    constructor(selector) {
        super(selector);
    }

    // ==========================================================================================
    // Create bar chart
    // ==========================================================================================
    public create() {
        // Main OpenCharts object
        let main: Bar = this;

        let data = main.dataArray;
        let canvasWidth = main.getCanvasWidth();
        let canvasHeight = main.getCanvasHeight();

        // Configuration lets
        let values = data[0].values;
        let valuesLength = values.length;

        let margin = { top: 1, right: 0, bottom: 18, left: 22 };
        let w = 400;
        let h = 100;
        let chartW = w - (margin.left + margin.right);
        let chartH = h - (margin.top + margin.bottom);
        let gap = 2;

        let barWidth = (chartW / valuesLength) - gap;

        let chartName = main.selector + "-chart";

        main.svg = main.createSVG();

        // Data scale
        let xScale = d3.scaleTime()
            .domain([
                new Date(values[0].label * 1000),
                d3.timeDay.offset(new Date(values[valuesLength - 1].label * 1000), 1)
            ])
            .range([0, chartW]);

        let yScale = d3.scaleLinear()
            .domain([
                d3.max(values, function (d: any) { return d.value; }),
                d3.min(values, function (d: any) { return d.value; })
            ])
            .range([0, chartH]);
/*
        //Data axis
        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);  //Set rough # of ticks

        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10)
            .tickFormat(d3.time.format("%d/%m"));
*/
        // Filling SVG with data
        this.svg.selectAll("rect")
            .data(values)
            .enter()
            .append("rect")
            .attr("fill", function (d, i) {
                return main.getColor(0);
            })
            .attr("x", function (d, i) {
                return gap + i * (barWidth + gap) + margin.left;
            })
            .attr("y", function (d) {
                return (chartH + margin.top) - yScale(d.value);  // Height minus data value
            })
            .attr("width", barWidth)
            .attr("height", function (d) {
                return yScale(d.value);
            });

        // Create X axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + "," + (chartH + margin.top) + ")")
            .call(d3.axisBottom(xScale));

        // Create Y axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(d3.axisLeft(yScale));

    };
    /*
    
        public update = function () {
            // Main OpenCharts object
            let main: Pie = this;
    
            function arcTween(a) {
                let i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return main.arc(i(t));
                };
            }
    
            main.svg.selectAll(".arc .inner-arc")
                .data(main.pie(main.dataArray))
                .transition()
                .duration(1000)
                .attrTween("d", arcTween);
    
            main.svg.selectAll(".arc .outer-arc")
                .data(main.pie(main.dataArray))
                .on("end", function() { console.log("all done"); })
                .attr("d", function (d) {
                    return main.outArc(d);
                });
    
        };
    
    */
}
/*
(function(){
    "use strict";

    // bar component
    let bar = {};

    //------------------------------------------------------------------------------------------
    // Set the data for the current bar chart
    //------------------------------------------------------------------------------------------
    bar.data =  function(data) {
        this.parent.data = data;
        // Data consistency test missing
        return this;
    };

    //------------------------------------------------------------------------------------------
    // Create bar chart
    //------------------------------------------------------------------------------------------
    bar.create = function() {
        let core = this.parent;
        let utils = core.utils;

        // Configuration lets
        let data = core.data[0];
        let values = data.values;
        let valuesLength = values.length;

        let margin = {top: 1, right: 0, bottom: 18, left: 22};
        let w = 400;
        let h = 100;
        let chartW = w - (margin.left + margin.right);
        let chartH = h - (margin.top + margin.bottom);
        let gap = 2; 

        let barWidth = (chartW / valuesLength) - gap;

        let chartSelector = core.selector;    
        let chartName = chartSelector.replace("#", "");

        let svg = utils.createSVG(w, h);

        // Data scale
        let xScale = d3.time.scale()
            .domain([
                new Date(values[0].label * 1000), 
                d3.time.day.offset(new Date(values[valuesLength - 1].label * 1000), 1)
            ])
            .range([0, chartW]); 

        let yScale = d3.scale.linear()
            .domain([
                d3.max(values, function(d) { return d.value; }), 
                d3.min(values, function(d) { return d.value; })
            ])
            .range([0, chartH]); 

        //Data axis
        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);  //Set rough # of ticks

        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10)
            .tickFormat(d3.time.format("%d/%m"));

        // Filling SVG with data
        svg.selectAll("rect")
            .data(values)
            .enter()
            .append("rect")
            .attr("fill", function(d, i){
                return utils.getColor(0);
            })
            .attr("x", function(d, i) {
                return gap + i * (barWidth + gap) + margin.left;
            })
            .attr("y", function(d) {
                return (chartH + margin.top) - yScale(d.value);  //Height minus data value
            })
            .attr("width", barWidth)
            .attr("height", function(d) {
                return yScale(d.value);
            });

        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + "," + (chartH + margin.top) + ")")
            .call(xAxis);

        //Create Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis);

        return true;
    };


    //------------------------------------------------------------------------------------------
    // Set type of chart
    //------------------------------------------------------------------------------------------
    opencharts.bar = function() {
        this.type = "bar";
        bar.parent = this;

        return bar;
    };
})();
*/