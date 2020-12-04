// The svg
console.log('init');
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height")


// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([0, 1, 2, 3, 4, 5])
    .range(d3.schemeBlues[5]);

//legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)")
    .append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Wasser-Stress-Score");
var labels = ['Low <10%', 'Low - Medium (10-20%)', 'Medium - High (20-40%)', 'High (40-80%)', 'Extremely High (>80%)'];
var legend = d3.legendColor()
    .labels(function (d) {
        return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);



// Load external data and boot
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "data/country-water-stress.csv", function (d) {
        data.set(d.code, +d.score);
    })
    .await(ready);
console.log(data);

function ready(error, topo) {

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            console.log("total", d.total);
            return colorScale(d.total);
        });
    svg.select(".legendThreshold")
        .call(legend);
}