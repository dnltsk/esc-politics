import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {separatePointsSince} from "../scripts/config";

export class ReceivedJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[this.selectedCountry];
    if (countryResult == null
        || countryResult.juryPointsReceived == null
        || countryResult.juryPointsReceived[d.properties.ISO_A2] == null
        || countryResult.juryPointsReceived[d.properties.ISO_A2] == 0) {
      return "white";
    }
    return this.fillColorScale12(countryResult.juryPointsReceived[d.properties.ISO_A2]);
  }

  isMapDisplayed(year: number): boolean {
    return year >= separatePointsSince;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    // if (this.selectedYear >= finalsSince) {
    //   //only countries from the finals can could get points
    //   return Object.keys(this.escTimeseries[this.selectedYear].countries).indexOf(d.properties.ISO_A2) >= 0;
    // }
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0;
  }

}