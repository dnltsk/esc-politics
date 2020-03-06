import fetch, {Response} from 'node-fetch'
import {writeResultsOf} from "../io";
import {finalsSince} from "../config";

export class ResultsOfScraper {
  public async scrape(years: Array<number>) {
    console.log("start.");

    for (const year of years) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(year + ", processing..");
      const content = await this.loadContent(year);

      writeResultsOf(year, content);
    }
    return null;
  }

  private async loadContent(year: number) {
    let yearParameter = year.toString();
    if (year >= finalsSince) {
      yearParameter = year + "F";
    }

    return await fetch("https://eschome.net/databaseoutput201.php", {
        method: "POST",
        body: "jahr=" + yearParameter,
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    ).then((response: Response) => response.text()
    ).then((text) => text);
  }
}
