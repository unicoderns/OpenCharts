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

import { RoundChart } from "./abstract/roundChart";
import * as d3 from "d3";
import * as IData from "./interfaces/IData";

export class Pie extends RoundChart {

    protected arc: d3.Arc<any, d3.DefaultArcObject>;
    protected outArc: d3.Arc<any, d3.DefaultArcObject>;
    protected svg;
    protected pie;

    // ==========================================================================================
    // Create pie chart
    // ==========================================================================================
    public create() {
        // Main OpenCharts object
        let main: Pie = this;

        let data = main.settings.data;
        let canvasWidth = main.getCanvasWidth();
        let canvasHeight = main.getCanvasHeight();

        let chartName = main.selector + "-chart";

        // --------------------------------------------------------------------------------------
        // Effects
        // --------------------------------------------------------------------------------------
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


        // --------------------------------------------------------------------------------------
        // Create SVG
        // --------------------------------------------------------------------------------------
        main.svg = main.createSVG();
        let calculatedLegends = main.createSVGLegends(main.svg);

        main.pie = d3.pie<IData.IPie>().value(function (d) {
            return d.value;
        });

        let legendHeight = calculatedLegends.height + 10; // 10px margin

        canvasHeight = canvasHeight - legendHeight; // Removing size of legends

        // Radius
        let radius = Math.min(canvasWidth, canvasHeight) / 2;

        // declare an arc generator function
        main.arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
        main.outArc = d3.arc().innerRadius(radius).outerRadius(radius - 6);

        let g = main.svg.selectAll(".arc")
            .data(main.pie(data))
            .enter()
            .append("g")
            .classed("arc", true)
            .attr("transform", "translate(" + (canvasWidth / 2) + "," + (radius + legendHeight) + ")")
            .attr("index", function (d, i) { return i; })
            .attr("color", function (d, i) {
                return main.getColor(i);
            });

        g.append("path")
            .attr("class", function (d, i) {
                return "inner-arc pie-" + chartName + "-arc-index-" + i; /////********
            })
            .attr("fill", function (d, i) {
                return main.getColor(i);
            })
            .attr("d", function (d) {
                return main.arc(d);
            })
            .each(function (d) { this._current = d; }); // store the initial angles

        g.append("path")
            .attr("class", function (d, i) {
                return "outer-arc pie-outer-arc pie-outer-" + chartName + "-arc-index-" + i;
            })
            .attr("fill", "#ffffff")
            .attr("d", function (d) {
                // log the result of the arc generator to show how cool it is :)
                return main.outArc(d);
            })
            .each(function (d) { this._current = d; }); // store the initial angles

        g.on("mouseover", synchronizedMouseOver)
            .on("mouseout", synchronizedMouseOut);
    };

    public update = function () {
        // Main OpenCharts object
        let main: Pie = this;
        let data = main.settings.data;

        function arcTween(a) {
            let i = d3.interpolate(this._current, a);
            this._current = i(0);
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

}