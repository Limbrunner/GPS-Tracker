import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, NgxSoapService } from 'ngx-soap';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ********** Fake Auth ********** //
  apiUrl = 'http://localhost:4000';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${this.apiUrl}/users/authenticate`, { username, password })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // ********** SOAP ********** //
/*   // Client for SOAP-Client
  client: Client;
  wsdlFile: any; // wsdl file link
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private soap: NgxSoapService) {
    this.soap.createClient(this.wsdlFile)
      .then(client => {
        // console.log('Client', client);
        this.client = client;
      })
      .catch(err => console.log('SOAP Error', err));
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(model: any) {
    return this.client.call('loginMethod', model)
      .pipe(
        map((response: any) => {
          const user = response;
          // store user details in local storage and set token
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', 'active');
            this.currentUserSubject.next(user);
          }
          return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to NULL
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  } */
}
