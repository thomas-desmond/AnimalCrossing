import { Component, OnInit } from '@angular/core';
import { UploadImageService } from 'src/app/service/upload-image.service';
import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  public selectedFile = false;
  public uploadImageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uploadImageService: UploadImageService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.uploadImageForm = this.fb.group({
      imageName: new FormControl('', [Validators.required]),
    });
  }

  private fileToUpload: File;

  public handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log('this.fileToUpload', this.fileToUpload);
    var oFReader = new FileReader();
    //@ts-ignore
    oFReader.readAsDataURL(document.getElementById("fileInput").files[0]);

    oFReader.onload = function (oFREvent) {
      //@ts-ignore
      document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
  }

  public uploadImage() {
    // this.uploadImageService.uploadImage(this.fileToUpload);

  }
}
