import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  pdfSrc: ArrayBuffer | undefined;

  constructor(private location: Location, private httpClient: HttpClient) { }

  ngOnInit() {
    this.loadPdf();
  }

  async loadPdf() {
    const pdfUrl = 'assets/docs/CGU.pdf';
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