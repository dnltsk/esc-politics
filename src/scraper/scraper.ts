import {PointsGiventoScraper} from "./points-given-to-scraper";
import * as fs from "fs";
import {FeatureCollection} from "geojson";

export class Scraper {
  public static readonly allCountries = ["AL", "AD", "AM", "AU", "AT", "AZ", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GE", "DE", "GR", "HU", "IS", "IE", "IL", "IT", "LV", "LT", "LU", "MT", "MA", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "CS", "SK", "SI", "ES", "SE", "CH", "TR", "UA", "GB", "YU"];
  public static readonly allYears = ["2016F", "2017F", "2018F", "2019F", "2015F", "2014F", "2013F", "2012F", "2011F", "2010F", "2009F", "2008F", "2007F", "2006F", "2005F", "2004F", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960", "1959", "1958", "1957"];
  public static readonly allTelevoteYears = ["2016F", "2017F", "2018F", "2019F"];

  public scrape() {
    new PointsGiventoScraper().scrape(Scraper.allTelevoteYears, Scraper.allCountries);
    //new ResultsOfScraper().scrape(Scraper.allYears);
  }

  public verifyCountries() {
    let rawdata = fs.readFileSync("dist/data/esc-countries.geojson", {
      encoding: "utf8"
    });
    let countries: FeatureCollection = JSON.parse(rawdata);
    Scraper.allCountries.forEach((c) => {

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

