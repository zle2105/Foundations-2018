import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoMercator()
let graticule = d3.geoGraticule()
let path = d3.geoPath().projection(projection)

let colorScale = d3
  .scaleSequential(d3.interpolateCool)
  .domain([0, 100000])
  .clamp(true)

Promise.all([
  d3.json(require('./data/world.topojson')),
  d3.csv(require('./data/world-cities.csv'))
])
  .then(ready)
  .catch(err => console.log('Fail', err))

function ready([json, datapoints]) {
  let country = topojson.feature(json, json.objects.countries)

  svg
    .selectAll('.country')
    .data(country.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'black')
    .attr('stroke', 'white')

  svg
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'white')
    .lower()

  svg
    .append('rect')
    .attr('height', height)
    .attr('width', width)
    .attr('fill', 'black')
    .lower()

  svg
    .selectAll('.cities')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', 1.5)
    .attr('fill', d => colorScale(d.population))
    .attr('transform', d => {
      let coords = projection([d.lng, d.lat])
      return `translate(${coords})`
    })
}
