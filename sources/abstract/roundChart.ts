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
import { Chart } from "./chart";

export class RoundChart extends Chart {
    protected height: number = 400;

    // ------------------------------------------------------------------------------------------
    // Create Legends for SVG
    // ------------------------------------------------------------------------------------------
    protected createSVGLegends(svg): any {
        // Main OpenCharts object
        let main = this;

        let calculatedLegends = [];
        let data = this.settings.data;

        let width = this.width;
        let margin = this.margin;

        let shapeSize: number = this.getLegendShapeSize();

        let legend = svg.selectAll(".legend")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("text")
            .text(function (d) { return d.label; })
            .attr("x", function (d, i) {
                let dimensions = this.getBoundingClientRect();
                // let legendWidth = this.getComputedTextLength();
                // let legendHeight = this.clientHeight;
                console.log(dimensions.height);
                return main.getLegendX(calculatedLegends, i, dimensions.width, dimensions.height);
            })
            .attr("y", function (d, i) {
                return main.getLegendY(calculatedLegends, i);
            });

        let circleR: number = shapeSize / 2;

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
            let horz = margin.left;
            let vert = margin.top + calculatedLegends[i].height;
            return "translate(" + horz + "," + vert + ")";
        });
        return calculatedLegends;
    };

    // ------------------------------------------------------------------------------------------
    // Get chart legend X position
    // ------------------------------------------------------------------------------------------
    protected getLegendX(calculatedLegends, i, legendWidth, legendHeight): number {
        let width = this.width;
        let canvasWidth = this.getCanvasWidth();

        let shapeSize = this.getLegendShapeSize();

        calculatedLegends[i] = {};
        calculatedLegends[i].height = legendHeight;

        if (calculatedLegends[i - 1]) {
            // Get provitional left
            let legendLeft: number = calculatedLegends[i - 1].left + calculatedLegends[i - 1].width + (shapeSize * 2);

            // Decide where to place it
            if ((legendLeft + legendWidth) <= canvasWidth) {
                calculatedLegends[i].left = legendLeft;
                calculatedLegends[i].top = calculatedLegends[i - 1].top || 0;
            } else {
                calculatedLegends[i].left = 0;
                calculatedLegends[i].top = calculatedLegends[i - 1].top + legendHeight;
            }
            calculatedLegends[i].width = legendWidth + shapeSize;

        } else {
            calculatedLegends[i].top = 0;
            calculatedLegends[i].left = 0;
            calculatedLegends[i].width = legendWidth + shapeSize;
        }
        return calculatedLegends[i].left + (shapeSize * 1.5);
    };

    // ------------------------------------------------------------------------------------------
    // Get chart legend Y position
    // ------------------------------------------------------------------------------------------
    protected getLegendY(calculatedLegends, i) {
        calculatedLegends.height = calculatedLegends[i].top + calculatedLegends[i].height;
        return calculatedLegends[i].top;
    };

    // ------------------------------------------------------------------------------------------
    // Get chart legend shape size or default
    // ------------------------------------------------------------------------------------------
    protected getLegendShapeSize(): number {
        return this.legend.shapeSize;
    };
}