import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private api: ApiService, private router: Router) {}

  async canActivate() {
    try {
      await this.api.checkToken().toPromise();
      return true;
    } catch (error) {
      this.router.navigate(['/home']);
      return false;
    }
  }
}