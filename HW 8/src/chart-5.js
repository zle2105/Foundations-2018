import * as d3 from 'd3'

var margin = { top: 30, left: 100, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

let bands = [20, 40, 60, 80, 100]

let labels = ['20', '60', '100']

let radius = 70

let radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([radius / 2, radius])

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .outerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })
  .curve(d3.curveBasis)

let xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  var names = nested.map(d => d.key)
  xPositionScale.domain(names)


  svg
    .selectAll('.ringz')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'ringz')
    .attr('transform', d => {
      return 'translate(' + xPositionScale(d.key) + ',' + height/2 + ')'
    })
    .each(function(d) {
      var holder = d3.select(this)
      d.values.push(d.values[0])

     
      holder
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('fill', 'pink')
        .attr('opacity', 0.75)
        .attr('stroke', 'none')

      
     holder
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke-width', 0.5)
        .attr('stroke', 'grey')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      // add the labels to the scale
      holder
        .selectAll('.scale-text')
        .data(labels)
        .enter()
        .append('text')
        .text(d => {
          return d + '°'
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', 8)
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)

      // add city names
      holder
        .append('text')
        .text(d => d.key)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-weight', 600)
        .attr('font-size', 15)
    })
  svg
    .append('text')
    .text('Average Monthly temperatures')
    .attr('font-size', 30)
    .attr('font-weight', 600)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('x', width/2)

  svg
    .append('text')
    .text('in cities around the world')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('x', width/2)
    .attr('dy', 25)

}
