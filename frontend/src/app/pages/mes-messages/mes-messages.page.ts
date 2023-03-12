import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-mes-messages',
  templateUrl: './mes-messages.page.html',
  styleUrls: ['./mes-messages.page.scss'],
})
export class MesMessagesPage implements OnInit {
  users: string[] = ['User 1', 'User 2', 'User 3'];
  selectedUser: string = 'User 1';
  messages: any[] = [];
  newMessages: any[] = [];
  oldMessages: any[] = [];
  showOldMessages: boolean = false;
  oldMessageLimit: number = 10;
  oldMessageOffset: number = 0;
  oldMessagesLoaded: boolean = false;
  newMessage: string = '';

  @ViewChild(IonContent) content: IonContent;

  constructor() { }

  ngOnInit() {
  }
}
