import {loadPointsGivenTo, loadResultsOf} from "../io";
import {parse as _htmlParse} from 'node-html-parser';
import {AllPointsGivenTo, AllPointsGivenToCollection, Country, PointsGivenTo, ResultsOf} from "../../types";
import {allYears} from "../config";

let htmlParse: any = _htmlParse;

export class Parser {

  public parse(): AllPointsGivenToCollection {
    let allPointsGivenToCollection: AllPointsGivenToCollection = {};
    allYears.forEach((year) => {
      console.log(year, "...");
      const resultsOf: ResultsOf = this.parseResultsOf(year);
      this.parsePointsGivenTo(year, resultsOf, allPointsGivenToCollection);
    });
    return allPointsGivenToCollection;
  }

  private parsePointsGivenTo(year: number, resultsOf: ResultsOf, allPointsGivenToCollection: AllPointsGivenToCollection): void {
    Object.keys(resultsOf.points).forEach((country: Country) => {

      let pointsGivenToDocument = htmlParse(loadPointsGivenTo(year, country));

      let rows: Array<any> = pointsGivenToDocument.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

      let sum = 0;
      let pointsGivenTo: PointsGivenTo = {};
      rows.forEach((cn) => {
        let country: Country = cn.querySelector("img").getAttribute("src").substr(8, 2);
        let points = parseInt(cn.querySelectorAll("td")[2].text.trim());
        sum += points;
        if (points > 0) {
          pointsGivenTo[country] = points;
        }
      });

      //verity sum
      if (resultsOf[country] != resultsOf[country]) {
        console.error(year, " ", country, "resultsOf=", resultsOf[country], " sum=", sum);
      }

      let newAllPointsGivenTo: AllPointsGivenTo = {
        sumPoints: resultsOf.points[country],
        place: resultsOf.places[country],
        juryPoints: pointsGivenTo
      };

      if (allPointsGivenToCollection[country] == null) {
        //initial timeseries
        allPointsGivenToCollection[country] = {}
      }
      allPointsGivenToCollection[country][year] = newAllPointsGivenTo;

    });

  }

  private parseResultsOf(year: number): ResultsOf {
    let result: ResultsOf = {
      points: {},
      places: {}
    };

    let resultsOf = loadResultsOf(year);
    let resultsOfRoot = htmlParse(resultsOf);
    let rows: Array<any> = resultsOfRoot.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

    rows.forEach((cn) => {
      let country: Country = cn.querySelector("img").getAttribute("src").substr(8, 2);
      let place: number = parseInt(cn.querySelectorAll("td")[0].text.trim());
      let points: number = parseInt(cn.querySelectorAll("td")[1].text.trim());
      result.points[country] = points;
      result.places[country] = place;
    });
    return result;
  }

}
