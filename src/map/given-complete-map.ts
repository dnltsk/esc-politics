import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class GivenCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    if (countryResult.completePointsReceived[this.selectedCountry] == null
        || countryResult.completePointsReceived[this.selectedCountry] == 0) {
      return "white";
    }
    return super.getColorScale()(countryResult.completePointsReceived[this.selectedCountry]);
  }

  isMapDisplayed(year: number): boolean {
    return true;
  }

}