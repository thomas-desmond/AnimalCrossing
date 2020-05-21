import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { s3SignedUrl } from '../models/s3SignedUrl';
import { environment } from '../../environments/environment'
import { CookieService } from 'ngx-cookie-service';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  private getS3SignedUrlEndpoint = environment.apigatewayBaseUrl + '/get-signed-s3-url';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

    // Validate user token

  private getSignedS3Url(): Observable<any> {

    const cookie = this.cookieService.get(Constants.cookieTokenName);
    console.log('COPOOOOKIE', cookie);
    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'PUT AUTH HERE'
      }),
    };

    return this.http.get<s3SignedUrl>(this.getS3SignedUrlEndpoint, requestOptions);
  }


  public uploadImage(image: File) {
    this.getSignedS3Url().subscribe(s3Url => {   
      this.uploadToS3(s3Url.signedUrl, this.renameImageToMatchSignedUrlKey(image, s3Url)).subscribe();
    })
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
}
