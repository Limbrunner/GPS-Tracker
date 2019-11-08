import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:4000';

constructor(private http: HttpClient) { }

getAll() {
  return this.http.get<any[]>(`${this.apiUrl}/users`);
}

}
