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
(function () {
    var oc_examples = {};

    oc_examples.now = Date.now();
    oc_examples.months = new Array("Apples", "Pineapples", "Oranges", "Peaches", "Bananas");

    // Pie Data
    oc_examples.pie = function () {
        return {
            data: [{
                    label: "Category A",
                    value: Math.random() * 100,
                    color: "#9b3388"
                },
                {
                    label: "Category B",
                    value: Math.random() * 100,
                    color: "#4f99fc"
                },
                {
                    label: "Category C",
                    value: Math.random() * 100,
                    color: "#fe8a4d"
                },
            ]
        };
    };

    // Bar Data
    oc_examples.bar1 = function () {
        return {
            width: 700,
            height: 350,
            data: [{
                title: "Default data",
                color: "#9b3388",
                values: (function () {
                    values = [];
                    for (i = 0; i < 4; i++) {
                        values.push({
                            label: oc_examples.months[i],
                            value: Math.random() * 100
                        });
                    }
                    return values;
                })()
            }]
        };
    };

    // Bar Time X Data
    oc_examples.bar2 = function () {
        return {
            width: 700,
            height: 350,
            axis: {
                x: {
                    type: "time",
                    format: "%d/%m",
                    ticks: 10
                }
            },
            data: [{
                title: "Default data",
                color: "#4f99fc",
                values: (function () {
                    values = [];
                    for (i = 0; i < 20; i++) {
                        values.push({
                            label: oc_examples.now + (i * 86400),
                            value: Math.random() * 100
                        });
                    }
                    return values;
                })()
            }]
        };
    };

    oc_examples.line1 = function () {
        return {
            width: 700,
            height: 350,
            data: [{
                title: "Default data",
                color: "#ffab00",
                values: (function () {
                    values = [];
                    for (i = 0; i < 4; i++) {
                        values.push({
                            label: oc_examples.months[i],
                            value: Math.random() * 100
                        });
                    }
                    return values;
                })()
            }]
        };
    };

    // Creating Charts
    require.config({
        paths: {
            d3: "../bower_components/d3/d3.min"
        }
    });

    require(['opencharts'], function (opencharts) {

        // Pie
        var pie = new opencharts.Pie("#pie");
        pie.setSettings(oc_examples.pie());
        pie.create();

        function updatePie() {
            setTimeout(function () {
                pie.setSettings(oc_examples.pie());
                pie.update();
                updatePie();
            }, 3000);
        }

        // Bar
        var bar = new opencharts.Bar("#bar1");
        bar.setSettings(oc_examples.bar1());
        bar.create();

        function updateBar() {
            setTimeout(function () {
                bar.setSettings(oc_examples.bar1());
                bar.update();
                updateBar();
            }, 3000);
        }

        // Bar2
        var bar2 = new opencharts.Bar("#bar2");
        bar2.setSettings(oc_examples.bar2());
        bar2.create();

        function updateBar2() {
            setTimeout(function () {
                bar2.setSettings(oc_examples.bar2());
                bar2.update();
                updateBar2();
            }, 3000);
        }

        // Line1
        var line = new opencharts.Line("#line1");
        line.setSettings(oc_examples.line1());
        line.create();

        function updateLine1() {
            setTimeout(function () {
                line.setSettings(oc_examples.line1());
                line.update();
                updateLine1();
            }, 3000);
        }
        
        // Trigger updates
        updatePie();
        updateBar();
        updateBar2();
        updateLine1();

    });
})();