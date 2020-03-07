import * as d3 from "d3";
import {allYears} from "./scripts/config";
import {EventBus} from "./event-bus";
import {CountryCode, CountryResult, EscTimeseries} from "./types";

export class Controls {

  eventBus: EventBus;
  escTimeseries: EscTimeseries;
  g: d3.Selection<HTMLElement, {}, HTMLElement, any>;

  constructor(eventBus: EventBus,
    escTimeseries: EscTimeseries,
    initialYear: number) {
    this.eventBus = eventBus;
    this.escTimeseries = escTimeseries;

    this.initControlls(initialYear);
    this.initTopTen(initialYear);
  }

  public receiveYear(year: number) {
    console.log("receiveYear", year);
    let topTen = Object.keys(this.escTimeseries[year].countries)
      .sort((country: CountryCode) => this.escTimeseries[year].countries[country].points)
      .map((country: CountryCode) => this.escTimeseries[year].countries[country])
      .slice(0, 9 + 1);

    console.log(topTen);

    this.g.selectAll("topTen")
      .data(topTen)
      .enter()
      .selectAll("span")
      .text((d: CountryResult, i) => {
        return (i + 1) + ". " + topTen[i].countryCode + ": " + topTen[i].points + " ";
      });
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

  private initTopTen(initialYear: number) {
    //TODO: initTopTen
    let topTen = Object.keys(this.escTimeseries[initialYear].countries)
      .sort((country: CountryCode) => this.escTimeseries[initialYear].countries[country].points)
      .map((country: CountryCode) => this.escTimeseries[initialYear].countries[country])
      .slice(0, 9 + 1);

    this.g = d3.select("#yearStats");

    this.g.selectAll("topTen")
      .data(topTen)
      .enter()
      .append("span")
      .text((d: CountryResult, i) => {
        return (i + 1) + ". " + d.countryCode + ": " + d.points + " ";
      });
  }
}