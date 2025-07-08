import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MechanicService, Mechanic, CreateMechanicDto } from '../../../shared/services/mechanic.service';
import { ToastrService } from 'ngx-toastr'; // Make sure ngx-toastr is imported

@Component({
  selector: 'app-mechanics',
  standalone: true,
  templateUrl: './mechanic.html',
  styleUrls: ['./mechanic.css'],
  imports: [CommonModule, RouterModule],
})
export class MechanicComponent implements OnInit {
  mechanics: Mechanic[] = [];
  isLoading = true;
  errorMessage = '';

  showConfirmDialog: boolean = false;
  mechanicToDelete: Mechanic | null = null;


  private mechanicService = inject(MechanicService);
  private toastr = inject(ToastrService); // Inject ToastrService

  constructor() {}

  ngOnInit(): void {
    this.mechanicService.getMechanics().subscribe({
      next: (data) => {
        console.log('Mechanics:', data);
        this.mechanics = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load mechanics.';
        this.isLoading = false;
        this.toastr.error('Failed to load mechanics.', 'Error');
      },
    });
  }

  deleteMechanic(mechanic: Mechanic): void {
    console.log('Opening delete confirmation for mechanic:', mechanic.mechanicId);
    this.mechanicToDelete = mechanic;
    this.showConfirmDialog = true;
  }

  confirmDelete(): void {
    if (this.mechanicToDelete) {
      const id = this.mechanicToDelete.mechanicId;
      console.log('Confirming deletion for mechanic with ID:', id);

      this.mechanicService.deleteMechanic(id).subscribe({
        next: () => {
          console.log('Mechanic deleted successfully:', id);
          this.mechanics = this.mechanics.filter((m) => m.mechanicId !== id);
          this.toastr.success('Mechanic removed successfully.', 'Deleted!');
          this.closeConfirmDialog();
        },
        error: (err) => {
          console.error('Failed to delete mechanic:', err);
          this.toastr.error(err?.error?.message || 'Failed to delete mechanic.', 'Error');
          this.closeConfirmDialog();
        },
      });
    }
  }

  cancelDelete(): void {
    console.log('Deletion cancelled.');
    this.toastr.info('Deletion cancelled.', 'Cancelled');
    this.closeConfirmDialog();
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.mechanicToDelete = null;
  }

}