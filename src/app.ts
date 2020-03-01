import * as d3 from 'd3';
import {fitToProjection, project} from './projection-util';

export class App {

  mapData: any = null;

  constructor(mapData) {
    this.mapData = mapData;
  }

}

let projection = d3.geoProjection(project)
  .scale(500)
  .center([12.0, 53.0])
  .translate([500 / 2, 500 / 2]);

const path = d3.geoPath()
  .projection(projection);

let app: App = null;

d3.json("/esc-countries-wgs84.geojson").then((data) => {
  console.log("data", data);
  app = new App(data);
  drawCharts();
  window.addEventListener("resize", drawCharts);
});

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

  fitToProjection(path, projection, app.mapData, innerWidth, innerHeight);

  const width = innerWidth;
  const height = innerHeight;

  const svg = targetElement.append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .call(d3.zoom()).on("wheel.zoom", zoomFunction)
    .call(d3.drag().on("drag", panFunction));

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#0077be");

  console.log("app.mapData.features", app.mapData.features);

  g.selectAll(".com")
    .data(app.mapData.features)
    .enter()
    .append("path")
    .attr("id", "state-borders")
    .attr("d", path)
    .style("fill", "#4a6170")
    .style("stroke", "#fff");

}

function zoomFunction() {
  let g = d3.select(this);
  const ZOOM_FACTOR = 0.000005;
  const ZOOM_IN_LIMIT = 0.001;
  const ZOOM_OUT_LIMIT = 0.00006;
  const currScale = projection.scale();
  let newScale = currScale - ZOOM_FACTOR * d3.event.deltaY;
  if (d3.event.deltaY < 0) {
    newScale = Math.min(ZOOM_IN_LIMIT, newScale);
  }
  else {
    newScale = Math.max(ZOOM_OUT_LIMIT, newScale);
  }
  const currTranslate = projection.translate();
  const coords = projection.invert([d3.event.offsetX, d3.event.offsetY]);
  projection.scale(newScale);
  const newPos = projection(coords);

  projection.translate([currTranslate[0] + (d3.event.offsetX - newPos[0]), currTranslate[1] + (d3.event.offsetY - newPos[1])]);
  g.selectAll("path").attr("d", path);
}

function panFunction() {
  let g = d3.select(this);
  const currTranslate = projection.translate();
  projection.translate([currTranslate[0] + d3.event.dx,
                        currTranslate[1] + d3.event.dy]);
  g.selectAll("path").attr("d", path);
}