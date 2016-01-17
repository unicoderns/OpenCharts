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
    // Public functions
    //==========================================================================================

    //------------------------------------------------------------------------------------------
    // Main Object, everything it's contained here
    //------------------------------------------------------------------------------------------
    var opencharts = {
        selector: "",
        data: "",
        type: "",
        default: {
            colors: d3.scale.category20c(),
            legends: {
                position: 'top',
                align: 'left',
                shapeSize: 14
            },
            margin: { // Reminder: test the consistency on custom setups
                top: 0, 
                right: 0, 
                bottom: 0, 
                left: 0
            },
            pie: {
                width: 400,
                height: 440
            },
            bar: {
                width: 400,
                height: 100
            }
        },
        charts: {}, // Settings for each chart
    };

    //------------------------------------------------------------------------------------------
    // Select the chart
    //------------------------------------------------------------------------------------------
    opencharts.select =  function(selector){
        this.selector = selector.replace("#", "");
        return this;
    };

    //------------------------------------------------------------------------------------------
    // Print the current object
    //------------------------------------------------------------------------------------------
    opencharts.print =  function(){
        console.log(this);
        return this;
    };

    //------------------------------------------------------------------------------------------
    // Init
    //------------------------------------------------------------------------------------------
    opencharts.init = function() {
    };

    //------------------------------------------------------------------------------------------
    // Getting data object from DOM using d3 (custom tags)
    //------------------------------------------------------------------------------------------
    opencharts.getData = function(selector) {
        var dataString = d3.select(selector)[0][0].dataset.object;
        var dataArray = dataString.split(".");
        var data;
        
        dataArray.forEach(function(key) { // Getting data object
            if (!data) {
                data = window[key];
            } else {
                data = data[key];
            }
        });

        return data;
    };
    // Making opencharts var public
    window.opencharts = opencharts;
})();

//------------------------------------------------------------------------------------------
// On page load create custom-tags elements
//------------------------------------------------------------------------------------------
/*document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    var pieElements = d3.selectAll("opencharts-pie");
    pieElements = pieElements[0];

    if (pieElements.length) {

        pieElements.forEach(function(key) { // Creating charts
            var id = key.id;
            var selector = "#" + id;
            var data = opencharts.getData(selector);

            opencharts.select(selector).pie().data(data).create(); // Create pie
        });
    }
});*/