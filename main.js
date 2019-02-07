d3.json("global-temperature.json").then(data => {

  const margin = { top: 20, right: 140, bottom: 20, left: 80 };

  const svgWidth = 1350, svgHeight = 500;
  const contentWidth = svgWidth - margin.left - margin.right,
    contentHeight = svgHeight - margin.top - margin.bottom;

  const titleHeight = 50;/*height of title and subtitle*/


  const dataset = data.monthlyVariance;

  const baseTemp = data.baseTemperature;

  const yearArr = dataset.map(e => e.year);
  const minYear = d3.min(yearArr), maxYear = d3.max(yearArr);
  const xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, contentWidth + margin.left]);

  const yScale = d3.scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .range([margin.top, margin.top + contentHeight]);

  const colorScale = d3.scaleThreshold()
    .domain([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
    .range(["rgb(49, 54, 149)", "rgb(69, 117, 180)", "rgb(116, 173, 209)", "rgb(171, 217, 233)", "rgb(224, 243, 248)",
      "rgb(255, 255, 191)", "rgb(254, 224, 144)", "rgb(253, 174, 97)", "rgb(244, 109, 67)", "rgb(215, 48, 39)", "rgb(165, 0, 38)"]);

  const barWidth = contentWidth / (maxYear - minYear + 1);
  const barHeight = contentHeight / 12;

  d3.select('#min-year').text(minYear);
  d3.select('#max-year').text(maxYear);
  d3.select('#base-temp').text(baseTemp);

  const svg = d3.select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .classed('cell', true)
    .attr('fill', d => colorScale(baseTemp + d.variance))
    .attr('width', barWidth)
    .attr('height', barHeight)
    .attr('x', d => xScale(d.year))
    .attr('y', d => yScale(d.month))
    .attr('data-month', d => d.month - 1)//for FCC test
    .attr('data-year', d => d.year)//for FCC test
    .attr('data-temp', d => baseTemp + d.variance)//for FCC test
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke", "black");

      //Get this bar's x/y values, then augment for the tooltip
      var xPosition = parseInt(d3.select(this).attr("x")) - margin.left / 2;
      var yPosition = parseInt(d3.select(this).attr("y"));
      //Update the tooltip position and value
      const tooltip = d3.select("#tooltip")
        .attr("data-year", d.year)//for FCC test
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      tooltip.select("#time").text(d.year + " - " + monthArr[d.month - 1]);
      tooltip.select("#temp").text((baseTemp + d.variance).toFixed(1) + "℃");
      tooltip.select("#diff").text((d.variance > 0 ? "+" : "") + d.variance.toFixed(1) + "℃");
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("stroke", "none");
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => d);

  svg.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${margin.top + contentHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => monthArr[d - 1]);;

  svg.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left - 1/*in order for the axis not overlapping first year*/}, 0)`)
    .call(yAxis);

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", - svgHeight / 3)
    .attr("font-size", "1.3em")
    .attr("dy", "1.8em")
    .style("text-anchor", "middle")
    .text("Months");

  svg.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${margin.left + contentWidth + 20}, ${margin.top})`);

  var legendOrdinal = d3.legendColor()
    .labels(d3.legendHelpers.thresholdLabels)
    .scale(colorScale);

  svg.select("#legend")
    .call(legendOrdinal);
});

var dopingColor = "#4286f4";
var noDopingColor = "#ff9028";

var getDotColor = d => d.Doping === "" ? noDopingColor : dopingColor;

const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];