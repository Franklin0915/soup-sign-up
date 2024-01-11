import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form } from '../form';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  userForm = new Form('Franklin', 'Kwasi', '', '', '','','');

  loading: boolean = false; // Added loading flag

  constructor(private router: Router, private http: HttpClient) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSignIn(): void {
    this.loading = true;

    this.http
      .get<any>('https://soup-data-collection-default-rtdb.firebaseio.com/users.json')
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe({


next: (data: any) => {
  this.loading = false;
  // console.log(data);

 
  const userInputEmail = this.userForm.email_phone;
  const userInputPassword = this.userForm.password;

  //compare user input against the database
  for (const userId in data) {
    const user = data[userId];

    if ((user.email === userInputEmail || user.email_phone === userInputEmail) && user.password === userInputPassword) {
      
      alert('Login successful');
    
      // this.router.navigate(['/dashboard']);
      return; 
    }
  }

  // User login failed
  alert('Login credentials are incorrect. Please check your email and password.');
},
// ...

        error: (error: any) => {
          console.error('Error:', error.message || 'Server Error');
          this.loading = false;
          // Handle error, show appropriate message to the user
        }
      });
  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
