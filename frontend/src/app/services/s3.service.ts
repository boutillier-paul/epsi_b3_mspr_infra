import { Injectable } from '@angular/core';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({region: "eu-west-3"});
  }

  getObjectFromS3(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: "mspr-infra-bucket", Key: "images/" + key });

    return this.client.send(command)
      .then(response => {
        if(response.Body){
          console.log(response)
          console.log(response.Body)
          return response.Body.toString();
        }
        return '';
      })
      .catch(error => {
        console.error(error);
        return '';
      })
  }
}