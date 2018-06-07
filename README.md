# OpenCharts
It's time to easier beautiful charts.

See http://OpenCharts.org for more.

## Why?
There's a lot of charts libraries outside, some too ugly, some others too complex, we are trying to solve that.

## Instalation
```console
bower install
```

## Usage

### Regular way

```javascript
var data = [
    { label: "Category A", value: Math.random() * 100, color: "#9b3388" },
    { label: "Category B", value: Math.random() * 100, color: "#4f99fc" },
    { label: "Category C", value: Math.random() * 100, color: "#fe8a4d" },
];

// Configuring require
require.config({
    paths: {
        d3: "../bower_components/d3/d3.min"
    }
});

// Creating Charts
require(['opencharts'], function(opencharts) {
    // Pie
    var pie = new opencharts.Pie("#hola");
    pie.setSettings(oc_examples.pie());
    pie.create();
});
```

### Experimental

```javascript
var data = [
    { label: "Category A", value: Math.random() * 100, color: "#9b3388" },
    { label: "Category B", value: Math.random() * 100, color: "#4f99fc" },
    { label: "Category C", value: Math.random() * 100, color: "#fe8a4d" },
];
```

```html
<opencharts-pie id="chart" data-object="data" />
```

## Live update

```javascript
var data2 = [
    { label: "Category A", value: Math.random() * 100, color: "#9b3388" },
    { label: "Category B", value: Math.random() * 100, color: "#4f99fc" },
    { label: "Category C", value: Math.random() * 100, color: "#fe8a4d" },
];

pie.setSettings(data2);
pie.update();

```
