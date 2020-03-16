import {separatedPointsSince} from "./scripts/config";
import d3 = require("d3");

export class MapSwapper {

  public selectedYear: number;

  constructor(initialYear: number) {
    this.selectedYear = initialYear;
  }

  public receiveYear(year: number) {
    if (this.selectedYear < separatedPointsSince && year >= separatedPointsSince) {
      //switch from two to six maps
      //d3.select(".maps").style("grid-template-areas", "\"ul uc ur\" \"ll lc lr\"")
      d3.select(".ul").classed("invisible", false);
      d3.select(".ll").classed("invisible", false);
      d3.select(".ur").classed("invisible", false);
      d3.select(".lr").classed("invisible", false);
    }
    else if (this.selectedYear >= separatedPointsSince && year < separatedPointsSince) {
      //switch from six to two maps
      //d3.select(".maps").style("grid-template-areas", "\"uc ul ur\" \"lc ll lr\"")
      d3.select(".ul").classed("invisible", true);
      d3.select(".ll").classed("invisible", true);
      d3.select(".ur").classed("invisible", true);
      d3.select(".lr").classed("invisible", true);
    }
    this.selectedYear = year;
  }

}