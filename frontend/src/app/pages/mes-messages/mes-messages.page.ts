import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { AlertController } from '@ionic/angular';

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

  constructor(private alertController: AlertController , private api: ApiService) { }

  intervalId: any;

  ngOnInit() {
    this.api.checkToken();
    this.api.getAllBotanists().subscribe((response: any) => {
      this.users = response.map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`
      }));
    });

    this.api.getyouruser().subscribe((response: any) => {
      const yourUserId = response.id;
      this.users = this.users.filter((user) => user.id !== yourUserId);
    });
  }

  saveSelectedUserId() {
    const selectedUser = this.users.find(user => user.id === this.userSelected);
    if (selectedUser) {
      localStorage.setItem('selectedUserId', selectedUser.id.toString());
      this.getMessages();
      this.intervalId = setInterval(() => {
      this.getMessages();
      }, 3000);
    }
  }

  getMessages() {
    if (this.userSelected) {
      this.api.getMessages(this.userSelected).subscribe((response: any) => {
        const mess = response;
        let messages = mess.map((message: any) => ({
          content: message.content,
          created_at: message.created_at,
          sender_id: message.sender_id,
          reciever_id: message.reciever_id,
          sender_first_name: '',
          sender_last_name: '',
          reciever_first_name: '',
          reciever_last_name: '',
          user_id: ''
        }));
        
        mess.forEach((message: any, index: number) => {
          const senderId = message.sender_id;
          this.api.getUserBySenderIdParams(senderId).subscribe((sender: any) => {
            messages[index].sender_first_name = sender.first_name;
            messages[index].sender_last_name = sender.last_name;
          });
          
          const recieverId = message.reciever_id;
          this.api.getUserByRecieverIdParams(recieverId).subscribe((reciever: any) => {
            messages[index].reciever_first_name = reciever.first_name;
            messages[index].reciever_last_name = reciever.last_name;
          });
          
          this.api.getUserById().subscribe((user: any) => {
            messages[index].user_id = user.id;
          });
        });
        
        setTimeout(() => {
          this.messages = messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).reverse();
        }, 500);
      });
    }
  }

  async sendMessage() {

    if (!/^[\w\s.;,()?!]+$/.test(this.credentials.content)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans le champ',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    if (this.credentials.content.trim() !== '') {
      const message = {
        user_id: this.userSelected,
        content: this.credentials.content.trim()
      };
      this.api.postMessages(message).subscribe((response: any) => {
        if (response.created_at) {
          this.credentials.content = '';
          this.showAlert('Succès', 'Message envoyé avec succès');
        } else if (response.detail) {
          this.showAlert('Erreur', response.detail);
        } else {
          this.showAlert('Erreur Inconnue', 'Une erreur inconnue est survenue.');
        }
      });
    }
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}