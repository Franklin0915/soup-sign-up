import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Form } from '../form';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  userForm = new Form('', '', '', '', '', '','');
  showSuccessMessage: boolean = false;
  countdown: number = 300;
  countdownInterval: any;
  currentAction: 'signIn' | 'resetPassword' = 'signIn';
  loading: boolean = false;
  userData: any; // Variable to store user data
  //initial code

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const action = params['action'];
  
      if (action === 'signup') {
        this.handleSignUpVerification();
      } else if (action === 'resetPassword') {
        this.ResetPassword();
      }
    });
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

  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
  }

  ToSignIn(): void {
    this.router.navigate(['/signIn']);
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

  handleSignUpVerification(): void {
    this.getVerificationCode();
  }

  getVerificationCode(): void {
    this.loading = true;
    // console.log('test 1')

    this.route.queryParams.subscribe(params => {
      const userEmail = params['email'];

      if (userEmail && userEmail.trim() !== '') {
        // console.log('Valid email found:', userEmail);

        this.getUserData(userEmail).subscribe({
          next: (result: any) => {
            this.loading = false;

            // console.log(result,'hello')
            if (result && result[userEmail]) {
              const userInputVerificationCode = this.userForm.verificationCode;


              const userData = result[userEmail];
              console.log(userEmail)
              const userIds = Object.keys(userData);

              for (const userId of userIds) {
                const user = userData[userId];
                if (user.email_phone ===userEmail && user.verificationCode === userInputVerificationCode) {
                  alert('Email verification successful');
                  this.showSuccessMessage = true;
                  // console.log('test 2')
                  return;
                }
                if (user.email_phone ===userEmail && user.verificationCode != userInputVerificationCode) {
                  alert('Email verififcation failed');
                  
                  // console.log('test 2')
                  return;
                }
               
              }

            
            } else {
              console.log('test 3')
              console.error('No user data found for the provided email.');
            }
          },
          error: (error: any) => {
            console.error('Error:', error.message || 'Server Error');
            this.loading = false;
          }
        });
      } else {
        console.error('No valid email found in query parameters.');
        this.loading = false;
      }
    });
  }

initiatePasswordReset(): void {
  const userEmail = this.route.snapshot.queryParams['email'];

  if (userEmail && userEmail.trim() !== '') {
    console.log('Initiating password reset for email:', userEmail);
    // You can add additional logic specific to password reset initiation
  } else {
    console.error('No valid email found in query parameters for password reset.');
    this.loading = false;
  }
  
}
  

ResetPassword(): void {
  const resetCode = this.userForm.resetVerificationCode.trim();
  
  // Check if the email/phone is present in the form
  const userEmail = this.userForm.email_phone;
    
  this.getUserData(userEmail).subscribe({
    next: (data: any) => {
      console.log('User Data:', data); // Log the retrieved user data

      this.loading = false;

      // Iterate over user data
      for (const newUser in data) {
        const resetUser = data[newUser];
  
        // Ensure both codes are strings for accurate comparison
        const storedVerificationCode = String(resetUser.resetVerificationCode);

        // Check against resetPasswordVerificationCode
        if (storedVerificationCode === resetCode) {
          // Code matches, navigate to the reset password page
          this.router.navigate(['/resetPassword']);
          console.log('Working - Code Matches');
          return;
        }
      }

      // Code doesn't match, show an alert
      alert('Reset password verification code is incorrect. Please check your email for code.');
    },
    error: (error: any) => {
      console.error('Error:', error.message || 'Server Error');
      this.loading = false;
      // Handle error, show an appropriate message to the user
    }
  });
}

  

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
