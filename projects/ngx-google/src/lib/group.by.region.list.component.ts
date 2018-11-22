import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {Address} from './address';
import {AddressInfo} from './address.info';

@Component({
  selector: 'glg-group-by-region',
  template: ` <div class="region_selector_container">
                  <label for="selectedRegion">{{selectedRegionLabel}}</label>
                  <select id="selectedRegion" [(ngModel)]="selectedRegion" (change)="selectedRegionChanged()">
                    <option *ngFor="let region of regions" [ngValue]="region">{{region.key}}</option>
                  </select>
              </div>
              <div class="groups_container">
                <div *ngFor="let region of filteredRegionItems | keyvalue:sortingFunction">
                  <h2>{{region.key}}</h2>
                  <div *ngFor="let item of region.value">
                    <div [innerHtml]="item.info.content"></div>
                  </div>
                </div>
              </div>
  `,
  styles: []
})
export class GroupByRegionListComponent implements OnInit {

  selectedRegion: {key: string, value: string} ;
  regions: {key: string, value: string}[];
  regionItems: {[index: string]: AddressInfo[]};
  _filteredRegionItems: {[index: string]: AddressInfo[]};

  @Input() selectedRegionLabel: string;

  constructor() {
    this.regions = [];
    this.regions.push({key: 'Tutte', value: 'all'});
    this.selectedRegion = this.regions[0];

    this.regionItems = {};
  }

  ngOnInit(): void {}

  @Input() set items(items: AddressInfo[]) {

    if (Object.keys(this.regionItems).length === 0) {
      console.log('GroupByRegionListComponent set items  ...');
      console.log('GroupByRegionListComponent items: ' + JSON.stringify(items));


      if (items) {
        const keys = [];
        items.forEach((item) => {
          const region = item.region;
          if (region) {
            let list = this.regionItems[region];
            if (list) {
              list.push(item);
            } else {
              list = [];
              list.push(item);
              this.regionItems[region] = list;
              keys.push(region);
            }
          }
        });

        console.log('GroupByRegionListComponent keys: ' + JSON.stringify(keys));
        keys.sort(this.sortingFunction);

        this.regions = [];
        this.regions.push({key: 'Tutte', value: 'all'});
        keys.forEach((key) => {
          this.regions.push({key: key, value: key});
        });
        this.selectedRegion = this.regions[0];
      }
    }
  }

  get filteredRegionItems(): {[index: string]: AddressInfo[]} {

    if (this._filteredRegionItems){
      return this._filteredRegionItems;

    } else {
      console.log('GroupByRegionListComponent get filteredRegions ...');

      if (this.regionItems) {
        if (this.selectedRegion) {
          if (this.selectedRegion.value === 'all') {
            this._filteredRegionItems = this.regionItems;
          } else {
            console.log('GroupByRegionListComponent selectedRegion(' + this.selectedRegion.value + ') ...');
            const result = {};
            result[this.selectedRegion.value] = this.regionItems[this.selectedRegion.value].filter((item) => {
              return (item.region.toLowerCase() === this.selectedRegion.value.toLowerCase());
            });
            console.log('Filtered: ' + JSON.stringify(result));
            this._filteredRegionItems = result;
          }
        } else {
          console.log('GroupByRegionListComponent selectedRegion is null');
          this._filteredRegionItems = this.regionItems;
        }
      } else {
        console.log('GroupByRegionListComponent regionItems is null');
        this._filteredRegionItems = this.regionItems;
      }

      return this._filteredRegionItems;
    }
  }

  selectedRegionChanged() {
    console.log('GroupByRegionListComponent selectedRegionChanged ...');
    this._filteredRegionItems = null;
  }

  sortingFunction = (a, b) => {
    if ( a == null && b == null ) {
      return 0;
    }
    return a.key > b.key ? 1 : -1;
  }

}
