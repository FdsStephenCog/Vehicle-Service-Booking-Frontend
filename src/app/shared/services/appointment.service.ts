import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  bookingId: number;
  registrationNumber: string;
  customerName: string;
  mechanicName: string;
  serviceTypeDescription: string;
  date: string;
  timeSlot: string;
  price: number;
  serviceStatus: string;
  paymentStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceCenterAppointmentsService {
  private apiUrl = 'http://localhost:5030/api/ServiceCenter/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Ensure token is included
    });
    return this.http.get<Appointment[]>(this.apiUrl, { headers });
  }

  updateBookingStatus(bookingId: number, status: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Ensure token is included
    });
    return this.http.put<void>(
      `http://localhost:5030/api/ServiceCenter/update-booking-status/${bookingId}`,
      { status },
      { headers }
    );
  }
}