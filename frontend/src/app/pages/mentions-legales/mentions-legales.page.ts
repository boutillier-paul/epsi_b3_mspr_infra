import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mentions-legales',
  templateUrl: './mentions-legales.page.html',
  styleUrls: ['./mentions-legales.page.scss'],
})
export class MentionsLegalesPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}