import {fitToMap, initFitToMap, project} from "../projection-util";
import * as d3 from "d3";
import {Feature, FeatureCollection, Polygon} from "geojson";
import {CountryCode, CountryProperties, EscTimeseries} from "../types";
import {EventBus} from "../event-bus";
import {separatedPointsSince} from "../scripts/config";

export abstract class Map {

  readonly projection = d3.geoProjection(project);

  readonly path = d3.geoPath()
    .projection(this.projection);

  readonly fillColorScale24 = d3.scaleSequential(d3["interpolateYlOrRd"]).domain([0, 24]);
  readonly fillColorScale12 = d3.scaleSequential(d3["interpolateYlOrRd"]).domain([0, 12]);

  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>;
  escTimeseries: EscTimeseries;
  targetElement: d3.Selection<HTMLElement, {}, HTMLElement, any>;
  selectedYear: number;
  selectedCountry: CountryCode;

  g: d3.Selection<SVGElement, {}, HTMLElement, any>;

  constructor(
    eventBus: EventBus,
    mapData: FeatureCollection<Polygon, CountryProperties>,
    escTimeseries: EscTimeseries,
    targetElement: d3.Selection<HTMLElement, {}, HTMLElement, any>,
    initialYear: number
  ) {
    this.eventBus = eventBus;
    this.mapData = mapData;
    this.escTimeseries = escTimeseries;
    this.targetElement = targetElement;
    this.selectedYear = initialYear;
    this.selectedCountry = CountryCode.DE;
    this.initMap();
  }

  abstract getFillColor(d: Feature<Polygon, CountryProperties>): string;

  abstract isNavigationStopped(): boolean;

  public receiveYear(year: number) {
    this.selectedYear = year;
    this.redrawMap();
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
      .style("fill", (d) => {
        if (d.properties.ISO_A2 === this.selectedCountry) {
          return "black";
        }
        return this.getFillColor(d);
      })
      .each(function (d) {
        this.classList.add(d.properties.ISO_A2);
      })
      .attr("d", this.path)
      .on("mouseover", (d, i, n) => {
        this.localMouseover(d, d3.select(n[i]));
      })
      .on("mouseout", (d, i, n) => {
        this.localMouseout(d, d3.select(n[i]));
      });
  }

  protected whiteOrColor(points: number): string {
    if (points == null || points == 0) {
      return "white";
    }
    return this.getColorScale()(points);
  }

  protected getColorScale(): d3.ScaleSequential<string> {
    if (this.selectedYear <= separatedPointsSince) {
      return this.fillColorScale12;
    }
    return this.fillColorScale24;
  }

  private redrawMap() {
    this.g.selectAll("countries")
      .data(this.mapData.features)
      .enter()
      .selectAll("path")
      .style("fill", (d: Feature<Polygon, CountryProperties>) => {
        if (d.properties.ISO_A2 === this.selectedCountry) {
          return "black";
        }
        return this.getFillColor(d);
      });
  }

  public receiveResize() {
    console.log("resize");
    const innerWidth = this.targetElement.node().clientWidth,
      innerHeight = this.targetElement.node().clientHeight;

    fitToMap(this.path, this.projection, this.mapData, innerWidth, innerHeight);

    this.redrawMap();
  }

  public receiveMouseover(ISO_A2: CountryCode) {
    this.g.selectAll("." + ISO_A2).classed("selected", true);
    this.selectedCountry = ISO_A2;
    this.redrawMap();
  }

  public receiveMouseout(ISO_A2: CountryCode) {
    this.g.selectAll("." + ISO_A2).classed("selected", false);
  }

  public receiveZoom(scale: number, translate: [number, number]) {
    this.projection
      .scale(scale)
      .translate(translate);
    this.g.selectAll("path").attr("d", this.path);
  }

  public receiveDrag(translate: [number, number]) {
    this.projection.translate(translate);
    this.g.selectAll("path").attr("d", this.path);
  }

  private localMouseover(geom: Feature<Polygon, CountryProperties>, path: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.eventBus.sendMouseover(geom.properties.ISO_A2);
  }

  private localMouseout(geom: Feature<Polygon, CountryProperties>, path: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.eventBus.sendMouseout(geom.properties.ISO_A2);
  }

  private drag(g: d3.Selection<Element, {}, HTMLElement, any>) {
    if(this.isNavigationStopped()){
      return
    }
    const currTranslate = this.projection.translate();
    const translate: [number, number] = [currTranslate[0] + d3.event.dx, currTranslate[1] + d3.event.dy];
    this.eventBus.sendDrag(translate);
  }

  private zoom(g: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    console.log("zoom", this.isNavigationStopped());
    if(this.isNavigationStopped()){
      return
    }
    d3.event.preventDefault();//lock body scroll
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
}
