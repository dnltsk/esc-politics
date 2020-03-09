import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {separatePointsSince} from "../scripts/config";

export class ReceivedJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const receivedPoints = this.escTimeseries[this.selectedYear].countries[this.selectedCountry]?.juryPointsReceived[d.properties.ISO_A2]
    return this.whiteOrColor(receivedPoints);
  }

  isMapDisplayed(year: number): boolean {
    return year >= separatePointsSince;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0;
  }

}