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

  getObjectFromS3(key: string) {
    return this.s3.getObject({ Bucket: "mspr-infra-bucket", Key: "images/" + key }, (err, data) => {
      if (data.Body) {
        console.log(data.Body);
        return(data.Body);
      } else {
        console.log("error on s3 query");
        return;
      }
    });
    
  }
}