import {allCountries, allYears} from "../config";
import {loadGeojson} from "../io";
import {ParticipantsScraper} from "./participants-scraper";

export class Scraper {


  public scrape() {
    new ParticipantsScraper().scrape(allYears);
    //new ResultsOfScraper().scrape(allYears);
    //new PointsGiventoScraper().scrape(allYears, allCountries);
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

new Scraper().scrape();

