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

    // pie component
    var pie = {};

    //==========================================================================================
    // Set the data for the current pie chart
    //==========================================================================================
    pie.data = function(data) {
        this.parent.data = data;
        // Data consistency test missing
        return this;
    };

    //==========================================================================================
    // Create pie chart
    //==========================================================================================
    pie.create = function() {
        var core = this.parent;
        var utils = core.utils;

        var chartName = core.selector;
        var data = core.data;

        var canvasWidth = utils.getCanvasWidth();
        var canvasHeight = utils.getCanvasHeight();


        //--------------------------------------------------------------------------------------
        // Effects
        //--------------------------------------------------------------------------------------
        var synchronizedMouseOver = function() {
            var arc = d3.select(this);
            var index = arc.attr("index");
            var color = arc.attr("color");

            var arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
            d3.selectAll(arcSelector).style("fill", color);
        };

        var synchronizedMouseOut = function() {

            var arc = d3.select(this);
            var index = arc.attr("index");

            var arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
            var selectedArc = d3.selectAll(arcSelector);
            selectedArc.style("fill", "#ffffff");

        };

        //--------------------------------------------------------------------------------------
        // Create SVG
        //--------------------------------------------------------------------------------------
        var svg = utils.createSVG();
        var calculatedLegends = utils.createSVGLegends(svg);

        var pie = d3.layout.pie().value(function(d){return d.value;});

        var legendHeight = calculatedLegends.height + 10; // 10px margin

        canvasHeight = canvasHeight - legendHeight; // Removing size of legends
        
        // Radius
        var r = Math.min(canvasWidth, canvasHeight) / 2;

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r - 10);
        var outArc = d3.svg.arc().innerRadius(r).outerRadius(r - 6);

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .classed("arc", true)
            .attr("transform", "translate(" + (canvasWidth / 2) + "," + (r + legendHeight) + ")")
            .attr("index", function(d, i) { return i; })
            .attr("color", function(d, i) {
                return utils.getColor(i);
            });
            
        g.append("path")
            .attr("d", arc)
            .attr("class", function(d, i) { 
                return "pie-" + chartName + "-arc-index-" + i; /////********
            })
            .attr("fill", function(d, i){
                return utils.getColor(i);
            })
            .attr("d", function (d) {
                return arc(d);
            });

        g.append("path")
            .attr("d", outArc)
            .attr("class", function(d, i) { 
                return "pie-outer-arc pie-outer-" + chartName + "-arc-index-" + i; 
            })
            .attr("fill", "#ffffff")
            .attr("d", function (d) {
                // log the result of the arc generator to show how cool it is :)
                return outArc(d);
            });
/*
        g.append("text")
            .attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle").text( function(d, i) {
                return data[i].label;
            }
        );
*/

        g.on('mouseover', synchronizedMouseOver)
            .on("mouseout", synchronizedMouseOut);

        return true;
    };

    //==========================================================================================
    // Create pie chart
    //==========================================================================================
    pie.update = function() {
        console.log('update');
    };

    //==========================================================================================
    // Set type of chart
    //==========================================================================================
    opencharts.pie = function() {
        this.type = "pie";
        pie.parent = this;

        return pie;
    };    
})();
