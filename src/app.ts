import * as d3 from 'd3';
import * as _proj4 from 'proj4';

let proj4 = (_proj4 as any).default;

export class App {

  mapData: any = null;

  constructor(mapData) {
    this.mapData = mapData;
  }

}

let app: App = null;
//
// Projection Stuff
//
const epsg32632 = proj4("PROJCS[\"WGS 84 / UTM zone 32N\",GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.01745329251994328,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",0],PARAMETER[\"central_meridian\",9],PARAMETER[\"scale_factor\",0.9996],PARAMETER[\"false_easting\",500000],PARAMETER[\"false_northing\",0],AUTHORITY[\"EPSG\",\"32632\"],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH]]");

const project: any = function (lambda, phi) {
  return epsg32632
    .forward([lambda, phi].map(radiansToDegrees));
};

project.invert = function (x, y) {
  return epsg32632
    .inverse([x, y]).map(degreesToRadians);
};

const projection = d3.geoProjection(project)
  .scale(500)
  .center([12.0, 53.0])
  .translate([500 / 2, 500 / 2]);

const path = d3.geoPath()
  .projection(projection);

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

function fitProjection(geometry, width, height) {
  console.log("projection", projection);
  projection
    .scale(1)
    .translate([0, 0]);

  const b = path.bounds(geometry),
    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t: any = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
    .scale(s)
    .translate(t);
}

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

  fitProjection(app.mapData, innerWidth, innerHeight);

  const width = innerWidth;
  const height = innerHeight;

  const svg = targetElement.append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .on("wheel.zoom", function () {
      const ZOOM_FACTOR = 0.000005;
      const ZOOM_IN_LIMIT = 0.001;
      const ZOOM_OUT_LIMIT = 0.00006;
      const currScale = projection.scale();
      let newScale = currScale - ZOOM_FACTOR * d3.event.deltaY;
      if(d3.event.deltaY < 0){
        newScale = Math.min(ZOOM_IN_LIMIT, newScale);
      }else{
        newScale = Math.max(ZOOM_OUT_LIMIT, newScale);
      }
      const currTranslate = projection.translate();
      const coords = projection.invert([d3.event.offsetX, d3.event.offsetY]);
      projection.scale(newScale);
      const newPos = projection(coords);

      projection.translate([currTranslate[0] + (d3.event.offsetX - newPos[0]), currTranslate[1] + (d3.event.offsetY - newPos[1])]);
      g.selectAll("path").attr("d", path);

    })
    .call(d3.drag().on("drag", function () {
      const currTranslate = projection.translate();
      projection.translate([currTranslate[0] + d3.event.dx,
                            currTranslate[1] + d3.event.dy]);
      g.selectAll("path").attr("d", path);
    }));
  //   .call(d3.zoom()
  //     .scaleExtent([1, 40])
  //     .translateExtent([[-100, -100], [width + 90, height + 100]])
  //     .on("zoom", zoomed));
  //
  // function zoomed(){
  //   g.attr("transform", d3.event.transform)
  // }

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