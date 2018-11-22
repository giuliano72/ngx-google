import {Pipe, PipeTransform} from '@angular/core';

import {Position} from './position';
import {Observable} from 'rxjs';
import {NgxGoogleService} from './ngx-google.service';
import {map} from 'rxjs/operators';

;

@Pipe({
  name: 'distanceAsync'
})
export class DistanceAsyncPipe implements PipeTransform {

  constructor(private googleService: NgxGoogleService) {}

  transform(positions: Observable<Position[]>, center: Position, radius: number): Observable<Position[]> {
    return positions.pipe(
      map((items: Position[]) => {
        const results = this.googleService.filterByCenterRadius(items, center, radius);
        // console.log('filtered: '+JSON.stringify(results));
        return results;
      })
    );
  }

}
