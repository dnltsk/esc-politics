import * as d3 from "d3";
import {allYears} from "./scripts/config";
import {EventBus} from "./event-bus";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";

export class Controls {

  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>

  constructor(eventBus: EventBus, mapData: FeatureCollection<Polygon, CountryProperties>, initialYear: number) {
    this.eventBus = eventBus;
    this.mapData = mapData;
    this.initControlls(initialYear);
  }

  public receiveYear(year: number) {
    let sum = this.mapData.features
      .filter(f => f.properties.esc != null && f.properties.esc[year] != null && f.properties.esc[year].juryPoints != [])
      .map(f => {
        console.log(<number[]>Object.values(f.properties.esc[year].juryPoints));
        return {
          ISO_A2: f.properties.ISO_A2,
          points: (<number[]>Object.values(f.properties.esc[year].juryPoints)).reduce((sum, current) => sum + current)
        }
      });
    console.log(sum);

    d3.select("#yearStats")
      .selectAll("span")
      .data(sum)
      .enter()
      .append("span")
      .text((d, i, n) => {
        return (i + 1) + ". " + d.ISO_A2 + ": " + d.points + " ";
      })

  }

  private initControlls(initialYear: number) {
    d3.select("#yearSlider")
      .attr("min", d3.min(allYears))
      .attr("max", d3.max(allYears))
      .attr("value", initialYear)
      .on("input", (d, i, n: Array<HTMLInputElement>) => {
        let year = parseInt(n[i].value);
        d3.select("#yearSelection").text(year);
        this.eventBus.sendYear(year)
      });
  }
}