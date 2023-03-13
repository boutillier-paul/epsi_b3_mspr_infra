import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-advices',
  templateUrl: 'advices.page.html',
  styleUrls: ['advices.page.scss'],
})
export class AdvicesPage {

  searchTerm: string = '';
  advices: any[] = [];
  filteredAdvices: any[] = [];
  chunkSize = 15;
  loadedChunks = 1;
  limiteCaracteres = 75;
  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    this.loadAdvices();
  }

  loadAdvices() {
    this.api.getAllAdvices().subscribe((data) => {
      this.advices = data;
      this.filteredAdvices = data;
      console.log(this.advices);
    });
  }

  filterAdvices() {
    if (this.searchTerm === '') {
      this.filteredAdvices = this.advices;
      return;
    }
  
    this.filteredAdvices = this.advices.filter((advice) =>
      advice.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).sort((a, b) => {
      const aIndex = a.title.toLowerCase().indexOf(this.searchTerm.toLowerCase());
      const bIndex = b.title.toLowerCase().indexOf(this.searchTerm.toLowerCase());
      return aIndex - bIndex;
    });
  }

  loadMore(event: any) {
    const infiniteScroll = event.target;
    setTimeout(() => {
      this.loadedChunks++;
      infiniteScroll.complete();
    }, 500);
  
    if (this.loadedChunks * this.chunkSize >= this.advices.length) {
      infiniteScroll.disabled = true;
    }
  }

  saveAdviceId(id: number) {
    localStorage.setItem('selectedAdviceId', String(id));
    this.router.navigate(['/advice-click']);
  }

  async getAdvicePhoto(photo: string) {
    const s3 = new AWS.S3({
      region: 'eu-west-3'
    });
  
    const params = {
      Bucket: 'mspr-infra-bucket',
      Key: 'images/' + photo
    };
      
    s3.getObject(params, (err: any, data: { Body: { toString: (arg0: string) => any; }; }) => {
      if (err) {
        console.error(err); // an error occurre
      } else {
        if (data.Body) {
          const photo = data.Body.toString('utf-8');
          console.log(photo);
          return photo
        }
      }
      return;
    });
  }
  
}