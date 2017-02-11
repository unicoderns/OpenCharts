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
import { Types, VAlign, Align, Legend, Margin } from "./utils";

export class Chart {
    protected selector: string;
    protected dataArray: any;
    protected width: number = 400;
    protected height: number = 400;
    protected colors: string[];
    //        protected legend: Legend;
    // protected margin: directions;
    protected margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    protected legend = {
        shapeSize: 14
    };

    // ------------------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------------------
    constructor(selector) {
        this.selector = selector.replace("#", "");
        this.colors = d3.schemeCategory20c;
    }

    public setData(data) {
        this.dataArray = data;
    }

    // ------------------------------------------------------------------------------------------
    // Getting data object from DOM using d3 (custom tags)
    // ------------------------------------------------------------------------------------------
    /*        public get data() {
                let dataString = d3.select(this.selector)[0][0].dataset.object;
                let dataArray = dataString.split(".");
                let data;
    
                dataArray.forEach(function(key) { // Getting data object
                    if (!data) {
                        data = window[key];
                    } else {
                        data = data[key];
                    }
                });
    
                return data;
            };
    */

    // ------------------------------------------------------------------------------------------
    // Create SVG image
    // ------------------------------------------------------------------------------------------
    protected createSVG(): any {
        let width = this.width;
        let height = this.height;
        return d3.select("#" + this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed("svg-content-responsive", true);
    };

    // ------------------------------------------------------------------------------------------
    // Create Legends for SVG
    // ------------------------------------------------------------------------------------------
    protected createSVGLegends(svg): any {
        // Main OpenCharts object
        let main = this;

        let calculatedLegends = [];

        let width = this.width;
        let margin = this.margin;

        let shapeSize: number = this.getLegendShapeSize();

        let legend = svg.selectAll(".legend")
            .data(this.dataArray)
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("text")
            .text(function (d) { return d.label; })
            .attr("x", function (d, i) {
                let legendWidth = this.getComputedTextLength();
                let legendHeight = this.clientHeight;
                return main.getLegendX(calculatedLegends, i, legendWidth, legendHeight);
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
    // Get chart canvas width or default
    // ------------------------------------------------------------------------------------------
    protected getCanvasWidth() {
        let width = this.width;
        let margin = this.margin;

        return width - (margin.left + margin.right);
    };

    // ------------------------------------------------------------------------------------------
    // Get chart canvas height or default
    // ------------------------------------------------------------------------------------------
    protected getCanvasHeight() {
        let height = this.height;
        let margin = this.margin;

        return height - (margin.top + margin.bottom);
    };

    // ------------------------------------------------------------------------------------------
    // Get chart legend shape size or default
    // ------------------------------------------------------------------------------------------
    protected getLegendShapeSize(): number {
        return this.legend.shapeSize;
    };

    // ------------------------------------------------------------------------------------------
    // Get color from data or default
    // ------------------------------------------------------------------------------------------
    protected getColor(index: number): string {
        console.log(this.dataArray[index].color);
        return this.dataArray[index].color || this.colors[index];
    };
}