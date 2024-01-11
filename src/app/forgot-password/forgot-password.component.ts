// forgot-password.component.ts

import { Component } from '@angular/core';
import { Form } from '../form';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  constructor(private router: Router, private http: HttpClient) {}

  userForm = new Form('', '', '', '', '', '', ''); // Include resetVerificationCode in the arguments
  date = new Date();

  NavigateToEmailVerification() {
    const userEmailOrPhone = this.userForm.email_phone;
    const resetPasswordVerificationCode = this.generateVerificationCode();

    // Make a GET request to retrieve user data
    const getUrl = 'https://soup-data-collection-default-rtdb.firebaseio.com/users.json?email_phone=' + userEmailOrPhone;
    console.log('Forgot password url: ', getUrl);

    this.http.get(getUrl).subscribe(
      (responseData: any) => {
        // Check if the provided email matches any existing email in the database
        const user = this.findUserByEmail(userEmailOrPhone, responseData);

        if (user) {
          // User is found, save the email and user ID to be used in the next step
          console.log('hey')
          const userEmail = user.email_phone;
          const userId = user.userId;


          // Proceed with the PATCH request to update the reset password verification code
          const patchUrl = `https://soup-data-collection-default-rtdb.firebaseio.com/users/${userId}.json`;
          const patchData = {
            resetVerificationCode: resetPasswordVerificationCode,
            userEmail: userEmail, // Save the user's email
            date: this.date.toISOString() // Include the date and time in ISO format
          };
          console.log(resetPasswordVerificationCode);
          console.log(user);
          console.log('User Email:', userEmail);

          this.http.patch(patchUrl, patchData).subscribe(
            (response) => {
              // Handle the success response
              console.log('Reset verification code updated successfully:', response);

              // Navigate to the reset password page with user ID
              this.router.navigate(['/newEmail'], {
                queryParams: { action: 'resetPassword', email: userEmail, userId: userId }
              });

            },
            (error) => {
              // Handle the error
              console.error('Error updating reset verification code:', error);
            }
          );
        } else {
          // No match, display an alert
          alert('Incorrect email');
        }
      },
      (error) => {
        // Handle the error
        console.error('Error retrieving user data:', error);
      }
    );
  }

  findUserByEmail(userEmail: string, responseData: any): any {
    // Loop over the data to check if the provided email matches any existing email
    for (const key in responseData) {
      if (responseData[key]?.email_phone === userEmail) {
        // Include the userId in the user object
        return { ...responseData[key], userId: key };
      }
    }
    return null;
  }

  generateVerificationCode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  isEmailOrPhoneValid: boolean = true;
  errorMessage: string = '';

  validateEmailOrPhone() {
    const enteredValue = this.userForm.email_phone;

    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(enteredValue);
    const isPhoneValid = /^\+(?:[0-9] ?){6,14}[0-9]$/.test(enteredValue);

    this.isEmailOrPhoneValid = isEmailValid || isPhoneValid;

    if (!this.isEmailOrPhoneValid) {
      this.errorMessage = isEmailValid ? 'Incorrect phone number' : 'Incorrect email';
    } else {
      this.errorMessage = '';
    }
  }
}
