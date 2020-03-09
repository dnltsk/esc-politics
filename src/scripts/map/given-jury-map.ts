import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../../types";

export class GivenJuryMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    const countryResult = this.escTimeseries[this.selectedYear].countries[d.properties.ISO_A2];
    return this.pointsColorScale(countryResult.juryPointsReceived[this.selectedCountry]);
  }

}