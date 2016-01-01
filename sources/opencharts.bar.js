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


(function(){
    "use strict";

    // bar component
    var bar = {};

    //------------------------------------------------------------------------------------------
    // Set the data for the current bar chart
    //------------------------------------------------------------------------------------------
    bar.data =  function(data) {
        this.parent._data = data;
        // Data consistency test missing
        return this;
    };

    //------------------------------------------------------------------------------------------
    // Create bar chart
    //------------------------------------------------------------------------------------------
    bar.create = function() {
        // Configuration vars
        var data = this.parent._data;
        var dataLength = data.length;

        var margin = {top: 1, right: 0, bottom: 18, left: 22};
        var w = 400;
        var h = 100;
        var chartW = w - (margin.left + margin.right);
        var chartH = h - (margin.top + margin.bottom);
        var gap = 2; 
        var color = d3.scale.category20c();

        var barWidth = (chartW / dataLength) - gap;

        var chartSelector = this.parent._selector;    
        var chartName = chartSelector.replace("#", "");

        var svg = this.parent.utils.createSVG(chartSelector, w, h);

        console.log(data);

        // Data scale
        var xScale = d3.time.scale()
            .domain([
                new Date(data[0].label * 1000), 
                d3.time.day.offset(new Date(data[dataLength - 1].label * 1000), 1)
            ])
            .range([0, chartW]); 

        var yScale = d3.scale.linear()
            .domain([
                d3.max(data, function(d) { return d.value; }), 
                d3.min(data, function(d) { return d.value; })
            ])
            .range([0, chartH]); 

        //Data axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);  //Set rough # of ticks

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10)
            .tickFormat(d3.time.format("%d/%m"));

        // Filling SVG with data
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("fill", color(0))
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
        this._type = "bar";
        bar.parent = this;

        return bar;
    };
})();