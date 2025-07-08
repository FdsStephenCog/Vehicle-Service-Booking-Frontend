import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  profile: any = {
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceCenterName: '',
    serviceCenterLocation: '',
    serviceCenterContact: ''
  };

  isServiceCenter = false;
  isSubmitting = false;
  isEditing = false;
  avatarLetter: string = '';

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.isServiceCenter = !!res.serviceCenterName;

        if (res.name && typeof res.name === 'string') {
          this.avatarLetter = res.name.charAt(0).toUpperCase();
        }
      },
      error: () => {
        this.toastr.error('Failed to load profile');
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
      },
      error: () => {
        this.toastr.error('Failed to reset profile');
      }
    });
  }

  onUpdate(form: NgForm): void {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.userService.updateProfile(this.profile).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.isSubmitting = false;
        this.isEditing = false;
        if (this.profile.name && typeof this.profile.name === 'string') {
          this.avatarLetter = this.profile.name.charAt(0).toUpperCase();
        }
      },
      error: () => {
        this.toastr.error('Failed to update profile');
        this.isSubmitting = false;
      }
    });
  }
}