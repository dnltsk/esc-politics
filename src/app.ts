import * as d3 from 'd3';
import {Map} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";
import {EventBus} from "./event-bus";

export class App {

  eventBus: EventBus;

  constructor() {
    this.eventBus = new EventBus();
    d3.json("data/esc-countries.geojson").then((mapData: FeatureCollection<Polygon, CountryProperties>) => {
      console.log("LOADED!", mapData);
      this.initMaps(mapData);
    });
  }

  public initMaps(mapData: FeatureCollection<Polygon, CountryProperties>) {
    const ul = new Map(this.eventBus, mapData, d3.select(".ul"));
    const ur = new Map(this.eventBus, mapData, d3.select(".ur"));
    const ll = new Map(this.eventBus, mapData, d3.select(".ll"));
    const lr = new Map(this.eventBus, mapData, d3.select(".lr"));
    this.eventBus.maps = [ul, ur, ll, lr];
  }

}

const app = new App();

window.addEventListener('resize', function (e) {
  app.eventBus.sendResize();
}, false);
