import {fitToMap, initFitToMap, project} from "./projection-util";
import * as d3 from "d3";
import {Feature, FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";
import {EventBus} from "./event-bus";

export class Map {

  readonly projection = d3.geoProjection(project)
    .scale(500)
    .center([12.0, 53.0])
    .translate([500 / 2, 500 / 2]);

  readonly path = d3.geoPath()
    .projection(this.projection);

  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>;
  targetElement: d3.Selection<HTMLElement, {}, HTMLElement, any>;
  g: d3.Selection<SVGElement, {}, HTMLElement, any>;

  constructor(eventBus: EventBus, mapData: FeatureCollection<Polygon, CountryProperties>, targetElement: d3.Selection<HTMLElement, {}, HTMLElement, any>) {
    this.eventBus = eventBus;
    this.mapData = mapData;
    this.targetElement = targetElement;
    this.initMap();
  }

  public receiveResize() {
    console.log("resize");
    const innerWidth = this.targetElement.node().clientWidth,
      innerHeight = this.targetElement.node().clientHeight;

    fitToMap(this.path, this.projection, this.mapData, innerWidth, innerHeight);

    this.g.selectAll("countries")
      .data(this.mapData.features)
      .enter()
      .selectAll("path")
      .attr("d", this.path);
  }

  public receiveMouseover(ADM0_A3: string) {
    this.g.selectAll("." + ADM0_A3).classed("selected", true);
  }

  public receiveMouseout(ADM0_A3: string) {
    this.g.selectAll("." + ADM0_A3).classed("selected", false);
  }

  public receiveZoom(scale: number, translate: [number, number]){
    this.projection
      .scale(scale)
      .translate(translate);
    this.g.selectAll("path").attr("d", this.path);
  }

  public receiveDrag(translate: [number, number]) {
    this.projection.translate(translate);
    this.g.selectAll("path").attr("d", this.path);
  }

  private initMap() {

    const innerWidth = this.targetElement.node().clientWidth,
      innerHeight = this.targetElement.node().clientHeight;

    initFitToMap(this.path, this.projection, this.mapData, innerWidth, innerHeight);

    const svg = this.targetElement.append("svg")
      .attr("width", "95%")
      .attr("height", "95%");

    this.g = svg.append("g");

    this.g.call(d3.drag().on("drag",
      (d, i, n) => this.drag(d3.select(n[i])))
    );

    this.g.call(d3.zoom()).on("wheel.zoom",
      (d, i, n) => this.zoom(d3.select(n[i]))
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
      .classed("country", true)
      .each(function (d) {
        this.classList.add(d.properties.ADM0_A3);
      })
      .attr("d", this.path)
      .on("mouseover", (d, i, n) => {
        this.localMouseover(d, d3.select(n[i]));
      })
      .on("mouseout", (d, i, n) => {
        this.localMouseout(d, d3.select(n[i]));
      });
  }

  private localMouseover(geom: Feature<Polygon, CountryProperties>, path: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.eventBus.sendMouseover(geom.properties.ADM0_A3);
  }

  private localMouseout(geom: Feature<Polygon, CountryProperties>, path: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.eventBus.sendMouseout(geom.properties.ADM0_A3);
  }

  private zoom(g: d3.Selection<SVGElement, {}, HTMLElement, any>) {
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

    const translate: [number, number] = [currTranslate[0] + (d3.event.offsetX - newPos[0]), currTranslate[1] + (d3.event.offsetY - newPos[1])];

    this.eventBus.sendZoom(newScale, translate);
  }

  private drag(g: d3.Selection<Element, {}, HTMLElement, any>) {
    const currTranslate = this.projection.translate();
    const translate: [number, number] = [currTranslate[0] + d3.event.dx, currTranslate[1] + d3.event.dy];
    this.eventBus.sendDrag(translate);
  }

}
