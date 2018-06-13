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
import { Types, VAlign, Align, Legend, Margin } from "../utils";

export class Chart {
    protected selector: string;
    protected settings: any;
    protected width: number = 400;
    protected height: number = 200;
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

    // ------------------------------------------------------------------------------------------
    // Loading chart settings
    // ------------------------------------------------------------------------------------------
    public setSettings(settings) {
        if (settings !== undefined) {
            this.settings = settings;

            if (settings.width) {
                this.width = settings.width;
            }

            if (settings.height) {
                this.height = settings.height;
            }
        } else {
            console.error("Opencharts error: no data provided");
        }
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
    protected createSVG(type: string): any {
        let width = this.width;
        let height = this.height;
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
    // Get color from data or default
    // ------------------------------------------------------------------------------------------
    protected getColor(index: number): string {
        return this.settings.data[index].color || this.colors[index];
    };

}