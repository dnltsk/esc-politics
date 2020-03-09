import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class ReceivedTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[this.selectedCountry];
    if(countryResult.telePointsReceived[d.properties.ISO_A2] == null){
      this.fillColorScale12(0);
    }
    return this.fillColorScale12(countryResult.telePointsReceived[d.properties.ISO_A2]);
  }

  isMapHidden(year: number): boolean {
    return year <= 2016;
  }

}