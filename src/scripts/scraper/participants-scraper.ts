import fetch, {Response} from 'node-fetch'
import {writeParticipants} from "../io";

export class ParticipantsScraper {
  public async scrape(years: Array<number>) {
    console.log("start.");

    for (const year of years) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(year + ", processing..");
      const content = await this.loadContent(year);

      writeParticipants(year, content);
    }
    return null;
  }

  private async loadContent(year: number) {
    return await fetch("https://eschome.net/databaseoutput230.php", {
        method: "POST",
        body: "jahr=" + year,
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    ).then((response: Response) => response.text()
    ).then((text) => text);
  }
}
