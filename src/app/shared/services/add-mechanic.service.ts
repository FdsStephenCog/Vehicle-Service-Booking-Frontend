import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddMechanicService {
  private apiUrl = 'http://localhost:5030/api/Mechanic'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  addMechanic(mechanicData: { mechanicName: string; expertise: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl, mechanicData, { headers });
  }
}