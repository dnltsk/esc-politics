import {Parser} from "./parser";
import * as fs from "fs";

class Enricher {

  public enrich() {
    let escTimeseries = new Parser().parse();
    fs.writeFileSync("dist/data/esc-timeseries.json", JSON.stringify(escTimeseries));
    console.log("Done!");
  }
}

new Enricher().enrich();