import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class ReceivedCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[this.selectedCountry];
    if (countryResult.completePointsReceived[d.properties.ISO_A2] == null
        || countryResult.completePointsReceived[d.properties.ISO_A2] == 0) {
      return "white";
    }
    return super.getColorScale()(countryResult.completePointsReceived[d.properties.ISO_A2]);
  }

  isMapDisplayed(year: number): boolean {
    return true;
  }

}