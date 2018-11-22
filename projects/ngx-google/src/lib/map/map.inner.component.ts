import {Gmap} from '../gmap';

export interface MapInnerComponent {
  setGmap(map: Gmap);
  updateView();
}
