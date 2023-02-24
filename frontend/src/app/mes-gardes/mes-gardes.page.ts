import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-mes-gardes',
  templateUrl: './mes-gardes.page.html',
  styleUrls: ['./mes-gardes.page.scss'],
})
export class MesGardesPage implements OnInit {
  
  constructor(private router: Router, private storage: Storage) { }

  ngOnInit() {
  }

  gardes = [
    { espece: 'Lavande', name: 'Alice', startdate: '01/03/23', enddate: '05/03/23' },
    { espece: 'Rosier', name: 'Bob', startdate: '01/03/23', enddate: '20/03/23'},
    { espece: 'Basilic', name: 'Charlie', startdate: '05/04/23', enddate: '10/04/23' },
    { espece: 'Thym', name: 'David', startdate: '24/04/23', enddate: '28/04/23' }
  ];

  voirPlus(plante: any) {
    const gardeSelectionnee = {
      espece: plante.espece,
      name: plante.name,
      startdate: plante.startdate,
      enddate: plante.enddate
    };
    localStorage.setItem('gardeSelectionnee', JSON.stringify(gardeSelectionnee));
    this.router.navigateByUrl('/mes-gardes-click');
  }
  
}



