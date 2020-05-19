import { Component, OnInit } from '@angular/core';
import { UploadImageService } from 'src/app/service/upload-image.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  constructor(private uploadImageService: UploadImageService) { }

  ngOnInit() {
  }

  private fileToUpload: File;

  public handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    this.uploadImageService.uploadImage(this.fileToUpload);
  }
}
