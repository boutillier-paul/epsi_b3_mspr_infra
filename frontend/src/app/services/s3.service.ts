import { Injectable } from '@angular/core';
import { S3 } from 'aws-sdk';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  getObjectFromS3(key: string): Observable<any> {
    return new Observable(observer => {
      this.s3.getObject({ Bucket: "mspr-infra-bucket", Key: "images/" + key }, (err, data) => {
        if (err) {
          observer.error(err);
          observer.complete();
        } else {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }
}