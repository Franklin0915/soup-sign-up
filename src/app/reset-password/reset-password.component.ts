import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Form } from '../form';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  userForm = new Form('Franklin', 'Kwasi', '', '', '', '', '');

  loading: boolean = false;
  showSuccessMessage: boolean = false;
  userId: string = ''; // Add this line to store the user ID

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    // Retrieve the email parameter from the route
    const email = this.route.snapshot.queryParams['email'];
    this.userId = this.route.snapshot.queryParams['userId']; // Add this line to store the user ID
    console.log('User Email in reset-password:', email);
    console.log('User ID in reset-password:', this.userId);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
  }

  onSignIn(): void {
    this.router.navigate(['/signIn']);
  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  validateEmailOrPhone(): void {
    // Implement the validation logic here
  }

  onResetPassword(): void {
    const email = this.route.snapshot.queryParams['email'];

    if (!email) {
      console.error('Email not provided.');
      return;
    }

    if (this.userForm.password !== this.userForm.confirmPassword) {
      console.error('Password and confirm password do not match.');
      return;
    }

    console.log('Reset Password Button Clicked');

    // Construct the URL for updating the user's data
    const patchUrl = `https://soup-data-collection-default-rtdb.firebaseio.com/users/${this.userId}.json`;

    // Update the existing password and confirmPassword fields
    this.http.patch(patchUrl, {
      password: this.userForm.password,
      confirmPassword: this.userForm.confirmPassword
    }).subscribe(
      (response) => {
        console.log('Password updated successfully:', response);
        this.showSuccessMessage = true;
      },
      (error) => {
        console.error('Error updating password:', error);
        // Handle the error as needed
      }
    );
  }

  setConfirmPasswordTyped(): void {
    // Implement any logic needed when the confirm password field is blurred
  }

  toSuccessMessage(): void {
    this.showSuccessMessage = true;
  }

  pass = this.userForm.password;
  conf = this.userForm.confirmPassword;
  checkPasswordMatch = false;

  ComparePasswordMatch(): void {
    if (this.pass !== this.conf) {
      this.checkPasswordMatch = true;
    }
  }
}
