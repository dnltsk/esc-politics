import * as d3 from 'd3';
import {Map} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";
import {EventBus} from "./event-bus";
import {Controls} from "./controls";

export class App {

  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>;
  initialYear = 2014;

  constructor() {
    this.fetchData().then(() => {
      this.eventBus = new EventBus();
      this.eventBus.controls = new Controls(this.eventBus, this.mapData, this.initialYear);
      this.initMaps();
    });
  }

  async fetchData() {
    await d3.json("data/esc-countries-enriched.geojson").then((mapData: FeatureCollection<Polygon, CountryProperties>) => {
      console.log("LOADED!", mapData);
      this.mapData = mapData
    });
  }

  private initMaps() {
    const ul = new Map(this.eventBus, this.mapData, d3.select(".ul-map"), this.initialYear);
    const ur = new Map(this.eventBus, this.mapData, d3.select(".ur-map"), this.initialYear);
    const ll = new Map(this.eventBus, this.mapData, d3.select(".ll-map"), this.initialYear);
    const lr = new Map(this.eventBus, this.mapData, d3.select(".lr-map"), this.initialYear);
    this.eventBus.maps = [ul, ur, ll, lr];
  }

}

const app = new App();
