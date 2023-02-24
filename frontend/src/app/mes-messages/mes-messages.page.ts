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
    // Générer des messages de test
    for (let i = 0; i < 10; i++) {
      const messageObj = { text: `Message ${i + 1}`, date: new Date(2022, 1, i + 1) };
      this.messages.unshift(messageObj);
    }
  }

  loadMore() {
    if (this.oldMessagesLoaded) {
      return;
    }

    const oldMessages = this.messages.slice(this.oldMessageOffset, this.oldMessageOffset + this.oldMessageLimit);
    this.oldMessageOffset += this.oldMessageLimit;

    if (oldMessages.length < this.oldMessageLimit) {
      this.oldMessagesLoaded = true;
    }

    this.oldMessages = [...this.oldMessages, ...oldMessages];
    this.showOldMessages = true;
  }

  sendMessage() {
    const newMessageObj = { text: this.newMessage, date: new Date() };
    this.newMessages.push(newMessageObj);
    this.newMessage = '';

    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 10);
  }
}
