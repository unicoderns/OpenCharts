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

        var data = core.data;
        var w = 400;
        var h = 439;

        var margin = {
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0
        };

        var canvasW = w - (margin.left + margin.right);
        var canvasH = h - (margin.top + margin.bottom);

        var legendSettings = {
            position: 'top',
            align: 'left',
            shape: 14
        };

        var chartSelector = core.selector;    
        var chartName = chartSelector.replace("#", "");    

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
        var svg = utils.createSVG(w, h);


        var calculatedLegends = [];

        //--------------------------------------------------------------------------------------
        // Legends
        //--------------------------------------------------------------------------------------
        var legend = svg.selectAll('.legend')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'legend');

        legend.append('text')
            .text(function(d) { return d.label; })
            .attr('x', function (d, i) {
                calculatedLegends[i] = {};

                // Get this height
                var height = this.clientHeight;
                calculatedLegends[i].height = height;

                if (calculatedLegends[i - 1]) {
                    // Get this width
                    var width = this.getComputedTextLength();

                    // Get provitional left
                    var left = calculatedLegends[i - 1].left + calculatedLegends[i - 1].width + (legendSettings.shape * 2);

                    // Decide where to place it
                    if ((left + width + margin.right) <= w) {
                        calculatedLegends[i].left = left;
                        calculatedLegends[i].top = calculatedLegends[i - 1].top || 0;
                    } else {
                        calculatedLegends[i].left = 0;
                        calculatedLegends[i].top = calculatedLegends[i - 1].top + height;
                    }
                    calculatedLegends[i].width = width + legendSettings.shape;
                    
                } else {
                    calculatedLegends[i].top = 0;
                    calculatedLegends[i].left = 0;
                    calculatedLegends[i].width = this.getComputedTextLength() + legendSettings.shape;
                }
                return calculatedLegends[i].left + (legendSettings.shape * 1.5);
            })
            .attr('y', function (d, i) {
                calculatedLegends.height = calculatedLegends[i].top + calculatedLegends[i].height;
                return calculatedLegends[i].top;
            });

        var circleR = legendSettings.shape / 2;

        legend.append('circle')
            .attr('r', circleR)
            .attr("fill", function(d, i) {
                return utils.getColor(i);
            })
            .attr('cx', function (d, i) {
                return calculatedLegends[i].left + circleR;
            })
            .attr('cy', function (d, i) {
                return -1 * (margin.top + (calculatedLegends[i].height / 2)) + calculatedLegends[i].top + (circleR / 2);
            });
        
        legend.attr('transform', function(d, i) {
            var horz = margin.left;
            var vert = margin.top + calculatedLegends[i].height;
            return 'translate(' + horz + ',' + vert + ')';
        });

        var pie = d3.layout.pie().value(function(d){return d.value;});

        var legendHeight = calculatedLegends.height + 20; // 20px margin

        canvasH = canvasH - legendHeight;
        console.log(canvasH);
        // Radius
        var r = Math.min(canvasW, canvasH) / 2;

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r - 10);
        var outArc = d3.svg.arc().innerRadius(r).outerRadius(r - 6);

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .classed("arc", true)
            .attr("transform", "translate(" + (canvasW / 2) + "," + (r + legendHeight) + ")")
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
