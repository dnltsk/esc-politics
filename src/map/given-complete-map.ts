import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class GivenCompleteMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    if(countryResult.completePointsReceived[this.selectedCountry] == null){
      return super.getColorScale()(0);
    }
    return super.getColorScale()(countryResult.completePointsReceived[this.selectedCountry]);
  }

  isMapHidden(year: number): boolean {
    return false;
  }

}