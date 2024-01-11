import { Component } from '@angular/core';
import { Form } from '../form';
import { Router } from '@angular/router';
import { FormDataService } from '../form-data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { from, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private router: Router,
    private formDataService: FormDataService,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  userForm = new Form('', '', '', '', '', '', '');

  async onSubmit() {
    try {
      const userEmail = this.userForm.email_phone;

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const userCredential = await this.authService.registerUser(userEmail, this.userForm.password);

      const userId = userCredential.user?.uid || null;

      await this.authService.saveUserDataWithCode(userId, this.userForm, verificationCode);
      console.log(verificationCode);

      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        await firstValueFrom(from(currentUser.sendEmailVerification()).pipe(take(1)));
        console.log('Email verification sent successfully');
        this.router.navigate(['/emailVerification'], { queryParams: { email: this.userForm.email_phone } });
      } else {
        console.error('No authenticated user found.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);

      if (navigator.onLine) {
        this.router.navigate(['/emailVerification'], {
          queryParams: {
            email: this.userForm.email_phone,
            action: 'signup'
          }
        });
      } else {
        alert("ooops! looks like you are not connected to the internet")
        console.error('Network error. Unable to navigate to email verification.');
      }
    }
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

  isFormValid(): boolean {
    const { firstName, lastName, email_phone, password, confirmPassword } = this.userForm;

    return !!firstName && !!lastName && !!email_phone && !!password && !!confirmPassword;
  }

  confirmPasswordTyped: boolean = false;
  passwordsDoNotMatch: boolean = false;

  passwordsMatch(): boolean {
    return this.confirmPasswordTyped && this.userForm.password === this.userForm.confirmPassword;
  }

  setConfirmPasswordTyped() {
    this.confirmPasswordTyped = true;
    this.passwordsDoNotMatch = !this.passwordsMatch();
  }
}
