import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImageComponent } from './upload-image.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UploadImageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    UploadImageComponent
  ]
})
export class UploadImageModule { }
