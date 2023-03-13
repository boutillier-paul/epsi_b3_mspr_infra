import { Injectable } from '@angular/core';
import { S3 } from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  getObjectFromS3(bucket: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3.getObject({ Bucket: bucket, Key: key }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}