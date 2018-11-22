import {Pipe, PipeTransform} from '@angular/core';

import {Position} from './position';
import {Observable} from 'rxjs';
import {NgxGoogleService} from './ngx-google.service';
import {map} from 'rxjs/operators';

;

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  constructor(private googleService: NgxGoogleService) {}

  transform(positions: Position[], center: Position, radius: number): Position[] {
    return  this.googleService.filterByCenterRadius(positions, center, radius);
  }

}
