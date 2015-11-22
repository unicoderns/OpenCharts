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

var oc_examples = {}

oc_examples.data = {'labels': ["Category A", "Category B", "Category C"],
                    'values': [20, 50, 30]};

oc_examples.data2 = {'labels': ["Category A", "Category B", "Category C"],
                    'values': [50, 30, 90]};

opencharts.select("#hola").pie().data(oc_examples.data).create();


/*
console.log('-- basic tests --');

var listen = function () {

var observer = new ArrayObserver(oc_examples.data.labels);
observer.open(function(splices) {
  // respond to changes to the elements of arr.
    splices.forEach(function(splice) {
	    console.log("something change");
        console.log(splice.index); // the index position that the change occurred.
        console.log(splice.removed); // an array of values representing the sequence of removed elements
        console.log(splice.addedCount); // the number of elements which were inserted.
        opencharts.select("#hola").data(oc_examples.data).pie().create();
    });
});


var observer = new ArrayObserver(oc_examples.data.values);
observer.open(function(splices) {
  // respond to changes to the elements of arr.
    splices.forEach(function(splice) {
      console.log("something change");
        console.log(splice.index); // the index position that the change occurred.
        console.log(splice.removed); // an array of values representing the sequence of removed elements
        console.log(splice.addedCount); // the number of elements which were inserted.
        opencharts.select("#hola").data(oc_examples.data).pie().create();
    });
});

setTimeout(function(){ 
    oc_examples.data.values.push(40);
    oc_examples.data.labels.push("Hola");
    oc_examples.data.values.push(40);
    oc_examples.data.labels.push("Hola");
    oc_examples.data.values.push(40);
    oc_examples.data.labels.push("Hola");
    oc_examples.data.values.push(40);
    oc_examples.data.labels.push("Hola");
    oc_examples.data.values.push(40);
    oc_examples.data.labels.push("Hola");
    console.log(oc_examples.data);
    console.log("finished");
}, 3000);
};

function check() {
    setTimeout(function(){ 
        console.log("fired");
        Platform.performMicrotaskCheckpoint();
        check();
    }, 1000);  
}
check();
listen();
*/