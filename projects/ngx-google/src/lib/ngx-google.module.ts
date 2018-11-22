import { NgModule } from '@angular/core';
import { NgxGoogleComponent } from './ngx-google.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {AddressEditorComponent} from './address-editor/address-editor.component';
import {DistancePipe} from './distance.pipe';
import {AddressComponent} from './address.component';
import {MapComponent} from './map/map.component';
import {MapMarkerComponent} from './map/map.marker.component';
import {MapCircleComponent} from './map/map.circle.component';
import {MapCircleRadiusControlComponent} from './map/map.circle.radius.control.component';
import {GroupByRegionListComponent} from './group.by.region.list.component';
import {DistanceAsyncPipe} from './distance.async.pipe';



@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    NgxGoogleComponent,
    DistancePipe,
    DistanceAsyncPipe,
    AddressEditorComponent,
    AddressComponent,
    MapComponent,
    MapMarkerComponent,
    MapCircleComponent,
    MapCircleRadiusControlComponent,
    GroupByRegionListComponent
  ],
  exports: [
    DistancePipe,
    DistanceAsyncPipe,
    AddressEditorComponent,
    AddressComponent,
    MapComponent,
    MapMarkerComponent,
    MapCircleComponent,
    MapCircleRadiusControlComponent,
    GroupByRegionListComponent
  ],
  bootstrap: [NgxGoogleComponent]
})
export class NgxGoogleModule { }
