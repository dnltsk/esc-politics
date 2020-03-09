import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../../types";

export class GivenTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    return this.pointsColorScale(countryResult.juryPointsReceived[this.selectedCountry]);
  }

  isMapHidden(year: number): boolean {
    return year < 2014;
  }

}