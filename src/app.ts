import * as d3 from 'd3';
import {Map} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";
import {EventBus} from "./event-bus";
import {Controls} from "./controls";

export class App {

  eventBus: EventBus;
  initialYear = 2014;

  constructor() {
    this.eventBus = new EventBus();

    d3.json("data/esc-countries-enriched.geojson").then((mapData: FeatureCollection<Polygon, CountryProperties>) => {
      console.log("LOADED!", mapData);
      this.eventBus.controls = new Controls(this.eventBus, mapData, this.initialYear);
      this.initMaps(mapData);
    });
  }

  private initMaps(mapData: FeatureCollection<Polygon, CountryProperties>) {
    const ul = new Map(this.eventBus, mapData, d3.select(".ul-map"), this.initialYear);
    const ur = new Map(this.eventBus, mapData, d3.select(".ur-map"), this.initialYear);
    const ll = new Map(this.eventBus, mapData, d3.select(".ll-map"), this.initialYear);
    const lr = new Map(this.eventBus, mapData, d3.select(".lr-map"), this.initialYear);
    this.eventBus.maps = [ul, ur, ll, lr];
  }

}

const app = new App();
