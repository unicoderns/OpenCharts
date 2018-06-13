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
import * as IAxis from "../interfaces/IAxis";

import { Chart } from "./chart";

import IData from "../interfaces/IData";

export class RegularChart extends Chart {

    // ==========================================================================================
    // Check and create default settings
    //
    // ECMA 5 compatibility
    // ==========================================================================================
    public fillDefaults() {
        let main: any = this;

        // Default data
        if (main.settings.axis === undefined) {
            main.settings.axis = {
            };
        }
        if (main.settings.axis.x === undefined) {
            main.settings.axis.x = {
            };
        }
        if (main.settings.axis.x.ticks === undefined) {
            main.settings.axis.x.ticks = 10;
        }

        // Defining default types for X axis
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
    }
    
    // ==========================================================================================
    // Scale for X Axis
    // ==========================================================================================
    public getXScale(type: IAxis.X, width) {
        let scale;
        let values = this.settings.data[0].values;
        let labels = [];

        if (type === IAxis.X.time) {
            scale = d3.scaleTime()
                .domain([
                    new Date(values[0].label * 1000),
                    d3.timeDay.offset(new Date(values[values.length - 1].label * 1000), 1)
                ])
                .range([0, width]);
        } else {
            values.forEach(function (item) {
                labels.push(item.label);
            });

            scale = d3.scaleBand()
                // values.map(function (d) { return d.label; }) 
                .domain(labels)
                .rangeRound([0, width]);
        }

        return scale;
    }

    // ==========================================================================================
    // Scale for Y Axis
    // ==========================================================================================
    public getYScale(height) {
        let scale;
        let values = this.settings.data[0].values;

        scale = d3.scaleLinear()
            .domain([
                d3.max(values, function (d: IData) { return d.value; }),
                d3.min(values, function (d: IData) { return d.value; })
            ])
            .range([0, height]);

        return scale;
    }

}