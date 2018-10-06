import * as d3 from 'd3'


var margin = { top: 45, left: 45, right: 35, bottom: 30 }

var height = 500 - margin.top - margin.bottom

var width = 300 - margin.left - margin.right

var container = d3.select('#chart-3')


var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])


var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.income)
  })


Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function

function ready([datapoints, datapointsUSA]) {
  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints)

var nested_usa = d3 
      .nest()
      .key(d => d.country)
      .entries(datapointsUSA)


  container
    .selectAll('.countryz')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'countryz')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)
      console.log(d.values)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', 'red')
        .attr('stroke-width', 4)
        .attr('fill', 'none')

      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('stroke', 'grey')
        .attr('stroke-width', 4)
        .attr('fill', 'none')

      svg
        .append('text')
        .datum(datapointsUSA)
        .text('US')
        .attr('x', width /2 )
        .attr('y', height - 155)
        .attr('font-size', 30)
        .attr('fill', 'grey')
 

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 1)
        .attr('fill', 'red')
        .attr('font-size', 40)
        .attr('text-anchor', 'middle')
      
      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickSize(-height)
        .tickFormat(d3.format('d'))
      svg
        .append('g')
        .attr('class', ' x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.tickValues([1980, 1990, 2000, 2010]))
     
      svg.select('.x-axis .domain').remove()

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([5000, 10000, 15000, 20000])
        .tickFormat(d3.format('$,d'))
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.tickValues([5000, 10000, 15000, 20000]))
   
      svg.select('.y-axis .domain').remove()
    })
}
