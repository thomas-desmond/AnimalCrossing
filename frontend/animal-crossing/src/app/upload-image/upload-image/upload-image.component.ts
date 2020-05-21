import { Component, OnInit, HostListener } from '@angular/core';
import { UploadImageService } from 'src/app/service/upload-image.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Directive, Output, Input, EventEmitter, HostBinding } from '@angular/core';
import { ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  public selectedFile = false;
  public uploadImageForm: FormGroup;
  public fileToUpload: File;
  public tooManyFilesSelected = false;
  public unsupportedFile = false;
  public supportedExstensions = [
    '.jpg',
    '.jpeg',
    '.png'
  ];

  constructor(
    private fb: FormBuilder,
    private uploadImageService: UploadImageService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  @Output() onFileDropped = new EventEmitter<any>();

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    this.handleFileInput(files);
  }

  private buildForm() {
    this.uploadImageForm = this.fb.group({
      imageName: new FormControl('', [Validators.required]),
      tooManyFiles: new FormControl(false, [Validators.required])
    });
  }

  public handleFileInput(files: FileList) {
    if (files['1']) {
      const uploadPreview = document.getElementById("uploadPreview");
      if (uploadPreview) {
        //@ts-ignore
        uploadPreview.src = ''
      }
      this.resetFlags();
      this.tooManyFilesSelected = true;
      return;
    }

    if (!this.fileIsSupported(files['0'])) {
      console.log('extension not supported');

      const uploadPreview = document.getElementById("uploadPreview");
      if (uploadPreview) {
        //@ts-ignore
        uploadPreview.src = ''
      }
      this.resetFlags();
      this.unsupportedFile = true;
      return
    }

    this.tooManyFilesSelected = false;
    this.fileToUpload = files.item(0);

    const oFReader = new FileReader();
    //@ts-ignore
    oFReader.readAsDataURL(this.fileToUpload);

    oFReader.onload = function (oFREvent) {
      //@ts-ignore
      document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
  }

  private fileIsSupported(file: File) {
    return this.supportedExstensions.some(ext => {
      const fileName = file.name
      const fileNameSplit = fileName.split('.');
      const fileNameSplitLength = fileNameSplit.length;
      return ext.includes(fileNameSplit[fileNameSplitLength - 1])
    })
  }

  private resetFlags() {
    this.fileToUpload = null;
    this.tooManyFilesSelected = false;
    this.unsupportedFile = false;
  }

  public uploadImage() {
    this.uploadImageService.uploadImage(this.fileToUpload);
  }
}
