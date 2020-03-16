import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {separatedPointsSince} from "../scripts/config";

export class GivenTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    if (this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) == -1
        || this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2]?.telePointsReceived == null) {
      return "grey"
    }
    if (this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2]?.telePointsReceived[this.selectedCountry] == null) {
      return "white"
    }
    const givenPoints = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2]?.telePointsReceived[this.selectedCountry];
    return this.whiteOrColor(givenPoints);
  }

  isNavigationStopped(): boolean {
    return this.selectedYear < separatedPointsSince;
  }

}