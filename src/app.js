import * as d3 from 'd3'
import * as topojson from 'topojson'

let mapData = null;

(async function () {
  mapData = await d3.json("/data/lim.json");
  drawCharts();
  window.addEventListener("resize", drawCharts);
})();

//
// MAP
//
function drawCharts() {
  drawChart(d3.select(".ul"));
  drawChart(d3.select(".ur"));
  drawChart(d3.select(".ll"));
  drawChart(d3.select(".lr"));
}

function drawChart(targetElement) {
  targetElement.html("");

  const innerWidth = targetElement.node().clientWidth,
    innerHeight = targetElement.node().clientHeight;

  const width = innerWidth;
  const height = innerHeight;

  const projection = d3.geoMercator()
    .scale(5000)
    .center([1.8, 41.9])
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  const svg = targetElement.append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .on("wheel.zoom", function () {
      var currScale = projection.scale();
      var newScale = currScale - 2 * event.deltaY;
      var currTranslate = projection.translate();
      var coords = projection.invert([event.offsetX, event.offsetY]);
      projection.scale(newScale);
      var newPos = projection(coords);

      projection.translate([currTranslate[0] + (event.offsetX - newPos[0]), currTranslate[1] + (event.offsetY - newPos[1])]);
      g.selectAll("path").attr("d", path);

    })
    .call(d3.drag().on("drag", function () {
      var currTranslate = projection.translate();
      projection.translate([currTranslate[0] + d3.event.dx,
                            currTranslate[1] + d3.event.dy]);
      g.selectAll("path").attr("d", path);
    }));

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#fcf4e0");

  g.selectAll(".com")
    .data(topojson.feature(mapData, mapData.objects.limits).features)
    .enter()
    .append("path")
    .attr("id", "state-borders")
    .attr("d", path);

}