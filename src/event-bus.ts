import {Map} from "./map";

export class EventBus{

  public maps: Array<Map>;

  constructor() {
  }

  public sendResize() {
    this.maps.forEach((map) => {
      map.receiveResize();
    })
  }

  sendMouseover(ADM0_A3: string) {
    this.maps.forEach((map) => {
      map.receiveMouseover(ADM0_A3);
    });
  }

  sendMouseout(ADM0_A3: string) {
    this.maps.forEach((map) => {
      map.receiveMouseout(ADM0_A3);
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

}