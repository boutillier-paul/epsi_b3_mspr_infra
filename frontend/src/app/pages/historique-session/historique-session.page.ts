import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-historique-session',
  templateUrl: './historique-session.page.html',
  styleUrls: ['./historique-session.page.scss'],
})
export class HistoriqueSessionPage implements OnInit {
  limiteCaracteres = 30;
  sessions: any[] = [];
  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  ngOnInit() {
    this.api.checkToken();
    this.api.getsessions().subscribe(
      (response: any[]) => {
        this.sessions = response;
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: error,
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  voirPlus(session: any) {
    const SessionSelectionnee = {
      created_at: session.created_at,
      report: session.report,
      photo: session.photo
    };
    localStorage.setItem('SessionSelectionnee', JSON.stringify(SessionSelectionnee));
    this.router.navigateByUrl('/historique-session-click');
  }
}



