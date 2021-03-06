import * as d3 from 'd3';
import * as _proj4 from 'proj4';
import {FeatureCollection, Polygon} from "geojson";
import {CountryProperties} from "./types";

let proj4 = (_proj4 as any).default;

const epsg32632 = proj4("PROJCS[\"WGS 84 / UTM zone 32N\",GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.01745329251994328,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",0],PARAMETER[\"central_meridian\",9],PARAMETER[\"scale_factor\",0.9996],PARAMETER[\"false_easting\",500000],PARAMETER[\"false_northing\",0],AUTHORITY[\"EPSG\",\"32632\"],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH]]");

export function fitToMap(path: d3.GeoPath, projection: d3.GeoProjection, mapData: FeatureCollection<Polygon, CountryProperties>, width: number, height: number) {
  // console.log("scale", projection.scale());
  // console.log("bounds", path.bounds(mapData));

  // const b = path.bounds(mapData),
  //   s = 1.0 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
  //
  // const center = path.centroid(mapData);
  // console.log("translate", projection.translate());
  // console.log(center);
  //
  // projection
    // .scale(projection.scale())
    // .translate(center);
    //.fitExtent(path.bounds(mapData), mapData)
  //projection.fitSize([width, height], mapData);

}

export function initFitToMap(path: d3.GeoPath, projection: d3.GeoProjection, mapData: FeatureCollection<Polygon, CountryProperties>, width: number, height: number) {
  projection
    .scale(1)
    .translate([0, 0]);

  const b = path.bounds(mapData),
    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t: [number, number] = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
    .scale(s)
    .translate(t);
}

export function project(lambda: number, phi: number) {
  return epsg32632.forward([lambda, phi].map(radiansToDegrees));
}

project.invert = function (x: number, y: number) {
  return epsg32632.inverse([x, y]).map(degreesToRadians);
};

function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians: number) {
  return radians * 180 / Math.PI;
}
