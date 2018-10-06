import * as d3 from 'd3'
// Set up margin/height/width
var margin = { top: 30 , left: 30, right: 25, bottom: 28}
var height = 130 - margin.top - margin.bottom
var width = 130 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([12, 55])
  .range([0, width])
//Age goes from 12 to 55
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])
//Birth Per Woman goes from 0 to 0.3 

// Create a d3.line function that uses your scales
//one line for Japan, one line for US
var linefunctionjapan= d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_jp)
  })

  var linefunctionus = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Build your ready function that draws lines, axes, etc

function ready(datapoints) {

  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)
  ////Not sure what this is doing
  ///Single entry for each unique Year value
  
   container
    .selectAll('.svgz')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'svgz')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)
      var datapoints = d.values
    

    //not sure what bottom thing does
    svg
    .append('path')
    .datum(datapoints)
    .attr('d', linefunctionus)
    .attr('stroke', 'maroon')
    .attr('fill', 'maroon')
    .attr('opacity', 0.8)
      //makes the red blob

    svg 
    .append('path')
    .datum(datapoints)
    .attr('d', linefunctionjapan)
    .attr('stroke', 'blue')
    .attr('fill', 'blue')
    .attr('opacity', 0.8)
      //makes the blue blob

    svg
    .append('text')
    .text(d.key)
    .attr('x', width/3)
    .attr('y', 5)
    .attr('text-anchor', 'middle')
    //makes the label for each year

    //fertility rates
    var ASFRusrate= d3.sum(datapoints, d => +d.ASFR_us).toFixed(2)
    var ASFRjapanrate= d3.sum(datapoints, d => +d.ASFR_jp).toFixed(2)
// not sure what these do
      svg
      .append('text')
      .text(ASFRusrate)
      .attr('x', width / 2)
      .attr('y', 5)
      .attr('dx', 10)
      .attr('font-size', 12)
      .attr('fill', 'maroon')

      svg
      .append('text')
      .text(ASFRjapanrate)
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('dx', 10)
      .attr('font-size', 12)
      .attr('fill', 'blue')
      //not sure what dx is doing, just guessed and checked

    //ticks
    var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale).ticks(4)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)


  })
}


