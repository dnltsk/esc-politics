import * as d3 from 'd3'
import proj4 from 'proj4'

let mapData = null;

(async function () {
  mapData = await d3.json("/data/esc-countries-wgs84.geojson");
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

  fitProjection(mapData, innerWidth, innerHeight);

  const width = innerWidth;
  const height = innerHeight;

  const svg = targetElement.append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .on("wheel.zoom", function () {
      console.log("event",event);
      var currScale = projection.scale();
      console.log("currScale",currScale);
      var newScale = currScale - 0.000005 * event.deltaY;
      if(event.deltaY < 0){
        console.log("in");
        newScale = Math.min(0.001, newScale);
      }else{
        console.log("out");
        newScale = Math.max(0.00006, newScale);
      }
      console.log("newScale",newScale);
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
    .style("fill", "#0077be");

  g.selectAll(".com")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("id", "state-borders")
    .attr("d", path)
    .style("fill", "#4a6170")
    .style("stroke", "#fff");

}

//
// Projection Stuff
//
const epsg32632 = proj4("PROJCS[\"WGS 84 / UTM zone 32N\",GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.01745329251994328,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",0],PARAMETER[\"central_meridian\",9],PARAMETER[\"scale_factor\",0.9996],PARAMETER[\"false_easting\",500000],PARAMETER[\"false_northing\",0],AUTHORITY[\"EPSG\",\"32632\"],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH]]");

const project = function(lambda, phi) {
  return epsg32632
    .forward([lambda, phi].map(radiansToDegrees));
};

project.invert = function(x, y) {
  return epsg32632
    .inverse([x, y]).map(degreesToRadians);
};

const projection = d3.geoProjection(project)
  .scale(500)
  .center([12.0, 53.0])
  .translate([500 / 2, 500 / 2]);

const path = d3.geoPath()
  .projection(projection);

function degreesToRadians(degrees) { return degrees * Math.PI / 180; }
function radiansToDegrees(radians) { return radians * 180 / Math.PI; }

function fitProjection(geometry, width, height) {
  projection
    .scale(1)
    .translate([0, 0]);

  const b = path.bounds(geometry),
    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
    .scale(s)
    .translate(t);
}