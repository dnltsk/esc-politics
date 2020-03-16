import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {finalsSince} from "../scripts/config";

export class ReceivedCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    if (this.selectedYear < finalsSince
        || this.escTimeseries[this.selectedYear].participants.indexOf(d.properties.ISO_A2) == -1) {
      return "grey"
    }
    const receivedPoints = this.escTimeseries[this.selectedYear].countries[this.selectedCountry]?.completePointsReceived[d.properties.ISO_A2];
    return this.whiteOrColor(receivedPoints);
  }

  isNavigationStopped(): boolean {
    return false;
  }

}