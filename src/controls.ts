import * as d3 from "d3";
import {allYears} from "./scripts/config";
import {EventBus} from "./event-bus";
import {FeatureCollection, Polygon} from "geojson";
import {CountryCode, CountryProperties, EscTimeseries} from "./types";

export class Controls {

  eventBus: EventBus;
  mapData: FeatureCollection<Polygon, CountryProperties>;
  escTimeseries: EscTimeseries;

  constructor(eventBus: EventBus,
    mapData: FeatureCollection<Polygon, CountryProperties>,
    escTimeseries: EscTimeseries,
    initialYear: number) {
    this.eventBus = eventBus;
    this.mapData = mapData;
    this.escTimeseries = escTimeseries;

    this.initControlls(initialYear);
  }

  public receiveYear(year: number) {

    let topTen = Object.keys(this.escTimeseries[year].countries)
      .sort((country: CountryCode) => this.escTimeseries[year].countries[country].points)
      .map((country: CountryCode) => this.escTimeseries[year].countries[country])
      .slice(0, 9 + 1);

    d3.select("#yearStats")
      .selectAll("span")
      .data(topTen)
      .enter()
      .append("span")
      .text((d, i, n) => {
        return (i + 1) + ". " + d.countryCode + ": " + d.points + " ";
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