import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class GivenJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    if (countryResult.juryPointsReceived == null
        || countryResult.juryPointsReceived[this.selectedCountry] == null
        || countryResult.juryPointsReceived[this.selectedCountry] == 0) {
      return "white";
    }
    return this.fillColorScale12(countryResult.juryPointsReceived[this.selectedCountry]);
  }

  isMapDisplayed(year: number): boolean {
    return year >= 2016;
  }

}