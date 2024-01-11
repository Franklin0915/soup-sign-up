// new-email-verification.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Form } from '../form';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-new-email-verification',
  templateUrl: './new-email-verification.component.html',
  styleUrls: ['./new-email-verification.component.css']
})
export class NewEmailVerificationComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  userForm = new Form('', '', '', '', '', '', '');
  showSuccessMessage: boolean = false;
  countdown: number = 300;
  countdownInterval: any;
  loading: boolean = false;
  userEmail: string = ''; // Add the userEmail property
  userId:any='';

  ngOnInit(): void {
    // Retrieve the email parameter from the route
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'];
      this.userId = params['userId']; // Add this line to store the user ID
      console.log('User Email in new-email-verification:', this.userEmail);
      console.log('User ID in new-email-verification:', this.userId); // Log the user ID
    });
  
    // Handle any other initialization logic here if needed
  }
  

  startCountdown(): void {
    this.countdown = 300;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  NavigateToEmailVerification(): void {
    this.startCountdown();
  }

  resendVerificationCode(): void {
    this.startCountdown();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  getUserData(userEmail: string): Observable<any> {
    const endpoint = `https://soup-data-collection-default-rtdb.firebaseio.com/users.json?email_phone=${userEmail}`;
    return this.http.get<any>(endpoint, { observe: 'response' }).pipe(
      catchError(this.errorHandler.bind(this)),
      map(response => {
        if (response && response.body) {
          return { [userEmail]: response.body };
        }
        return null;
      })
    );
  }

  checkResetVerificationCode(): void {
    this.loading = true;
  
    this.route.queryParams.pipe(
      switchMap(params => {
        const userEmail = params['email'];
  
        if (userEmail && userEmail.trim() !== '') {
          return this.getUserData(userEmail);
        } else {
          console.error('No valid email found in query parameters.');
          this.loading = false;
          return throwError('No valid email found in query parameters.');
        }
      })
    ).subscribe({
      next: (result: any) => {
        this.loading = false;
  
        if (result && result[this.userEmail]) {
          const userInputResetVerificationCode = this.userForm.resetVerificationCode;
  
          const userData = result[this.userEmail];
          const userIds = Object.keys(userData);
  
          // Use the find method to find the first matching user
          const matchedUser = userIds.find(userId => {
            const user = userData[userId];
            const storedResetVerificationCode = String(user.resetVerificationCode);
            return storedResetVerificationCode === userInputResetVerificationCode;
          });
  
          if (matchedUser) {
            // Code matches, navigate to the reset password page
            this.router.navigate(['/resetPassword'], {
              queryParams: { userId: matchedUser, email: this.userEmail }
            });
  
            console.log('Working - Code Matches');
          } else {
            alert('No user found with matching verification code.');
          }
        } else {
          console.error('No user data found for the provided email.');
        }
      },
      error: (error: any) => {
        console.error('Error:', error.message || 'Server Error');
        this.loading = false;
      }
    });
  }
  

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
