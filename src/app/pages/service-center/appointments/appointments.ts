import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCenterAppointmentsService } from '../../../shared/services/appointment.service';
import { FormsModule } from '@angular/forms';
import { scheduled } from 'rxjs';

@Component({
  selector: 'appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class AppointmentsComponent {
  appointments: any[] = [];
  pendingAppointments: any[] = [];
  completedAppointments: any[] = [];
  cancelledAppointments: any[] = [];

  isLoading = false;
  errorMessage: string | null = null;

  // Pagination
  currentPage = {
    scheduled: 1,
    completed: 1,
    cancelled: 1
  };
  itemsPerPage = 5;

  constructor(private appointmentService: ServiceCenterAppointmentsService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.appointmentService.getAppointments().subscribe({
      next: (res) => {
        this.appointments = res;
        this.pendingAppointments = res.filter(a => a.serviceStatus === 'Scheduled');
        this.completedAppointments = res.filter(a => a.serviceStatus === 'Completed');
        this.cancelledAppointments = res.filter(a => a.serviceStatus === 'Cancelled');
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load appointments. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  markAsCompleted(appointmentId: number): void {
    this.isLoading = true;
    this.appointmentService.updateBookingStatus(appointmentId, 'Completed').subscribe({
      next: () => this.loadAppointments(),
      error: () => {
        this.errorMessage = 'Failed to update status.';
        this.isLoading = false;
      }
    });
  }

  // Helper for pagination
  getPaginatedData(data: any[], type: 'scheduled' | 'completed' | 'cancelled') {
    const start = (this.currentPage[type] - 1) * this.itemsPerPage;
    return data.slice(start, start + this.itemsPerPage);
  }

  getTotalPages(data: any[]) {
    return Math.ceil(data.length / this.itemsPerPage);
  }

  changePage(type: 'scheduled' | 'completed' | 'cancelled', newPage: number) {
    this.currentPage[type] = newPage;
  }
}