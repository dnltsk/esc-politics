import * as fs from "fs";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "../types";

export function loadGeojson(): FeatureCollection<Polygon, CountryProperties> {
  let rawContent = fs.readFileSync("dist/data/esc-countries.geojson", {
    encoding: "utf8"
  });
  return JSON.parse(rawContent);
}

export function loadPointsGivenTo(year: string, country: string): string {
  return fs.readFileSync("eschome/" + year + "/points-given-to-" + country + ".html", {
    encoding: "utf8"
  });
}

export function writePointsGivenTo(year: string, country: string, content: string) {
  let dir = "eschome/" + year;
  verifyDir(dir);
  let filename = dir + "/points-given-to-" + country + ".html";
  fs.writeFileSync(filename, content);
}

export function loadResultsOf(year: string) {
  return fs.readFileSync("eschome/" + year + "/results-of.html", {
    encoding: "utf8"
  });
}

export function writeResultsOf(year: string, content: string) {
  let dir = "eschome/" + year;
  verifyDir(dir);
  let filename = dir + "/results-of.html";
  fs.writeFileSync(filename, content);
}

function verifyDir(dir: string){
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}