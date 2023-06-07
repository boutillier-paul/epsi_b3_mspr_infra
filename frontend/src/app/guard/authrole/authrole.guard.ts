import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleGuard implements CanActivate {

  constructor(private api: ApiService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.api.checkToken().toPromise().then(() => {
        this.api.checkRole().toPromise().then(() => {
          resolve(true);
        }).catch(() => {
          this.router.navigate(['/advices']);
          resolve(false);
        });
      }).catch(() => {
        this.router.navigate(['/home']);
        resolve(false);
      });
    });
  }
}