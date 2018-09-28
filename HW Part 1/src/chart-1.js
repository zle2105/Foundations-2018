import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 30, left: 50, right: 100, bottom: 30 }

var height = 600 - margin.top - margin.bottom

var width = 600 - margin.left - margin.right

// Add your svg

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)

var parseTime = d3.timeParse('%B-%y')

// Create your scales

var xPositionScale = d3.scaleLinear().range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

//ColorScale

var colorScale = d3
  .scaleOrdinal()
  .range([
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'yellow'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data

d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Write your ready function

function ready(datapoints) {
  datapoints.forEach(d => (d.datetime = parseTime(d.month)))

  // Convert your months to dates

  // Get a list of dates and a list of prices

  var datetimes = datapoints.map(d => d.datetime)

  var prices = datapoints.map(d => d.price)

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  // Draw your lines

  xPositionScale.domain(d3.extent(datetimes))
  yPositionScale.domain(d3.extent(prices))

  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('d', d => line(d.values))
    .attr('fill', 'none')
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 3)
    .lower()

  //QUESTION:Why doesnt d.region go here when it relates back to the color scale?
  //QUESITON: Why not use g to organize the circles?
svg
  .selectAll('.end-circles')
  .data(nested)
  .enter()
  .append('circle')
  .attr('class', 'end-circles' )
  .attr('r', 2)
  .attr('cx', d => xPositionScale(d.values[0].datetime))
  .attr('cy', d => yPositionScale(d.values[0].price))
  .attr('fill', 'black')

  // Add your text on the right-hand side

  svg
  .selectAll('.right-text')
  .data(nested)
  .enter()
  .append('text')
  .text(d => d.key)
  .attr('font-size', 6)
  .attr('x', d => xPositionScale(d.values[0].datetime) +5 )
  .attr('y', d => yPositionScale(d.values[0].price))
  .attr('alignment-baseline', 'middle')
  .attr('text-anchor', 'start')
  
  
  //QUESTION: Why is this d.key and not d.region?
  //IF I do something wrong why does axis dissapear 
  // Add your title
svg
.append('text')
.attr('x', width / 2)
.attr('dx', 10)
.attr('y', margin.top - 40)
.attr('text-anchor', 'middle')
.attr('font-size', 20)
.text('U.S. housing prices fall in winter')
  // Add the shaded rectangle

svg
.append('rect')
.attr('height', height)
.attr('width', (width/ (datetimes.length / 10)) * 2)
.attr('x', xPositionScale(parseTime('December-16')))
.attr('y', 0)
.lower()

  //QUEStioN: IS there an easier way than datetimes.length
  // Add your axes

  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
