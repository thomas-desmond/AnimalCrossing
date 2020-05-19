import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadImageModule } from './upload-image/upload-image/upload-image.module';
import { NavMenuModule } from './nav-menu/nav-menu.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UploadImageModule,
    NavMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
