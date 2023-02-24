import { Injectable, forwardRef, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of, throwError, catchError } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';


const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const ID = 'id';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type' : 'application/json'})
};
const api_url = "http://ec2-15-188-64-21.eu-west-3.compute.amazonaws.com";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  private jeton = null;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    @Inject(forwardRef(() => HttpClient)) private http: HttpClient,
    private plt: Platform,
  ) {
    this.loadStoredToken();
  }
  
  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token); 
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  signup(credentials1: {nom: string, prenom: string, email: string}, credentials2: {login: string, pass: string}): Observable<any> {
    let postData = {
      "last_name": credentials1.nom,
      "first_name": credentials1.prenom,
      "email": credentials1.email,
      "login": credentials2.login,
      "password": credentials2.pass
    };
  
    return this.http.post(api_url+'/api/signup', postData).pipe(
      map(res => {
        console.log(res)
      
        return res;
      }),
      catchError(error => {
        return of(error.error);
      })
    );
  }
  login(credentials: {login: string, pass: string}): Observable<any> {
    let postData = {
      "login": credentials.login,
      "password": credentials.pass
    };
  
    return this.http.post(api_url+'/api/login', postData).pipe(
      map((res: {access_token?: string}) => { // spécifiez le type de l'objet renvoyé
        console.log(res);
  
        if (res && res.access_token) { // utilisez la notation pointée pour accéder à la propriété 'access_token'
          localStorage.setItem('access_token', res.access_token);
        }
  
        return res;
      }),
      catchError(error => {
        return of(error.error);
      })
    );
  }
  getyouruser(): Observable<any> {
    return of(localStorage.getItem(TOKEN_KEY)).pipe(
      switchMap(jeton => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'GET,HEAD,OPTIONS,POST,PUT',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jeton,
          })
        };
  
        console.log(jeton);
  
        return this.http.get(api_url + '/api/users/me', httpOptions).pipe(
          map(res => {
            console.log(res)
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  }

  

