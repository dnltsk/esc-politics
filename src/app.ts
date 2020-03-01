import * as d3 from 'd3';
import {Map} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";

export class App {

  mapData: FeatureCollection<Polygon, CountryProperties> = null;

  map = new Map();

  constructor() {
    d3.json("data/esc-countries.geojson").then((data) => {
      console.log("LOADED!", data);
      this.mapData = data;
      this.drawCharts();
    });
  }

  public drawCharts() {
    this.map.drawChart(d3.select(".ul"), this.mapData);
    this.map.drawChart(d3.select(".ur"), this.mapData);
    this.map.drawChart(d3.select(".ll"), this.mapData);
    this.map.drawChart(d3.select(".lr"), this.mapData);
  }

}

const app = new App();

window.addEventListener('resize', function () {
  app.drawCharts()
}, false);
