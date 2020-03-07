import * as d3 from 'd3';
import {Map} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";
import {EventBus} from "./event-bus";
import {allYears} from "./scripts/config";

export class App {

  eventBus: EventBus;
  selectedYear = 2014;

  constructor() {
    this.eventBus = new EventBus();
    d3.json("data/esc-countries-enriched.geojson").then((mapData: FeatureCollection<Polygon, CountryProperties>) => {
      console.log("LOADED!", mapData);
      this.initMaps(mapData);
      this.initControlls();
    });
  }

  private initMaps(mapData: FeatureCollection<Polygon, CountryProperties>) {
    const ul = new Map(this.eventBus, mapData, d3.select(".ul-map"), this.selectedYear);
    const ur = new Map(this.eventBus, mapData, d3.select(".ur-map"), this.selectedYear);
    const ll = new Map(this.eventBus, mapData, d3.select(".ll-map"), this.selectedYear);
    const lr = new Map(this.eventBus, mapData, d3.select(".lr-map"), this.selectedYear);
    this.eventBus.maps = [ul, ur, ll, lr];
  }

  private initControlls() {
    d3.select("#yearSlider")
      .attr("min", d3.min(allYears))
      .attr("max", d3.max(allYears))
      .attr("value", this.selectedYear)
      .on("input", (d, i, n: Array<HTMLInputElement>) => {
        let year = parseInt(n[i].value);
        d3.select("#yearSelection").text(year);
        this.eventBus.sendYear(year)
      });
  }

}

const app = new App();
