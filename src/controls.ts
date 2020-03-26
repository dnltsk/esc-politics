import * as d3 from "d3";
import {allYears} from "./scripts/config";
import {EventBus} from "./event-bus";
import {CountryCode, CountryResult, EscTimeseries} from "./types";

export class Controls {

  eventBus: EventBus;
  escTimeseries: EscTimeseries;
  selectedYear: number;
  selectedCountry: CountryCode;
  g: d3.Selection<HTMLElement, {}, HTMLElement, any>;

  constructor(eventBus: EventBus,
    escTimeseries: EscTimeseries,
    initialYear: number) {
    this.eventBus = eventBus;
    this.escTimeseries = escTimeseries;

    this.initControls(initialYear);
    this.initTopTen(initialYear);
  }

  public receiveMouseover(ISO_A2: CountryCode) {
    this.selectedCountry = ISO_A2;
    d3.selectAll(".map-title-selected-country").text(ISO_A2);
    d3.select(".map-title-received-jury-points").text(ISO_A2);
    d3.select(".map-title-received-complete-points").text(this.sumReceivedCompletePoints());
    d3.select(".map-title-received-tele-points").text(ISO_A2);
  }

  public receiveYear(year: number) {
    this.selectedYear = year;

    let topTen = Object.keys(this.escTimeseries[this.selectedYear].countries)
      .sort((country: CountryCode) => this.escTimeseries[this.selectedYear].countries[country].points)
      .map((country: CountryCode) => this.escTimeseries[this.selectedYear].countries[country])
      .slice(0, 9 + 1);

    this.g.selectAll("topTen")
      .data(topTen)
      .enter()
      .selectAll("span")
      .text((d: CountryResult, i) => {
        return (i + 1) + ". " + topTen[i].countryCode + ": " + topTen[i].points + " ";
      });
  }

  private sumReceivedCompletePoints(): number {
    if(this.escTimeseries[this.selectedYear].countriesInFinal.indexOf(this.selectedCountry) == -1){
      return -1;
    }
    try {
      return Object.values(this.escTimeseries[this.selectedYear].countries[this.selectedCountry].completePointsReceived).reduce((sum, value) => {
        return sum + value
      });
    }
    catch (e) {
      console.log("error in sumReceivedCompletePoints", e, this.selectedCountry);
    }
    return 0;
  }

  private initControls(initialYear: number) {
    this.selectedYear = initialYear;
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