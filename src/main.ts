/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';


  bootstrapApplication(AppComponent, appConfig).then(() => {
  providers: [
    provideAnimations(), 
    importProvidersFrom(NgbModule, HttpClientModule), 
  ]
}).catch(err => console.error(err))