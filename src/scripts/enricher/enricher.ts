import {Parser} from "./parser";
import {loadGeojson} from "../io";
import * as fs from "fs";

class Enricher {

  public enrich() {
    let geojson = loadGeojson();
    let allPointsGivenToCollection = new Parser().parse();

    geojson.features.forEach((feature) => {
      const collection = allPointsGivenToCollection[feature.properties.ISO_A2];
      if (collection == undefined) {
        console.log("skipped", feature.properties.ISO_A2);
        return;//TODO in geojson
      }
      feature.properties.esc = collection;
    });

    fs.writeFileSync("dist/data/esc-countries-enriched.geojson", JSON.stringify(geojson));
    console.log("Done!");
  }
}

new Enricher().enrich();