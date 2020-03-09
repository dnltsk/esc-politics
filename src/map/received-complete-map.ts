import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class ReceivedCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const receivedPoints = this.escTimeseries[this.selectedYear].countries[this.selectedCountry]?.completePointsReceived[d.properties.ISO_A2];
    return this.whiteOrColor(receivedPoints);
  }

  isMapDisplayed(year: number): boolean {
    return true;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0;
  }

}