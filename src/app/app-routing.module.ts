import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewEmailVerificationComponent } from './new-email-verification/new-email-verification.component';


const routes: Routes = [
  { path: 'signIn', component: SignInComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: '', redirectTo: '/signIn', pathMatch: 'full' },  // Change here
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'emailVerification', component: EmailVerificationComponent },
  {path:'welcomeComponent',component:WelcomeComponent},
  {path:'resetPassword',component:ResetPasswordComponent},
  {path:'newEmail',component:NewEmailVerificationComponent}
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
