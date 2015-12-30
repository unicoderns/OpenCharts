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

//------------------------------------------------------------------------------------------
// Set type of chart
//------------------------------------------------------------------------------------------
opencharts.bar = function() {
    "use strict";

    this._type = "bar";
    return this;
};

//------------------------------------------------------------------------------------------
// Set the data for the current bar chart
//------------------------------------------------------------------------------------------
opencharts.bar().data =  function(data) {
    "use strict";

    this._data = data;
    // Data consistency test missing
    return this;
};

//------------------------------------------------------------------------------------------
// Create bar chart
//------------------------------------------------------------------------------------------
opencharts.bar().create = function() {
    "use strict";

    console.log("creating");

    var data = this._data;
    var dataLength = data.length;
    var w = 400;
    var h = 100;
    var barPadding = 1; 
    var color = d3.scale.category20c();

    var chartName = this._selector.replace("#", "");    

    var svg = d3.select(this._selector)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + w + " " + h )
        //class to make it responsive
        .classed("svg-content-responsive", true);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", "teal")
        .attr("x", function(d, i) {
            return i * (w / dataLength);
        })
        .attr("y", function(d) {
            return h - d * 4;  //Height minus data value
        })
        .attr("width", w / dataLength - barPadding)
        .attr("height", function(d) {
            return d * 4;
        });

    return this;
};