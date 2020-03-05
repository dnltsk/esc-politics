import fetch, {Response} from 'node-fetch'
import * as fs from "fs";

export class ResultsOfScraper {
  public async scrape(allYears: Array<string>) {
    console.log("start.");

    for (const year of allYears) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(year + ", processing..");
      const content = await this.loadContent(year);

      this.writeFile(year, content);
    }

    return null;
  }

  private writeFile(year: string, content: string) {
    let dir = "eschome/" + year;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let filename = dir + "/results-of.html";
    fs.writeFileSync(filename, content);
    console.log("    " + filename)
  }

  private async loadContent(year: string) {
    return await fetch("https://eschome.net/databaseoutput201.php", {
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
