import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class ReceivedJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[this.selectedCountry];
    if (countryResult.juryPointsReceived == null
        || countryResult.juryPointsReceived[d.properties.ISO_A2] == null
        || countryResult.juryPointsReceived[d.properties.ISO_A2] == 0) {
      return "white";
    }
    return this.fillColorScale12(countryResult.juryPointsReceived[d.properties.ISO_A2]);
  }

  isMapDisplayed(year: number): boolean {
    return year >= 2016;
  }

}