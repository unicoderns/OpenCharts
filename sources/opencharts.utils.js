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

    //==========================================================================================
    // Chart utils
    //==========================================================================================
    var utils = {};
    var core = opencharts;

    //------------------------------------------------------------------------------------------
    // Create SVG image
    //------------------------------------------------------------------------------------------
    utils.createSVG = function() {
        var width = utils.getWidth();
        var height = utils.getHeight();
        return d3.select("#" + core.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height )
            .classed("svg-content-responsive", true);        
    };

    //------------------------------------------------------------------------------------------
    // Create Legends for SVG
    //------------------------------------------------------------------------------------------
    utils.createSVGLegends = function(svg) {

        var calculatedLegends = [];

        var width = utils.getWidth();
//        height = utils.getHeight();
        var margin = utils.getMargin();

        var shapeSize = utils.getLegendShapeSize();

        var legend = svg.selectAll('.legend')
            .data(core.data)
            .enter()
            .append('g')
            .attr('class', 'legend');

        legend.append('text')
            .text(function(d) { return d.label; })
            .attr('x', function (d, i) {
                var legendWidth = this.getComputedTextLength();
                var legendHeight = this.clientHeight;
                return utils.getLegendX(calculatedLegends, i, legendWidth, legendHeight);
            })
            .attr('y', function (d, i) {
                return utils.getLegendY(calculatedLegends, i);
            });

        var circleR = shapeSize / 2;

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
        return calculatedLegends;        
    };

    //------------------------------------------------------------------------------------------
    // Get chart legend X position
    //------------------------------------------------------------------------------------------
    utils.getLegendX = function(calculatedLegends, i, legendWidth, legendHeight) {
        var width = utils.getWidth();
        var canvasWidth = utils.getCanvasWidth();
//        var canvasHeight = utils.getCanvasHeight();

        var shapeSize = utils.getLegendShapeSize();

        calculatedLegends[i] = {};
        calculatedLegends[i].height = legendHeight;

        if (calculatedLegends[i - 1]) {
            // Get provitional left
            var legendLeft = calculatedLegends[i - 1].left + calculatedLegends[i - 1].width + (shapeSize * 2);

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

    //------------------------------------------------------------------------------------------
    // Get chart legend Y position
    //------------------------------------------------------------------------------------------
    utils.getLegendY = function(calculatedLegends, i) {
        calculatedLegends.height = calculatedLegends[i].top + calculatedLegends[i].height;
        return calculatedLegends[i].top;
    };

    //------------------------------------------------------------------------------------------
    // Get color or default
    //------------------------------------------------------------------------------------------
    utils.getColor = function(i) {
        if (core.data[i].color) {
            return core.data[i].color;            
        }
        return core.default.colors(i);
    };

    //------------------------------------------------------------------------------------------
    // Get chart width or default
    //------------------------------------------------------------------------------------------
    utils.getWidth = function() {
        if (core.charts[core.selector]) {
            if (core.charts[core.selector].width) {
                return core.charts[core.selector].width;
            }
        }
        return core.default[core.type].width;
    };

    //------------------------------------------------------------------------------------------
    // Get chart height or default
    //------------------------------------------------------------------------------------------
    utils.getHeight = function() {
        if (core.charts[core.selector]) {
            return core.charts[core.selector].height || core.default[core.type].height;
        }
        return core.default[core.type].height;
    };

    //------------------------------------------------------------------------------------------
    // Get chart canvas width or default
    //------------------------------------------------------------------------------------------
    utils.getCanvasWidth = function() {
        var width = utils.getWidth();
        var margin = utils.getMargin();

        return width - (margin.left + margin.right);
    };

    //------------------------------------------------------------------------------------------
    // Get chart canvas height or default
    //------------------------------------------------------------------------------------------
    utils.getCanvasHeight = function() {
        var height = utils.getHeight();
        var margin = utils.getMargin();

        return height - (margin.top + margin.bottom);
    };

    //------------------------------------------------------------------------------------------
    // Get margins
    //------------------------------------------------------------------------------------------
    utils.getMargin = function() {
        if ((core.charts[core.selector]) && (core.charts[core.selector].margin)) {
            return core.charts[core.selector].margin;
        }
        return core.default.margin;
    };

    //------------------------------------------------------------------------------------------
    // Get chart legend shape size or default
    //------------------------------------------------------------------------------------------
    utils.getLegendShapeSize = function() {
        if ((core.charts[core.selector]) && (core.charts[core.selector].legends) && 
            (core.charts[core.selector].legends.shapeSize)) {
            return core.charts[core.selector].legends.shapeSize;
        }
        return core.default.legends.shapeSize;
    };

    //------------------------------------------------------------------------------------------
    // Setup Utils object
    //------------------------------------------------------------------------------------------
    core.utils = utils;

})();
