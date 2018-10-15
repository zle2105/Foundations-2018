import * as d3 from 'd3'

let margin = { top: 30, left: 80, right: 30, bottom: 30 }
let height = 400 - margin.top - margin.bottom
let width = 2080 - margin.left - margin.right

let svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 90

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
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
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var xPositionScale = d3.scaleBand().range([0, width])

var colorScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range(['lightblue', 'pink'])

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

/// what does this do?
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  console.log('nested looks like', nested)

  var names = nested.map(d => d.key)

  xPositionScale.domain(names)

  var holder = svg.append('g').attr('transform', 'translate(0,0)')

  holder
    .selectAll('.bar-multiple')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'bar-multiple')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('transform', function(d) {
      return `translate(${xPositionScale(d.key)}, 100)`
    })
    .each(function(d) {
      let container = d3.select(this)

      container
        .selectAll('path')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(+d.low_temp))

      container
        .selectAll('text')
        .data(d.values)
        .enter()
        .append('text')
        .text(function(d) {
          return d.city
        })
        .attr('x', 0)
        .attr('y', radius + 10)
        .attr('text-anchor', 'middle')

      let bands = [10, 20, 30, 40, 50, 60, 70]

      /// TEXT PART
    })
}
