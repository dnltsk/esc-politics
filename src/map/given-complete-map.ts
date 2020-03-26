import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class GivenCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    if(this.escTimeseries[this.selectedYear].countriesParticipating.indexOf(d.properties.ISO_A2) == -1){
      return "grey";
    }
    const givenPoints = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2]?.completePointsReceived[this.selectedCountry];
    return this.whiteOrColor(givenPoints);
  }

  isNavigationStopped(): boolean {
    return false;
  }

}