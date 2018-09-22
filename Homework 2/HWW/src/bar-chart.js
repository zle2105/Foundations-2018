import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const heightScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, height])

d3.csv(require('./countries.csv')).then(ready)

d3.select('#Asiabutton').on('click', function() {
  svg.selectAll('rect').attr('fill', function(d) {
    if (d.continent == 'Asia') {
      return 'green'
    } else {
      return 'grey'
    }
  })
})

d3.select('#Africabutton').on('click', function() {
  svg.selectAll('rect').attr('fill', function(d) {
    if (d.continent == 'Africa') {
      return 'blue'
    } else {
      return 'grey'
    }
  })
})

d3.select('#Northbutton').on('click', function() {
  svg.selectAll('rect').attr('fill', function(d) {
    if (d.continent == 'N. America') {
      return 'yellow'
    } else {
      return 'grey'
    }
  })
})

d3.select('#Lowbutton').on('click', function() {
  svg.selectAll('rect').attr('fill', function(d) {
    if (d.gdp_per_capita < 5000) {
      return 'orange'
    } else {
      return 'grey'
    }
  })
})

d3.select('#Continentbutton').on('click', function() {
  svg.selectAll('rect').attr('fill', function(d) {
    if (d.continent == 'N. America') {
      return 'yellow'
     } if (d.continent == 'Africa') {
      return 'blue'
     } if (d.continent == 'Asia') {
       return 'green'
    } else {
      return 'grey'
    }
  })
})

d3.select('#Resetbutton').on('click', function() {
  svg.selectAll('rect').attr('fill', 'white')
})

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */

 
svg.selectAll("rect").data(datapoints)
.enter()
.append("rect")
.attr("width", width/200)
.attr("height", function(d){
  return heightScale(d.life_expectancy)
})
.attr("x", function(d){
  return xPositionScale(d.country)
})
.attr("y", function(d){
  return yPositionScale(d.life_expectancy)
})



const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()
  
 d3.select('.y-axis .domain').remove()

}