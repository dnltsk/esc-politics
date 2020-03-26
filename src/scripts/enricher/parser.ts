import {loadParticipants, loadPointsGivenTo, loadResultsOf} from "../io";
import {parse as _htmlParse} from 'node-html-parser';
import {allYears, separatedPointsSince} from "../config";
import {CountryCode, CountryMap, EscTimeseries, PointsReceivedMap} from "../../types";

let htmlParse: any = _htmlParse;

export class Parser {

  public parse(): EscTimeseries {
    let escTimeseries: EscTimeseries = {};
    allYears.forEach((year) => {
      console.log(year, "...");

      const countryMap: CountryMap = this.parseResultsOf(year);
      this.parsePointsGivenTo(year, countryMap);
      escTimeseries[year] = {
        countries: countryMap,
        countriesInFinal: <CountryCode[]>Object.keys(countryMap),
        countriesParticipating: this.parseParticipants(year)
      }
    });
    return escTimeseries;
  }

  private parsePointsGivenTo(year: number, countryMap: CountryMap): void {
    Object.keys(countryMap).forEach((country: CountryCode) => {

      let pointsGivenToDocument = htmlParse(loadPointsGivenTo(year, country));

      let rows: Array<any> = pointsGivenToDocument.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

      let completePointsReceived: PointsReceivedMap = {};
      let juryPointsReceived: PointsReceivedMap = {};
      let telePointsReceived: PointsReceivedMap = {};
      rows.forEach((cn) => {
        let sourceCountry: CountryCode = cn.querySelector("img").getAttribute("src").substr(8, 2);
        completePointsReceived[sourceCountry] = parseInt(cn.querySelectorAll("td")[2].text.trim());
        if (year >= separatedPointsSince) {
          juryPointsReceived[sourceCountry] = parseInt(cn.querySelectorAll("td")[3].text.trim());
          telePointsReceived[sourceCountry] = parseInt(cn.querySelectorAll("td")[4].text.trim());
        }
      });

      countryMap[country].completePointsReceived = completePointsReceived;
      if (year >= separatedPointsSince) {
        countryMap[country].juryPointsReceived = juryPointsReceived;
        countryMap[country].telePointsReceived = telePointsReceived;
      }
    });

  }

  private parseResultsOf(year: number): CountryMap {
    let resultsOf = loadResultsOf(year);
    let resultsOfRoot = htmlParse(resultsOf);
    let rows: Array<any> = resultsOfRoot.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

    let result: CountryMap = {};
    rows.forEach((cn) => {
      let countryCode: CountryCode = cn.querySelector("img").getAttribute("src").substr(8, 2);
      result[countryCode] = {
        countryCode: countryCode,
        place: parseInt(cn.querySelectorAll("td")[0].text.trim()),
        points: parseInt(cn.querySelectorAll("td")[1].text.trim()),
        performer: cn.querySelectorAll("td")[5].text.trim(),
        song: cn.querySelectorAll("td")[6].text.trim()
      };
      //console.log(result[countryCode])
    });
    return result;
  }

  private parseParticipants(year: number): CountryCode[] {
    let participants = loadParticipants(year);
    let participantsRoot = htmlParse(participants);
    let rows: Array<any> = participantsRoot.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

    let result: CountryCode[] = [];
    rows.forEach((cn) => {
      result.push(cn.querySelector("img").getAttribute("src").substr(8, 2));
    });
    return result;
  }
}
