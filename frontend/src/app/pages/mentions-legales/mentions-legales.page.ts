import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-mentions-legales',
  templateUrl: './mentions-legales.page.html',
  styleUrls: ['./mentions-legales.page.scss'],
})
export class MentionsLegalesPage implements OnInit {
  pdfSrc: ArrayBuffer | undefined;

  constructor(private location: Location, private httpClient: HttpClient) { }

  ngOnInit() {
    this.loadPdf();
  }

  async loadPdf() {
    const pdfUrl = 'assets/docs/Mentions-legales.pdf';
    try {
      const pdfData = await this.httpClient.get(pdfUrl, { responseType: 'arraybuffer' }).toPromise();
      this.pdfSrc = pdfData;
    } catch (error) {
    }
  }

  goBack() {
    this.location.back();
  }

}