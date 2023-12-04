// sign-up.component.ts

import { Component } from '@angular/core';
import { Form } from '../form';
import { Router } from '@angular/router';
import { FormDataService } from '../form-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(private router: Router, private formDataService: FormDataService) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  userForm = new Form('', '', '', '', '');

  NavigateToEmailVerification() {
    this.router.navigate(['/emailVerification']);
  }

  onSubmit() {
    this.formDataService.postForms(this.userForm).subscribe({
      next: (data: any) => {
        console.log('success', data);
        this.router.navigate(['/signIn']);
      },
      error: (error: any) => console.log('error', error)
    });
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

  isTyping: boolean = false;


 


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
