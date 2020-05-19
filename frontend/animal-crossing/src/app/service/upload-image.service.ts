import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(
    private http: HttpClient
  ) { }

  private getSignedS3Url(): Observable<any> {
    return of({
      "signedUrl": "https://animal-xing-img-testing-528.s3.amazonaws.com/4b7cdd43-ee07-4ea3-ba01-fee7f4cb350d.jpg?AWSAccessKeyId=ASIA264G4FCUA76WZ7UM&Content-Type=image%2Fjpeg&Expires=1589865962&Signature=374y5rdx3CT4OW1KryFzT3SDoIg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJ7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFDeEpEko%2FYeEcS6gJN99L%2Fh8ywSPS5%2Bq7nmrEIuyAYkAiEA9o1wmaVUSSDxiw8un3sWT7o5H6KyDdx%2BjKRZiyl0SnMq1gEI5v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw3NTM1MTI3NTMzMjAiDDsb04Xc%2FL34M5nRcCqqAWYFW23BLFj%2FqE5HC3aaBetbjGvM529uoT075fr5OayXgaLVVRCnwZKK3sxBcNuFlEw3vvH4WKQjMK4YfCbu9dC6e4%2BEHcFXNcPpCtevTp65BBed4uK6Imf2KN9sVUYCoVD%2BUbmCt61seJFLY30IXjNiEUfUi9MQC8X8aZWwldR5XPu%2Bo6gWcLA%2B6eMh%2BVoBWgXNNUzBpa%2B1XoG32JmhxZ%2BARYh8ySXaHjyrMOTUjfYFOuAB9w3Be9MvwUZGAfrhkbw3lKHb4YHIMCNYU83eSjlRS9Kyx8rTZM7F9fTJ0QijwoaQCTTcgUoy5Edt%2Fd0m3dESX4zSpf6vODu6D3jsbL0vCoiWc7izjao%2Fno%2Fy1DXvy15t0pE7VqMAvXsOCTlB9U6zVs7VdeOVNDJpbicAYZCM10CnK4ufd%2F69g40to9YVVzUNKUrObKswXMAJqL3Mn8Y2HUijXr0d6Ls5NvSlShUL979my0TbxF54iAQUTwEYvBjtFeeD6uqtHR0ys0U0yZMJhBE9jPpf%2FkRiYltGx8WEurk%3D",
      "key": "4b7cdd43-ee07-4ea3-ba01-fee7f4cb350d"
    });
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

  public uploadImage(image: File) {
    this.getSignedS3Url().subscribe(s3Url => {
      this.uploadToS3(s3Url.signedUrl, image).subscribe();
    })

  }
}
