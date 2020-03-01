import * as d3 from 'd3';
import {drawChart} from "./map";
import {FeatureCollection} from "geojson";

export class App {

  mapData: FeatureCollection = null;

  constructor() {
    d3.json("/esc-countries-wgs84.geojson").then((data) => {
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
