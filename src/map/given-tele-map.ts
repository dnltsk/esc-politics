import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {separatePointsSince} from "../scripts/config";

export class GivenTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    if (countryResult == null
        || countryResult.telePointsReceived == null
        || countryResult.telePointsReceived[this.selectedCountry] == null
        || countryResult.telePointsReceived[this.selectedCountry] == 0) {
      return "white";
    }
    return this.fillColorScale12(countryResult.telePointsReceived[this.selectedCountry]);
  }

  isMapDisplayed(year: number): boolean {
    return year >= separatePointsSince;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    // all participated countries can give points
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0
  }

}