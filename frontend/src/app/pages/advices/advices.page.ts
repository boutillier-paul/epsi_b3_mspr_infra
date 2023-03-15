import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advices',
  templateUrl: 'advices.page.html',
  styleUrls: ['advices.page.scss'],
})
export class AdvicesPage {

  @ViewChild('deconnexionLink', { static: true }) deconnexionLink: ElementRef;

  searchTerm: string = '';
  advices: any[] = [];
  filteredAdvices: any[] = [];
  chunkSize = 15;
  loadedChunks = 1;
  limiteCaracteres = 75;
  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    this.api.checkToken();
    this.loadAdvices();
  }

  loadAdvices() {
    this.api.getAllAdvices().subscribe((data) => {
      this.advices = data;
      this.filteredAdvices = data;
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
}