import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {separatePointsSince} from "../scripts/config";

export class GivenJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    if (countryResult == null
        || countryResult.juryPointsReceived == null
        || countryResult.juryPointsReceived[this.selectedCountry] == null
        || countryResult.juryPointsReceived[this.selectedCountry] == 0) {
      return "white";
    }
    return this.fillColorScale12(countryResult.juryPointsReceived[this.selectedCountry]);
  }

  isMapDisplayed(year: number): boolean {
    return year >= separatePointsSince;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    // all participated countries can give points
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0
  }

}