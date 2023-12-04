import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form } from '../form';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent {

  constructor(private router:Router){}

  userForm = new Form('','',4566555,'','')
  NavigateToSignIn(){
    this.router.navigate(['signUp'])

  }

  countdown: number = 300; 
  countdownInterval: any; 

  

  ngOnInit(): void {}

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
    const formattedMinutes = minutes < 10 ? `${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  showSuccessMessage: boolean = false;
  
  continue(): void {
    this.showSuccessMessage = true;
  }

  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
  }

  ToSignIn(){
    this.router.navigate(['/signIn'])
  }

}
