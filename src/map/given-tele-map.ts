import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {finalsSince, separatedPointsSince} from "../scripts/config";

export class GivenTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const givenPoints = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2]?.telePointsReceived[this.selectedCountry]
    return this.whiteOrColor(givenPoints);
  }

  isMapDisplayed(year: number): boolean {
    return year >= separatedPointsSince;
  }

  isCountryRelevant(d: Feature<Polygon, CountryProperties>): boolean {
    if (this.selectedYear >= finalsSince) {
      //only countries from the finals can could get points
      return Object.keys(this.escTimeseries[this.selectedYear].countries).indexOf(d.properties.ISO_A2) >= 0;
    }
    return this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) >= 0
  }

}