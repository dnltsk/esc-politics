import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class ReceivedCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[this.selectedCountry];
    if(countryResult.completePointsReceived[d.properties.ISO_A2] == null){
      super.getColorScale()(0);
    }
    return super.getColorScale()(countryResult.completePointsReceived[d.properties.ISO_A2]);
  }

  isMapHidden(year: number): boolean {
    return false;
  }

}