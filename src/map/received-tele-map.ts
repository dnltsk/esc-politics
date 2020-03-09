import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {separatedPointsSince} from "../scripts/config";

export class ReceivedTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const receivedPoints = this.escTimeseries[this.selectedYear].countries[this.selectedCountry]?.telePointsReceived[d.properties.ISO_A2];
    return this.whiteOrColor(receivedPoints);
  }

  isMapDisplayed(year: number): boolean {
    return year >= separatedPointsSince;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0;
  }
}