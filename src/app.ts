import * as d3 from 'd3';
import {drawChart} from "./map";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";

export class App {

  mapData: FeatureCollection<Polygon, CountryProperties> = null;

  constructor() {
    d3.json("data/esc-countries.geojson").then((data) => {
      console.log("LOADED!", data);
      this.mapData = data;
      this.drawCharts();
    });
  }

  public drawCharts() {
    drawChart(d3.select(".ul"), this.mapData);
    drawChart(d3.select(".ur"), this.mapData);
    drawChart(d3.select(".ll"), this.mapData);
    drawChart(d3.select(".lr"), this.mapData);
  }

}

const app = new App();

window.addEventListener('resize', function () {
  app.drawCharts()
}, false);
