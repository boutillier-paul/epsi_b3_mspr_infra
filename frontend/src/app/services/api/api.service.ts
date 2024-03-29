import { Injectable, forwardRef, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of, throwError, catchError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const api_url = "http://ec2-15-188-52-160.eu-west-3.compute.amazonaws.com";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
    private alertController: AlertController,
    private router: Router,
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
  
    return this.http.post(api_url + '/api/signup', postData).pipe(
      map(res => {
      
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
  
    return this.http.post(api_url + '/api/login', postData).pipe(
      map((res: {access_token?: string}) => { 
  
        if (res && res.access_token) { 
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
        const user_id = localStorage.getItem('selectedUserId');

        return this.http.get(api_url + `/api/users/`+ user_id, httpOptions).pipe(
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
  getAllBotanists(): Observable<any> {
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
  
        return this.http.get(api_url + '/api/users/botanists', httpOptions).pipe(
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
        const plant_id = localStorage.getItem('selectedPlantId');
  
        return this.http.get(api_url + '/api/plants/' + plant_id, httpOptions).pipe(
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
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  postPlant(credentials: {name: string, species: string, photo: string, pos_lat: number, pos_lng: number}): Observable<any> {
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
  
        let postData = {
          "name": credentials.name,
          "species": credentials.species,
          "photo": credentials.photo,
          "pos_lat": credentials.pos_lat,
          "pos_lng": credentials.pos_lng
        };

        return this.http.post(api_url + '/api/plants/', postData, httpOptions).pipe(
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
  deletePlant(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
      switchMap(jeton => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jeton,
          })
        };
        
        const plant_id = localStorage.getItem('selectedPlantId');

        return this.http.delete(api_url + '/api/plants/' + plant_id, httpOptions).pipe(
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
        const guard_id = localStorage.getItem('selectedGuardId');
  
        return this.http.get(api_url + '/api/guards/' + guard_id, httpOptions).pipe(
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

        const plant_id = localStorage.getItem('selectedPlantId');

        return this.http.post(api_url + `/api/guards/` + "?plant_id="+ plant_id, postData, httpOptions).pipe(
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
            'Access-Control-Allow-Method': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jeton,
          })
        };
        

        return this.http.delete(api_url + '/api/guards/' + guardId, httpOptions).pipe(
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
  cancelGuard(): Observable<any> {
    return of(localStorage.getItem('access_token')).pipe(
      switchMap(jeton => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jeton,
          })
        };
  
        const guard_id = localStorage.getItem('selectedGuardId');

        const body = JSON.stringify({});

        return this.http.put(api_url + `/api/guards/${guard_id}/cancel`, body,  httpOptions).pipe(
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
  getsessions(): Observable<any> {
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
        const guard_id = localStorage.getItem('selectedGuardId');
  
        return this.http.get(api_url + '/api/sessions/guard/' + guard_id, httpOptions).pipe(
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
  postSession(credentials: {photo: string, report: string}): Observable<any> {
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
  
        let postData = {
          "photo": credentials.photo,
          "report": credentials.report,
        };

        const guard_id = localStorage.getItem('selectedGuardId');

        return this.http.post(api_url + '/api/sessions' + "?guard_id="+ guard_id, postData, httpOptions).pipe(
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
        
        const advice_id = localStorage.getItem('selectedAdviceName');

        return this.http.get(api_url + `/api/advices/search/${advice_id}`, httpOptions).pipe(
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
        const advice_id = localStorage.getItem('selectedAdviceId');

        return this.http.get(api_url + `/api/advices/`+ advice_id, httpOptions).pipe(
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

        const advice_id = localStorage.getItem('selectedAdviceId');

        let postData = {
          "title": credentials.title,
          "content": credentials.content
        };

        return this.http.put(api_url + `/api/advices/${advice_id}`, postData, httpOptions).pipe(
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
        const advice_id = localStorage.getItem('selectedAdviceId');
  
        return this.http.delete(api_url + '/api/advices/' + advice_id, httpOptions).pipe(
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

        const params = new HttpParams()
          .set('pos_lat', posLat.toString())
          .set('pos_lng', posLng.toString())
          .set('radius', radius.toString());
  
        return this.http.get(api_url + '/api/guards/open/around', { params, ...httpOptions }).pipe(
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
  takeGuard(selectedGuardId: number): Observable<any> {
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
  
        const body = JSON.stringify({});
  
        return this.http.put(api_url + `/api/guards/${selectedGuardId}/take`, body, httpOptions).pipe(
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
            return res;
          }),
          catchError(error => {
            return of(error.error);
          })
        );
      })
    );
  }
  getMessages(userSelected : number): Observable<any> {
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

        return this.http.get(api_url + `/api/messages/`+ userSelected, httpOptions).pipe(
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
  postMessages(message: {content: string}): Observable<any> {
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
          "content": message.content,
        };

        const user_id = localStorage.getItem('selectedUserId');

        return this.http.post(api_url + `/api/messages/`+ user_id, postData, httpOptions).pipe(
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
  getUserBySenderIdParams(senderid: number): Observable<any> {
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

        return this.http.get(api_url + `/api/users/`+ senderid, httpOptions).pipe(
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
  getUserByRecieverIdParams(recieverid: number): Observable<any> {
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

        return this.http.get(api_url + `/api/users/`+ recieverid, httpOptions).pipe(
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
  updateUser(credentials: {first_name: string, last_name: string, email: string}): Observable<any> {
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
          "last_name": credentials.last_name,
          "first_name": credentials.first_name,
          "email": credentials.email
        };

        return this.http.put(api_url + `/api/users/me`, postData, httpOptions).pipe(
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

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/');
    this.userData.next(null);
  }

  checkToken(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
  
    if (!access_token) {
      this.tokenAlert();
      this.router.navigate(['/home']);
      return from(Promise.reject('Token not found'));
    }
  
    return this.getyouruser().pipe(
      map((response) => {
        if (response.created_at) {
          return response;
        } else if (response.detail || response.error) {
          this.tokenAlert();
          this.router.navigate(['/home']);
          throw new Error('Token is invalid');
        }
      }),
      catchError((error) => {
        this.tokenAlert();
        this.router.navigate(['/home']);
        return from(Promise.reject(error));
      })
    );
  }
  
  async tokenAlert() {
    const alert = await this.alertController.create({
      header: 'Erreur de token',
      message: 'Le token est invalide',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  
  checkRole(): Observable<any> {
    return new Observable((observer) => {
      this.getyouruser().subscribe((response) => {
        if (response.role_id === 1) {
          this.roleAlert();
          this.router.navigate(['/advices']);
          observer.error();
        } else if (response.detail || response.error) {
          this.roleAlert();
          this.router.navigate(['/advices']);
          observer.error();
        } else {
          observer.next();
          observer.complete();
        }
      }, (error) => {
        this.roleAlert();
        this.router.navigate(['/advices']);
        observer.error();
      });
    });
  }
  
  async roleAlert() {
    const alert = await this.alertController.create({
      header: 'Accès limité',
      message: 'Vous n\'avez pas le role requis pour accéder à cette page',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  }

  

