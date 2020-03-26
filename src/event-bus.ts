import {Map} from "./map/map";
import {CountryCode} from "./types";
import {Controls} from "./controls";
import {MapSwapper} from "./map-swapper";

export class EventBus{

  public maps: Array<Map>;
  public controls: Controls;
  public mapSwapper: MapSwapper;

  public sendResize() {
    this.maps.forEach((map) => {
      map.receiveResize();
    })
  }

  sendMouseover(ISO_A2: CountryCode) {
    this.controls.receiveMouseover(ISO_A2);
    this.maps.forEach((map) => {
      map.receiveMouseover(ISO_A2);
    });
  }

  sendMouseout(ISO_A2: CountryCode) {
    this.maps.forEach((map) => {
      map.receiveMouseout(ISO_A2);
    });
  }

  sendDrag(translate: [number, number]) {
    this.maps.forEach((map) => {
      map.receiveDrag(translate);
    });
  }

  sendZoom(newScale: number, translate: [number, number]) {
    this.maps.forEach((map) => {
      map.receiveZoom(newScale, translate);
    });
  }

  sendYear(year: number) {
    this.controls.receiveYear(year);
    this.mapSwapper.receiveYear(year);
    this.maps.forEach((map) => {
      map.receiveYear(year);
    });
  }
}