import {loadGeojson, loadPointsGivenTo, loadResultsOf} from "../io";
import {parse as _htmlParse} from 'node-html-parser';
import {AllPointsGivenTo, AllPointsGivenToCollection, Country, PointsGivenTo} from "../../types";
import {allYears} from "../config";

let htmlParse: any = _htmlParse;

class Parser {

  public parse() {
    let geojson = loadGeojson();
    let allPointsGivenToCollection: AllPointsGivenToCollection = {};
    allYears.forEach((year) => {
      console.log(year, "...");
      const resultPointsGivenTo: PointsGivenTo = this.parseResultsOf(year);
      this.parsePointsGivenTo(year, resultPointsGivenTo, allPointsGivenToCollection);
    });
    console.log(JSON.stringify(allPointsGivenToCollection));
  }

  private parsePointsGivenTo(year: string, resultPointsGivenTo: PointsGivenTo, allPointsGivenToCollection: AllPointsGivenToCollection): void {
    Object.keys(resultPointsGivenTo).forEach((country: Country) => {

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
      if (resultPointsGivenTo[country] != resultPointsGivenTo[country]) {
        console.error(year, " ", country, "resultPointsGivenTo=", resultPointsGivenTo[country], " sum=", sum);
      }

      let newAllPointsGivenTo: AllPointsGivenTo = {
        sumPoints: sum,
        juryPoints: pointsGivenTo
      };

      if(allPointsGivenToCollection[country] == null){
        //initial timeseries
        allPointsGivenToCollection[country] = {}
      }
      allPointsGivenToCollection[country][year] = newAllPointsGivenTo;


    });

  }

  private parseResultsOf(year: string): PointsGivenTo {
    let result: PointsGivenTo = {};

    let resultsOf = loadResultsOf(year);
    let resultsOfRoot = htmlParse(resultsOf);
    let rows: Array<any> = resultsOfRoot.querySelector("#tabelle1").querySelectorAll(".tr_output_tabelle_1, .tr_output_tabelle_2");

    rows.forEach((cn) => {
      let country: Country = cn.querySelector("img").getAttribute("src").substr(8, 2);
      let points: number = parseInt(cn.querySelectorAll("td")[1].text.trim());
      result[country] = points;
    });
    return result;
  }

}

new Parser().parse();
