import {Map} from "./map";
import {Country} from "./types";
import {Controls} from "./controls";

export class EventBus{

  public maps: Array<Map>;
  public controls: Controls;

  constructor() {
  }

  public sendResize() {
    this.maps.forEach((map) => {
      map.receiveResize();
    })
  }

  sendMouseover(ISO_A2: Country) {
    this.maps.forEach((map) => {
      map.receiveMouseover(ISO_A2);
    });
  }

  sendMouseout(ISO_A2: Country) {
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
    this.maps.forEach((map) => {
      map.receiveYear(year);
    });
  }
}