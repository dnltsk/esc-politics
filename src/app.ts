import * as d3 from 'd3';
import {Map} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";

export class App {

  ul: Map;
  ur: Map;
  ll: Map;
  lr: Map;
  all: Array<Map>;

  constructor() {
    d3.json("data/esc-countries.geojson").then((mapData: FeatureCollection<Polygon, CountryProperties>) => {
      console.log("LOADED!", mapData);
      this.initMaps(mapData);
    });
  }

  public initMaps(mapData: FeatureCollection<Polygon, CountryProperties>) {
    this.ul = new Map(this, mapData, d3.select(".ul"));
    this.ur = new Map(this, mapData, d3.select(".ur"));
    this.ll = new Map(this, mapData, d3.select(".ll"));
    this.lr = new Map(this, mapData, d3.select(".lr"));
    this.all = [this.ul, this.ur, this.ll, this.lr];
  }

  public updateCharts() {
    this.all.forEach((map) => {
      map.resize();
    })
  }

  globalMouseover(ADM0_A3: string) {
    this.all.forEach((map) => {
      map.globalMouseover(ADM0_A3);
    });
  }

  globalMouseout(ADM0_A3: string) {
    this.all.forEach((map) => {
      map.globalMouseout(ADM0_A3);
    });
  }

  globalDrag(translate: [number, number]) {
    this.all.forEach((map) => {
      map.globalDrag(translate);
    });
  }

  globalZoom(newScale: number, translate: [number, number]) {
    this.all.forEach((map) => {
      map.globalScale(newScale, translate);
    });
  }
}

const app = new App();

window.addEventListener('resize', function () {
  app.updateCharts()
}, false);
