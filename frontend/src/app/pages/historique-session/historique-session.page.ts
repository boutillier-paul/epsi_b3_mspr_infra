import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-historique-session',
  templateUrl: './historique-session.page.html',
  styleUrls: ['./historique-session.page.scss'],
})
export class HistoriqueSessionPage implements OnInit {
  limiteCaracteres = 30;
  constructor(private router: Router, private storage: Storage) { }

  ngOnInit() {
  }

  plantes = [
    { created_at: '05/02/23', rapport: '', sessionpic: 'https://cdn.vox-cdn.com/thumbor/WR9hE8wvdM4hfHysXitls9_bCZI=/0x0:1192x795/1400x1400/filters:focal(596x398:597x399)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg'},
    { created_at: '04/02/23', rapport: 'Ta plante est en bonne santée', sessionpic: 'https://www.smashbros.com/assets_v2/img/fighter/piranha_plant/main.png'},
    { created_at: '03/02/23', rapport: 'J\'ai retrouvé ta plante', sessionpic: 'https://64.media.tumblr.com/3f123b69b10b0dd026d943bff80ccd4f/tumblr_pqvzrgpXl01riqta7_640.jpg' },
    { created_at: '02/02/23', rapport: 'J\'ai perdu ta plante, elle doit sûrement être chez le voisin.', sessionpic: 'https://m.media-amazon.com/images/I/51vokPIQivL._AC_SY550_.jpg'},
    { created_at: '01/02/23', rapport: 'Rien à signaler pour l\'instant', sessionpic: 'https://i.ytimg.com/vi/83tSUi5YbCQ/maxresdefault.jpg' },
  ];

  voirPlus(plante: any) {
    const SessionSelectionnee = {
      created_at: plante.created_at,
      rapport: plante.rapport,
      sessionpic: plante.sessionpic
    };
    localStorage.setItem('SessionSelectionnee', JSON.stringify(SessionSelectionnee));
    this.router.navigateByUrl('/historique-session-click');
  }
  // //
}



