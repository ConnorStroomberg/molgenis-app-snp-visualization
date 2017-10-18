import jquery from 'jquery-slim'
// const arc = 2 * Math.PI

// Max position per chromosome, used to determine plot domain on x axis, Min position is always 0
const maxPositionMap = {
  '1': 249250621,
  '2': 243199373,
  '3': 198022430,
  '4': 191154276,
  '5': 180915260,
  '6': 171115067,
  '7': 159138663,
  '8': 146364022,
  '9': 141213431,
  '10': 135534747,
  '11': 135006516,
  '12': 133851895,
  '13': 115169878,
  '14': 107349540,
  '15': 102531392,
  '16': 90354753,
  '17': 81195210,
  '18': 78077248,
  '19': 59128983,
  '20': 63025520,
  '21': 48129895,
  '22': 51304566,
  'X': 155270560,
  'Y': 59373566
}

// function plot (plotId, data, yOffset, svgElement, plotSizes, plotTitle) {
//   const points = data[plotId].points
//   const counts = data[plotId].counts
//
//   const timestamp = buildTimeStamp()
//   const x = d3.scaleLinear(x).range([0, plotSizes.plotWidth])
//   const y = d3.scaleLinear(y).range([plotSizes.plotHeight, 0])
//
//   x.domain([0, plotSizes.maximunPostion])
//   y.domain([0, 2])
//
//   let plotContainer = svgElement.append('svg').attr('class', 'plot-container')
//
//   const yAxisLeft = d3.axisLeft(y).scale(y)
//     .tickFormat(function (d) {
//       return d
//     }).ticks(2)
//
//   const yAxisRight = d3.axisRight(y).scale(y)
//     .tickFormat(function (d) {
//       return counts[d]
//     }).ticks(2)
//   // draw ibd score counts axis
//   plotContainer.append('g')
//     .attr('transform', `translate(${(parseInt(plotSizes.plotWidth) + 32)},${yOffset + 50})`)
//     .attr('height', plotSizes.height)
//     .call(yAxisRight)
//   // draw ibd score axis
//   plotContainer.append('g')
//     .attr('transform', `translate(30,${yOffset + 50})`)
//     .attr('height', plotSizes.height)
//     .call(yAxisLeft)
//   // draw title
//   plotContainer.append('text')
//     .attr('x', plotSizes.width / 2)
//     .attr('y', plotSizes.titleOffset + yOffset)
//     .attr('text-anchor', 'middle')
//     .attr('font-family', 'sans-serif')
//     .text(plotTitle)
//   // draw time stamp
//   plotContainer.append('text')
//     .attr('x', plotSizes.plotWidth - 50)
//     .attr('y', plotSizes.titleOffset + yOffset)
//     .style('fill', 'grey')
//     .style('font-size', '10px')
//     .attr('font-family', 'sans-serif')
//     .text(timestamp)
//   // draw border
//   plotContainer.append('rect')
//     .attr('x', 0)
//     .attr('y', yOffset)
//     .attr('height', plotSizes.height)
//     .attr('width', plotSizes.width)
//     .style('fill', 'none')
//     .style('stroke', 'black')
//     .style('stroke-width', 1)
//   // plot data points
//   plotContainer.selectAll('dot').data(points).enter().append('circle')
//     .attr('r', 1)
//     .attr('cx', d => x(d[0]))
//     .attr('cy', d => y(d[1]) + ((Math.random() - 0.5) * 20))
//     .attr('transform', `translate(32,${yOffset + 50})`)
// }

function buildTimeStamp () {
  let currentDate = new Date()
  let minutes = currentDate.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes.toString()
  }
  return currentDate.getDate() + '/' +
    (currentDate.getMonth() + 1) + '/' +
    currentDate.getFullYear() + ' @ ' +
    currentDate.getHours() + ':' +
    minutes
}

// function drawCircle (context, x, y) {
//   // context.beginPath()
//   context.arc(x, y, 2, 0, arc, false)
//   // context.stroke()
//   // context.closePath()
// }

function drawPoint (context, x, y) {
  context.fillRect(x, y, 2, 2) // point as 2 by 2 cube
}

function canvasPlot (plotId, points, yOffset, context, plotSizes, plotTitle, timeStamp) {
  console.log(`plotId: ${plotId}, data, yOffset: ${yOffset}, plotSizes: ${plotSizes}, plotTitle:  ${plotTitle}`)

  const plotXStart = plotSizes.marginLeft + plotSizes.paddingLeft
  const invertedYCorrection = yOffset + plotSizes.height - plotSizes.marginBottom
  const tickLabelOffset = 5
  const axisWidth = 1
  const twoScoreY = invertedYCorrection - (3 * plotSizes.bandDistance + (plotSizes.bandWidth * 0.5))
  const oneScoreY = invertedYCorrection - (2 * plotSizes.bandDistance + (plotSizes.bandWidth * 0.5))
  const zeroScoreY = invertedYCorrection - (plotSizes.bandDistance + (plotSizes.bandWidth * 0.5))
  const ncScoreY = invertedYCorrection - (plotSizes.bandWidth * 0.5)
  console.log(`invertedYCorrection: ${invertedYCorrection}`)
  // draw border
  context.fillStyle = 'black'
  context.strokeRect(plotSizes.marginLeft, yOffset, plotSizes.width, plotSizes.height)

  // draw title
  const plotCenter = Math.floor(plotSizes.plotWidth / 2)
  const textY = yOffset + plotSizes.titleOffset
  context.textAlign = 'center'
  context.font = '12px sans-serif'
  context.fillText(plotTitle, plotCenter, textY)

  // draw time stamp
  const timeStampX = plotSizes.plotWidth - plotSizes.paddingRight
  context.fillStyle = 'grey'
  context.textAlign = 'end'
  context.fillText(timeStamp, timeStampX, textY)

  // draw plot
  context.fillStyle = 'black'
  for (let i = points.length - 1; i >= 0; i--) {
    const position = points[i][0]
    const score = points[i][1] + 1 // plus one to normalize [-1, 2] to [0, 3]
    // console.log(`position: ${position}, score: ${score}`)
    const jitter = (Math.random() - 0.5) * plotSizes.bandWidth
    const x = plotXStart + Math.floor(position * plotSizes.xScale)
    const y = Math.floor(invertedYCorrection - (0.5 * plotSizes.bandWidth) - ((score) * plotSizes.bandDistance) + jitter)
    // console.log(`x: ${x}, y: ${y}`)
    drawPoint(context, x, y)
  }

  // draw left snp score axis
  context.fillStyle = 'grey'
  const axisLength = 3 * plotSizes.bandDistance + plotSizes.bandWidth
  const leftAxisYStart = invertedYCorrection - axisLength
  const leftTickLabelX = plotXStart - tickLabelOffset
  context.fillRect(plotXStart, leftAxisYStart, axisWidth, axisLength)
  context.textBaseline = 'middle'
  context.textAlign = 'end'
  context.fillRect(leftTickLabelX, twoScoreY, tickLabelOffset, axisWidth)
  context.fillRect(leftTickLabelX, oneScoreY, tickLabelOffset, axisWidth)
  context.fillRect(leftTickLabelX, zeroScoreY, tickLabelOffset, axisWidth)
  context.fillRect(leftTickLabelX, ncScoreY, tickLabelOffset, axisWidth)
  context.fillText('2', leftTickLabelX, twoScoreY)
  context.fillText('1', leftTickLabelX, oneScoreY)
  context.fillText('0', leftTickLabelX, zeroScoreY)
  context.fillText('NC', leftTickLabelX, ncScoreY)
}

export default {
  plotIdentityByDecent (data, dataIndex, plotSizes, selectedChromosome) {
    plotSizes.plotWidth = plotSizes.width * 0.9
    plotSizes.plotHeight = plotSizes.height / 2
    plotSizes.xScale = (plotSizes.width - plotSizes.paddingLeft - plotSizes.paddingRight) / maxPositionMap[selectedChromosome]
    const numberOfCombinations = Object.keys(dataIndex).length
    const timeStamp = buildTimeStamp()
    const canvas = document.getElementById('plot-canvas')
    canvas.width = plotSizes.width + plotSizes.marginLeft + plotSizes.marginRight
    canvas.height = ((plotSizes.height + plotSizes.marginBottom) * numberOfCombinations) + 120
    const context = canvas.getContext('2d')
    let yOffset = 70

    for (let plotId in dataIndex) {
      const geneColumnNr1 = dataIndex[plotId].gPosColumnNr1
      const geneColumnNr2 = dataIndex[plotId].gPosColumnNr2
      const plotTitle = `Chromosome ${selectedChromosome}: ${plotId} (${geneColumnNr1}-${geneColumnNr2})`
      // plot(plotId, data, yOffset, svgElement, plotSizes, plotTitle)
      canvasPlot(plotId, data[plotId].points, yOffset, context, plotSizes, plotTitle, timeStamp)
      yOffset += plotSizes.height + plotSizes.marginBottom
    }
  },
  clear () {
    jquery('#plot-canvas').remove()
    jquery('#canvas-container').append('<canvas id="plot-canvas"></canvas>')
  },
  buildTimeStamp
}
