import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";

export class ReceivedJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[this.selectedCountry];
    return this.pointsColorScale(countryResult.juryPointsReceived[d.properties.ISO_A2]);
  }

  isMapHidden(year: number): boolean {
    return false;
  }

}