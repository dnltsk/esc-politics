import * as d3 from 'd3';
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties, EscTimeseries} from "./types";
import {EventBus} from "./event-bus";
import {Controls} from "./controls";
import {ReceivedCompleteMap} from "./map/received-complete-map";
import {ReceivedJuryMap} from "./map/received-jury-map";
import {ReceivedTeleMap} from "./map/received-tele-map";
import {GivenCompleteMap} from "./map/given-complete-map";
import {GivenJuryMap} from "./map/given-jury-map";
import {GivenTeleMap} from "./map/given-tele-map";
import {MapSwapper} from "./map-swapper";

export class App {

  initialYear = 2016;
  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>;
  escTimeseries: EscTimeseries;

  constructor() {
    this.fetchData().then(() => {
      this.eventBus = new EventBus();
      this.eventBus.mapSwapper = new MapSwapper(this.initialYear);
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
    const ul = new ReceivedJuryMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".ul-map-container"), this.initialYear);
    const ll = new GivenJuryMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".ll-map-container"), this.initialYear);
    const uc = new ReceivedCompleteMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".uc-map-container"), this.initialYear);
    const lc = new GivenCompleteMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".lc-map-container"), this.initialYear);
    const ur = new ReceivedTeleMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".ur-map-container"), this.initialYear);
    const lr = new GivenTeleMap(this.eventBus, this.mapData, this.escTimeseries, d3.select(".lr-map-container"), this.initialYear);
    this.eventBus.maps = [ul, ll, uc, lc, ur, lr];
  }


}

new App();
