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
opencharts.pie = function(){
    "use strict";

    this._type = "pie";
    return this;
};

//------------------------------------------------------------------------------------------
// Set the data for the current pie chart
//------------------------------------------------------------------------------------------
opencharts.pie().data =  function(data){
    "use strict";

    this._data = data;
    // Data consistency test missing
    return this;
};

//------------------------------------------------------------------------------------------
// Create pie chart
//------------------------------------------------------------------------------------------
opencharts.pie().create = function(){
    "use strict";

    console.log("creating");

    
    var data = this._data;
    var w = 400;
    var h = 400;
    var r = h/2;
    var color = d3.scale.category20c();

    var pieName = this._selector.replace("#", "");    

    // Effects
    var synchronizedMouseOver = function() {
        var _arc = d3.select(this);
        var _indexValue = _arc.attr("index_value");

        var _arcSelector = "." + "pie-outer-" + pieName + "-arc-index-" + _indexValue;
        d3.selectAll(_arcSelector).style("fill", color(_indexValue));
    };

    var synchronizedMouseOut = function() {

        var _arc = d3.select(this);
        var _indexValue = _arc.attr("index_value");

        var _arcSelector = "." + "pie-outer-" + pieName + "-arc-index-" + _indexValue;
        var _selectedArc = d3.selectAll(_arcSelector);
        _selectedArc.style("fill", "#ffffff");

    };

    var vis = d3.select(this._selector)
                .append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + w + " " + h )
                //class to make it responsive
                .classed("svg-content-responsive", true)
                .data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");

    var pie = d3.layout.pie().value(function(d){return d.value;});

    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r - 10);
    var outArc = d3.svg.arc().innerRadius(r).outerRadius(r - 6);

    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.attr("index_value", function(d, i) { return i; });
    arcs.append("svg:path")
        .attr("class", function(d, i) { return "pie-" + pieName + "-arc-index-" + i; })
        .attr("fill", function(d, i){
            return color(i);
        })
        .attr("d", function (d) {
            // log the result of the arc generator to show how cool it is :)
            return arc(d);
        });

    arcs.append("svg:path")
        .attr("class", function(d, i) { return "pie-outer-arc pie-outer-" + pieName + "-arc-index-" + i; })
        .attr("fill", "#ffffff")
        .attr("d", function (d) {
            // log the result of the arc generator to show how cool it is :)
            return outArc(d);
        });

    // add the text
    arcs.append("svg:text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
            return data[i].label;
        }
    );

    arcs.on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut);


    return this;
};