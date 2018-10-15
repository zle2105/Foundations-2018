import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 800 - margin.top - margin.bottom
var width = 980 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 200 

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([0, radius])

  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))
  .angle(d => angleScale(d.month_name))
  .curve(d3.curveBasis)

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))


function ready(datapoints) {
    datapoints.push(datapoints[0])

    var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

    holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'red')
    .attr('opacity', 0.5)
    .attr('stroke', 'red')

    let bands = [10, 20, 30, 40, 50, 60, 70, 80, 90]

    holder
      .selectAll('.scale-band')
      .data(bands)
      .enter()
      .append('circle')
      .attr('r', d => radiusScale(d))
      .attr('fill', 'none')
      .attr('stroke', 'lightgrey')
      .attr('cx', 0)
      .attr('cy', 0)
      .lower()

    holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)

    holder
    .append('text')
    .text('NYC TEMP')
    .attr("font-weight", "600")
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)
    .attr('y', centroid)
  }
  
