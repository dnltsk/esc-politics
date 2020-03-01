import * as d3 from 'd3';
import {drawChart} from "./map";
import {FeatureCollection} from "geojson";

export class App {

  mapData: FeatureCollection = null;

  constructor() {
    d3.json("/esc-countries-wgs84.geojson").then((data) => {
      console.log("data", data);
      this.mapData = data;
      this.drawCharts();
      window.addEventListener("resize", app.drawCharts);
    });
  }

  private drawCharts() {
    drawChart(d3.select(".ul"), this.mapData);
    drawChart(d3.select(".ur"), this.mapData);
    drawChart(d3.select(".ll"), this.mapData);
    drawChart(d3.select(".lr"), this.mapData);
  }

}

const app: App = new App();

