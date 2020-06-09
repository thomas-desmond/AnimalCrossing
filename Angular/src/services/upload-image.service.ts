import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { s3SignedUrl } from '../app/models/s3SignedUrl';
import { environment } from '../environments/environment'
import { CookieService } from 'ngx-cookie-service';
import { Constants } from '../app/constants/constants';
import { DesignType } from 'src/app/models/DesignType';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { ImageMetadata } from 'src/app/models/ImageMetadata';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  public designTypes$: Observable<DesignType[]>
  private imageMetadata = new ImageMetadata();

  private getS3SignedUrlEndpoint = environment.apigatewayBaseUrl + '/get-signed-s3-url';
  private saveImageMetadataUrlEndpoint = environment.apigatewayBaseUrl + '/save-image-meta-data';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {
    this.setupDesignTypes()
  }

  private setupDesignTypes() {
    const hardcodedDesignTypes: DesignType[] = [
      new DesignType(1, 'Balloon-hem dress'),
      new DesignType(2, 'Brimmed Cap'),
      new DesignType(3, 'Coat'),
      new DesignType(4, 'Brimmed Hat'),
    ];

    this.designTypes$ = of(hardcodedDesignTypes).pipe(
      map(dt => this.organizeByProperty(dt, 'name'))
    );
  }

  private organizeByProperty(designArray: DesignType[], property: string) {
    return designArray.sort((a, b) => (a[property] > b[property]) ? 1 : -1)
  }

  private getSignedS3Url(): Observable<any> {
    const requestOptions = this.createRequestOptionsWithAuthToken();

    return this.http.get<s3SignedUrl>(this.getS3SignedUrlEndpoint, requestOptions);
  }

  public uploadImage(image: File, userCompletedForm: FormGroup) {
   
    this.imageMetadata.uploadDate = new Date(Date.now()).toISOString();

    this.getSignedS3Url().subscribe(s3Url => {
      this.imageMetadata.imageGuid = s3Url.key;
      this.uploadToS3(s3Url.signedUrl, this.renameImageToMatchSignedUrlKey(image, s3Url)).subscribe(() => {
        this.fillInMetadataBasedOnUserForm(userCompletedForm); // TODO: This seems shitty, need more automatic way to take image upload form and turn it into Dynamo object
        console.log(this.imageMetadata);    
        this.saveImageMetaData(this.imageMetadata).subscribe();
      });
    })
  }

  fillInMetadataBasedOnUserForm(userForm: FormGroup): ImageMetadata {
    this.imageMetadata.imageDescription = userForm.get('description').value;
    this.imageMetadata.designCode = userForm.get('designCode').value;
    this.imageMetadata.title = userForm.get('title').value;
    return this.imageMetadata;
  }

  private renameImageToMatchSignedUrlKey(image: File, s3Url: any) {
    const blob = image.slice(0, image.size, 'image/jpeg');
    const newFile = new File([blob], `${s3Url.key}.jpg`, { type: 'image/jpeg' });
    return newFile;
  }


  private uploadToS3(signedUrl, image) {
    const headers = {
      headers: {
        "Content-Type": image.type
      },
      params: {
        clientFilename: image.name,
        mimeType: image.type
      }
    }
    return this.http.put<any>(signedUrl, image, headers)
  }

  private saveImageMetaData(imageMetadata: ImageMetadata) {
    const requestOptions = this.createRequestOptionsWithAuthToken();

    return this.http.post(this.saveImageMetadataUrlEndpoint, JSON.stringify(imageMetadata), requestOptions);
  }

  private convertFormToJson(userCompletedForm: FormGroup) {
    const formObj = userCompletedForm.getRawValue();
    const serializedForm = JSON.stringify(formObj);
    return serializedForm;
  }

  private createRequestOptionsWithAuthToken() {
    const token = this.cookieService.get(Constants.cookieTokenName);
    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      }),
    };
    return requestOptions;
  }
}
