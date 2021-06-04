import { useEffect } from "react";
import * as d3 from "d3";

const PieChart = (props) => {
  const { width, height } = props;
  const radius = Math.min(width, height) / 2;

  const totalCrimes = props.data.map((d) => d.value).reduce((a, b) => a + b, 0);

  const percFormat = d3.format("." + d3.precisionFixed(0.1) + "%");

  const color = d3
    .scaleOrdinal()
    .domain(props.data.map((d) => d.name))
    .range(
      d3
        .quantize(
          (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
          props.data.length
        )
        .reverse()
    );

  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  var arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 1.0);

  useEffect(() => {
    d3.selectAll("svg").remove();

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const data = pie(props.data);

    svg
      .append("text")
      .attr("width", 100)
      .attr("height", 40)
      .attr("transform", "translate(-" + 0 + "," + -15 + ")")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Total crimes");

    svg
      .append("text")
      .attr("width", 100)
      .attr("height", 40)
      .attr("transform", "translate(-" + 0 + "," + 15 + ")")
      .style("text-anchor", "middle")
      .style("font-size", "24px")
      .text(totalCrimes.toString());

    svg
      .selectAll("allSlices")
      .data(data)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.name))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("allPolylines")
      .data(data)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", (d) => {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      });

    svg
      .selectAll("allLabels")
      .data(data)
      .enter()
      .append("text")
      .style("font-size", "12px")
      .text(
        (d) =>
          `${props.categories[d.data.name]} ${percFormat(
            d.value / totalCrimes
          )}`
      )
      .attr("transform", (d) => {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", (d) => {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }, [props]);

  return <div id="chart" />;
};

export default PieChart;
