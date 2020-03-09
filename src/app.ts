import * as d3 from 'd3';
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties, EscTimeseries} from "./types";
import {EventBus} from "./event-bus";
import {Controls} from "./controls";
import {ReceivedCompleteMap} from "./map/received-complete-map";
import {ReceivedJuryMap} from "./map/received-jury-map";
import {ReceivedTeleMap} from "./map/received-tele-map";

export class App {

  initialYear = 2016;
  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>;
  escTimeseries: EscTimeseries;

  constructor() {
    this.fetchData().then(() => {
      this.eventBus = new EventBus();
      this.eventBus.controls = new Controls(this.eventBus, this.escTimeseries, this.initialYear);
      this.initMaps();
    });
  }

  async fetchData() {
    await d3.json("data/esc-countries.geojson").then((mapData: FeatureCollection<Polygon, CountryProperties>) => {
      console.log("mapData loaded", mapData);
      this.mapData = mapData
    });
    await d3.json("data/esc-timeseries.json").then((escTimeseries: EscTimeseries) => {
      console.log("escTimeseries loaded", escTimeseries);
      this.escTimeseries = escTimeseries;
    })
  }

  private initMaps() {
    const ul = new ReceivedCompleteMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".ul-map"), this.initialYear);
    const ur = new ReceivedCompleteMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".ur-map"), this.initialYear);
    const ll = new ReceivedJuryMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".ll-map"), this.initialYear);
    const lr = new ReceivedTeleMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".lr-map"), this.initialYear);
    this.eventBus.maps = [ul, ur, ll, lr];
  }

}

new App();
