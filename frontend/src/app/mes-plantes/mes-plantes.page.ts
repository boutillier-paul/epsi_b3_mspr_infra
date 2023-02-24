import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-mes-plantes',
  templateUrl: './mes-plantes.page.html',
  styleUrls: ['./mes-plantes.page.scss'],
})
export class MesPlantesPage implements OnInit {
  
  constructor(private router: Router, private storage: Storage) { }

  ngOnInit() {
  }

  plantes = [
    { espece: 'Lavande', name: 'Alice', startdate: '24/04/02', statusgarde: 'true' },
    { espece: 'Rosier', name: 'Bob', startdate: ''},
    { espece: 'Basilic', name: 'Charlie' },
    { espece: 'Thym', name: 'David' },
    { espece: 'Menthe' }
  ];

  voirPlus(plante: any) {
    const planteSelectionnee = {
      espece: plante.espece,
      name: plante.name,
      startdate: plante.startdate,
      statusgarde: plante.statusgarde
    };
    localStorage.setItem('planteSelectionnee', JSON.stringify(planteSelectionnee));
    this.router.navigateByUrl('/mes-plantes-click');
  }
  // POST Get espece, name where id stocked = user_id /plants/owner/userid
}



