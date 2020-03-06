import fetch, {Response} from 'node-fetch'
import {writePointsGivenTo} from "../io";
import {finalsSince} from "../config";

export class PointsGiventoScraper {
  public async scrape(allYears: Array<number>, allCountries: Array<string>) {
    console.log("start.");

    for (const year of allYears) {
      for (const country of allCountries) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(year + ", " + country + " processing..");
        const content = await this.loadContent(country, year);

        if (content.indexOf("The country did not participate in") != -1) {
          console.info("    " + country + " did not participate in " + year);
          continue;
        }

        writePointsGivenTo(year, country, content);
      }
    }
    return null;
  }

  private async loadContent(country: string, year: number): Promise<string> {
    let url = "https://eschome.net/databaseoutput206.php";
    let yearParameter: string = year.toString();
    if (year >= finalsSince) {
      url = "https://eschome.net/databaseoutput232.php";
      yearParameter = year + "F";
    }
    return await fetch(url, {
        method: "POST",
        body: "land=" + country + "&jahr=" + yearParameter,
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    ).then((response: Response) => response.text()
    ).then((text) => text);
  }
}
