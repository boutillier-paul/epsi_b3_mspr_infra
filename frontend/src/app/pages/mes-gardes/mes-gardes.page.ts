import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-mes-gardes',
  templateUrl: './mes-gardes.page.html',
  styleUrls: ['./mes-gardes.page.scss'],
})
export class MesGardesPage implements OnInit {
  
  gardes: any[] = [];

  constructor(
    private router: Router,
    private storage: Storage,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.api.checkToken();
    this.api.getyouruser().subscribe((response: any) => {
      const guards = response.guards;
      this.gardes = guards.map((guard: any) => {
        return {
          id: guard.id,
          name: '',
          species: '',
          start_at: guard.start_at,
          end_at: guard.end_at,
        };
      });
      guards.forEach((guard: any, index: number) => {
        const plantId = guard.plant_id;
        this.api.getplantsbyid(plantId).subscribe((plant: any) => {
          this.gardes[index].name = plant.name;
          this.gardes[index].species = plant.species;
        });
      });

      this.gardes.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());
    });
  }

  voirPlus(garde: any) {
    localStorage.setItem('selectedGuardId', garde.id);
    this.router.navigateByUrl('/mes-gardes-click');
  }
  
}