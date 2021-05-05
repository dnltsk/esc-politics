import {CountryCode, EscTimeseries} from "./types";

export class Headlines {

  meldung1 = "{cc} hat {year} nicht teilgenommen!";
  meldung2 = "{cc} war {year} nicht im Finale!";
  meldung3 = "{cc} bekam {year} {points} Punkte";

  escTimeseries: EscTimeseries;

  constructor(escTimeseries: EscTimeseries) {
    this.escTimeseries = escTimeseries;
  }

  public updateHeadline(selectedCountry: CountryCode, selectedYear: number) {
    const wasParticipant = this.escTimeseries[selectedYear].countriesParticipating.indexOf(selectedCountry) != -1;
    const wasFinalist = this.escTimeseries[selectedYear].countriesInFinal.indexOf(selectedCountry) != -1;
    this.getReceivedCompleteHeadline(wasParticipant, wasFinalist, selectedCountry, selectedYear)
  }

  private getReceivedCompleteHeadline(wasParticipant: boolean, wasFinalist: boolean, selectedCountry: CountryCode, selectedYear: number) {
    if (!wasParticipant) {
      return this.substitudeMeldung(this.meldung1, selectedCountry, selectedYear);
    }
    if (!wasFinalist) {
      return this.substitudeMeldung(this.meldung2, selectedCountry, selectedYear);
    }
    const points = Object.values(this.escTimeseries[selectedYear].countries[selectedCountry].completePointsReceived).reduce((sum, value) => {
      return sum + value
    });
    return this.substitudeMeldung(this.meldung3, selectedCountry, selectedYear, points);
  }

  private substitudeMeldung(meldung: string, selectedCountry: CountryCode, selectedYear: number, points?: number) {
    return meldung
      .replace("{points}", points?.toString())
      .replace("{cc}", selectedCountry)
      .replace("{year}", selectedYear.toString());
  }

}