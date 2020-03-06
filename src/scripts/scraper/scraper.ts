import {PointsGiventoScraper} from "./points-given-to-scraper";
import {allCountries, allYears} from "../config";
import {loadGeojson} from "../io";
import {ResultsOfScraper} from "./results-of-scraper";

export class Scraper {


  public scrape() {
    new PointsGiventoScraper().scrape(allYears, allCountries);
    new ResultsOfScraper().scrape(allYears);
  }

  public verifyCountries() {

    allCountries.forEach((c) => {
      let countries = loadGeojson();
      let found = false;
      countries.features.forEach((f) => {
        if (c === f.properties.ISO_A2) {
          found = true;
        }
      });
      if(!found){
        console.log(c);
      }
    })

  }
}

//new Scraper().scrape();
new Scraper().verifyCountries();

