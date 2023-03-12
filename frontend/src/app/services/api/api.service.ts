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
const api_url = "http://ec2-35-180-208-148.eu-west-3.compute.amazonaws.com";

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
    return of(localStorage.getItem('access_token')).pipe(
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
  
        return this.http.get(api_url + '/api/users/me', httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getUserById(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        const ague = localStorage.getItem('selectedUserId');

        return this.http.get(api_url + `/api/users/`+ ague, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getUserByIdParams(userid: number): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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

        return this.http.get(api_url + `/api/users/`+ userid, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getplants(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        const ague = localStorage.getItem('selectedPlantId');
  
        return this.http.get(api_url + '/api/plants/' + ague, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getplantsbyid(plantId: number): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
    
        return this.http.get(api_url + '/api/plants/' + plantId, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  postPlant(fd: any): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
      switchMap(jeton => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'GET,HEAD,OPTIONS,POST,PUT',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Authorization': 'Bearer ' + jeton,
          })
        };
  
        return this.http.post(api_url + '/api/plants/', fd, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getguard(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        const ague = localStorage.getItem('selectedGuardId');
  
        return this.http.get(api_url + '/api/guards/' + ague, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  postGuard(start_at: string, end_at: string): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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

        let postData = {
          "start_at": start_at,
          "end_at": end_at,
        };

        const ague = localStorage.getItem('selectedPlantId');

        return this.http.post(api_url + `/api/guards/` + "?plant_id="+ ague, postData, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  deleteGuard(guardId: number): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        let postData = {
          "guard_id": guardId
        };
  
        return this.http.delete(api_url + '/api/guards/' + postData, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getAllAdvices(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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

        return this.http.get(api_url + `/api/advices/`, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getAllAdvicesByAdviceName(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        
        const ague = localStorage.getItem('selectedAdviceName');

        return this.http.get(api_url + `/api/advices/search/${ague}`, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getAdvicesById(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        const ague = localStorage.getItem('selectedAdviceId');

        return this.http.get(api_url + `/api/advices/`+ ague, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  postAdvices(credentials: {title: string, content: string, photo: string}): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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

        let postData = {
          "title": credentials.title,
          "content": credentials.content,
          "photo": credentials.photo
        };

        return this.http.post(api_url + `/api/advices/`, postData, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  updateAdvices(credentials: {title: string, content: string}): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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

        const ague = localStorage.getItem('selectedAdviceId');

        let postData = {
          "title": credentials.title,
          "content": credentials.content
        };

        return this.http.put(api_url + `/api/advices/${ague}`, postData, httpOptions).pipe(
          map(res => {
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  deleteAdviceById(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        const ague = localStorage.getItem('selectedAdviceId');
  
        return this.http.delete(api_url + '/api/advices/' + ague, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getPlantsNearMe(posLat: number, posLng: number, radius: number): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
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
        
        let getData = {
          "pos_lat": posLat,
          "pos_lng": posLng,
          "radius": radius
        };

        return this.http.get(api_url + '/api/guards/open/around'+ getData, httpOptions).pipe(
          map(res => {
            console.log(res);
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  postPhoto(selectedFile: { filename: string, data: string }): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
      switchMap(jeton => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'GET,HEAD,OPTIONS,POST,PUT',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Authorization': 'Bearer ' + jeton,
          })
        };
  
        const byteCharacters = atob(selectedFile.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const file = new File([blob], selectedFile.filename, { type: blob.type });
  
        const postData = new FormData();
        postData.append('file', file);
  
        return this.http.post(api_url + `/api/photo/`, postData, httpOptions).pipe(
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

  

