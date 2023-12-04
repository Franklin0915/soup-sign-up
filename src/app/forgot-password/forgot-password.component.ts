import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form } from '../form';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  constructor(private router:Router){}

  userForm = new Form('','',4566555,'','')
  NavigateToEmailVerification(){
    this.router.navigate(['/emailVerification'])
  }




}
