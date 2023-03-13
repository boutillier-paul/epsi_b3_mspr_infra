import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-mes-messages',
  templateUrl: './mes-messages.page.html',
  styleUrls: ['./mes-messages.page.scss'],
})
export class MesMessagesPage implements OnInit {
  users: { id: number, name: string }[] = [];
  userSelected: number | undefined;
  messages: any[] = [];
  credentials: {
    content: string,
  } = { content: '' };

  @ViewChild(IonContent) content: IonContent;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getAllBotanists().subscribe((response: any) => {
      this.users = response.map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`
      }));
      console.log(this.users);
    });

    this.api.getyouruser().subscribe((response: any) => {
      const yourUserId = response.id;
      console.log('Your user id:', yourUserId);
      this.users = this.users.filter((user) => user.id !== yourUserId);
    });
  }

  saveSelectedUserId() {
    const selectedUser = this.users.find(user => user.id === this.userSelected);
    if (selectedUser) {
      localStorage.setItem('selectedUserId', selectedUser.id.toString());

    }
  }

  getMessages() {
    if (this.userSelected) {
      this.api.getMessages(this.userSelected).subscribe((response: any) => {
        const mess = response;
        this.messages = mess.map((message: any) => ({
          content: message.content,
          created_at: message.created_at,
          sender_id: message.sender_id,
          reciever_id: message.reciever_id,
          s_first_name: '',
          s_last_name: '',
          r_first_name: '',
          r_last_name: '',
          user_id: ''
        }));
        mess.forEach((message: any, index: number) => {
          const senderId = message.sender_id;
          this.api.getUserBySenderIdParams(senderId).subscribe((sender: any) => {
            this.messages[index].s_first_name = sender.first_name;
            this.messages[index].s_last_name = sender.last_name;
            console.log('Tableau après get user par sender ID', this.messages);
          });
          const recieverId = message.reciever_id;
          this.api.getUserByRecieverIdParams(recieverId).subscribe((reciever: any) => {
            this.messages[index].r_first_name = reciever.first_name;
            this.messages[index].r_last_name = reciever.last_name;
            console.log('Tableau après get user par reciever ID', this.messages);
          });
          this.api.getUserById().subscribe((user: any) => {
            this.messages[index].user_id = user.id;
            console.log('Tableau après get user par reciever ID', this.messages);
          });
        });
      });
    }
  }

  sendMessage() {
    if (this.credentials.content.trim() !== '') {
      const message = {
        user_id: this.userSelected,
        content: this.credentials.content.trim()
      };
      this.api.postMessages(message).subscribe((response: any) => {
        if (response.success) {
          this.credentials.content = '';
          alert('Message envoyé avec succès');
        } else {
          alert('Erreur lors de l\'envoi du message');
        }
      });
    }
  }
}