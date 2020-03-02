import {fitToProjection, project} from "./projection-util";
import * as d3 from "d3";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";

export class Map {

  readonly projection = d3.geoProjection(project)
    .scale(500)
    .center([12.0, 53.0])
    .translate([500 / 2, 500 / 2]);

  readonly path = d3.geoPath()
    .projection(this.projection);

  mapData: FeatureCollection<Polygon, CountryProperties>;
  targetElement: d3.Selection<HTMLElement, {}, HTMLElement, any>;
  g: d3.Selection<SVGElement, {}, HTMLElement, any>;

  constructor(mapData, targetElement: d3.Selection<HTMLElement, {}, HTMLElement, any>) {
    this.mapData = mapData;
    this.targetElement = targetElement;
    this.initMap();
  }

  public resize() {
    const innerWidth = this.targetElement.node().clientWidth,
      innerHeight = this.targetElement.node().clientHeight;

    fitToProjection(this.path, this.projection, this.mapData, innerWidth, innerHeight);

    this.g.selectAll("countries")
      .data(this.mapData.features)
      .enter()
      .selectAll("path")
      .attr("d", this.path)
  }

  private initMap() {
    this.targetElement.html("");

    const innerWidth = this.targetElement.node().clientWidth,
      innerHeight = this.targetElement.node().clientHeight;

    fitToProjection(this.path, this.projection, this.mapData, innerWidth, innerHeight);

    const svg = this.targetElement.append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    this.g = svg.append("g");

    this.g.call(d3.drag().on("drag",
      (d, i, n) => this.dragFunction(d3.select(n[i])))
    );

    this.g.call(d3.zoom()).on("wheel.zoom",
      (d, i, n) => this.zoomFunction(d3.select(n[i]))
    );

    this.g.append("rect")
      .attr("class", "background")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("fill", "#0077be");

    this.g.selectAll("countries")
      .data(this.mapData.features)
      .enter()
      .append("path")
      .attr("id", "state-borders")
      .attr("d", this.path)
      .style("fill", "#4a6170")
      .style("stroke", "#fff");
  }

  private zoomFunction(g: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    const ZOOM_FACTOR = 0.000005;
    const ZOOM_IN_LIMIT = 0.001;
    const ZOOM_OUT_LIMIT = 0.00006;
    const currScale = this.projection.scale();
    let newScale = currScale - ZOOM_FACTOR * d3.event.deltaY;
    if (d3.event.deltaY < 0) {
      newScale = Math.min(ZOOM_IN_LIMIT, newScale);
    }
    else {
      newScale = Math.max(ZOOM_OUT_LIMIT, newScale);
    }
    const currTranslate = this.projection.translate();
    const coords = this.projection.invert([d3.event.offsetX, d3.event.offsetY]);
    this.projection.scale(newScale);
    const newPos = this.projection(coords);

    this.projection.translate([currTranslate[0] + (d3.event.offsetX - newPos[0]), currTranslate[1] + (d3.event.offsetY - newPos[1])]);
    g.selectAll("path").attr("d", this.path);
  }

  private dragFunction(g: d3.Selection<Element, {}, HTMLElement, any>) {
    const currTranslate = this.projection.translate();
    this.projection.translate([currTranslate[0] + d3.event.dx,
                               currTranslate[1] + d3.event.dy]);
    g.selectAll("path").attr("d", this.path);
  }

}
