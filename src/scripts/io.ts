import * as fs from "fs";
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "../types";

export function loadParticipants(year: number) {
  return fs.readFileSync("eschome/" + year + "/participants.html", {
    encoding: "utf8"
  });
}

export function writeParticipants(year: number, content: string) {
  let dir = "eschome/" + year;
  verifyDir(dir);
  let filename = dir + "/participants.html";
  fs.writeFileSync(filename, content);
}

export function loadGeojson(): FeatureCollection<Polygon, CountryProperties> {
  let rawContent = fs.readFileSync("dist/data/esc-countries.geojson", {
    encoding: "utf8"
  });
  return JSON.parse(rawContent);
}

export function loadPointsGivenTo(year: number, country: string): string {
  return fs.readFileSync("eschome/" + year + "/points-given-to-" + country + ".html", {
    encoding: "utf8"
  });
}

export function writePointsGivenTo(year: number, country: string, content: string) {
  let dir = "eschome/" + year;
  verifyDir(dir);
  let filename = dir + "/points-given-to-" + country + ".html";
  fs.writeFileSync(filename, content);
}

export function loadResultsOf(year: number) {
  return fs.readFileSync("eschome/" + year + "/results-of.html", {
    encoding: "utf8"
  });
}

export function writeResultsOf(year: number, content: string) {
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