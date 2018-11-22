import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {NgxGoogleModule} from '../projects/ngx-google/src/lib/ngx-google.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(NgxGoogleModule)
  .catch(err => console.log(err));




