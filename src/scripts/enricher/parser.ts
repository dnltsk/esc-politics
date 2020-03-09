import {loadPointsGivenTo, loadResultsOf} from "../io";
import {parse as _htmlParse} from 'node-html-parser';
import {allYears} from "../config";
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
        countries: countryMap
      }
    });
    return escTimeseries;
  }

  private parsePointsGivenTo(year: number, countryMap: CountryMap): void {
    Object.keys(countryMap).forEach((country: CountryCode) => {

      let pointsGivenToDocument = htmlParse(loadPointsGivenTo(year, country));

      let rows: Array<any> = pointsGivenToDocument.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

      let completePointsReceived: PointsReceivedMap = {};
      rows.forEach((cn) => {
        let sourceCountry: CountryCode = cn.querySelector("img").getAttribute("src").substr(8, 2);
        let points = parseInt(cn.querySelectorAll("td")[2].text.trim());
        completePointsReceived[sourceCountry] = points;
      });

      countryMap[country].completePointsReceived = completePointsReceived;
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

}
