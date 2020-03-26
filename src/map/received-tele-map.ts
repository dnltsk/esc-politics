import {Map} from "./map";
import {Feature, Polygon} from "geojson";
import {CountryProperties} from "../types";
import {finalsSince, separatedPointsSince} from "../scripts/config";

export class ReceivedTeleMap extends Map {

  getFillColor(d: Feature<Polygon, CountryProperties>): string {
    if(this.selectedYear < finalsSince){
      // Jahr keine hatte nur Gesamtpunkte -> Jury Punkte werden ausgeblendet
      return "grey";
    }
    if(this.escTimeseries[this.selectedYear].countriesInFinal.indexOf(d.properties.ISO_A2) == -1){
      // Land nahm nicht in Endrunde Teil -> kann keine Jury Punkte bekommen haben
      return "grey";
    }
    const receivedPoints = this.escTimeseries[this.selectedYear].countries[this.selectedCountry]?.telePointsReceived[d.properties.ISO_A2];
    return this.whiteOrColor(receivedPoints);
  }

  isNavigationStopped(): boolean {
    return this.selectedYear < separatedPointsSince;
  }

}