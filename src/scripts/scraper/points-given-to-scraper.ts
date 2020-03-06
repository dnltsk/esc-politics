import fetch, {Response} from 'node-fetch'
import {writePointsGivenTo} from "../io";
import {allTelevoteYears} from "../config";

export class PointsGiventoScraper {
  public async scrape(allYears: Array<string>, allCountries: Array<string>) {
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

  private async loadContent(country: string, year: string): Promise<string> {
    let url = "https://eschome.net/databaseoutput206.php";
    if (allTelevoteYears.indexOf(year) != -1) {
      url = "https://eschome.net/databaseoutput232.php";
    }
    return await fetch(url, {
        method: "POST",
        body: "land=" + country + "&jahr=" + year,
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    ).then((response: Response) => response.text()
    ).then((text) => text);
  }
}
