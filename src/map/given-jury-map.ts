import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class GivenJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    if(countryResult.juryPointsReceived[this.selectedCountry] == null){
      super.getColorScale()(0);
    }
    return super.getColorScale()(countryResult.juryPointsReceived[this.selectedCountry]);
  }

  isMapHidden(year: number): boolean {
    return year <= 2016;
  }

}