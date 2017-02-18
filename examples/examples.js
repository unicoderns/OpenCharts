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
var oc_examples = {};

oc_examples.now = Date.now();

// Pie Data
oc_examples.data = function() {
    return [
        { label: "Category A", value: Math.random() * 100, color: "#9b3388" },
        { label: "Category B", value: Math.random() * 100, color: "#4f99fc" },
        { label: "Category C", value: Math.random() * 100, color: "#fe8a4d" },
    ];
};

// Bar Data
oc_examples.data2 = [{
    title: "Default data",
    color: "#9b3388",
    values: []
}];

for (i = 0; i < 20; i++) {
    oc_examples.data2[0].values.push({
        label: oc_examples.now + (i * 86400),
        value: Math.random() * 100
    });
}

// Creating Charts
require.config({
    paths: {
        d3: "../bower_components/d3/d3.min"
    }
});

require(['opencharts.pie'], function(pie) {
    var test = new pie.Pie("#hola");
    test.setData(oc_examples.data());
    test.create();

    function update() {
        setTimeout(function() {
            test.setData(oc_examples.data());
            test.update();
            update();
        }, 3000);
    }
    update();
});

require(['opencharts.bar'], function(bar) {
    console.log(oc_examples.data2);
    var test = new bar.Bar("#hola2");
    test.setData(oc_examples.data2);
    test.create();
});