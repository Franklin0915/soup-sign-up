// auth.service.ts
//this is the original

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubscription: Subscription;

  constructor(private afAuth: AngularFireAuth) {
    this.authSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        // User is authenticated, perform operations
      } else {
        // No authenticated user
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.authSubscription.unsubscribe();
  }

  async registerUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async saveUserDataWithCode(userId: string | null, userData: any, verificationCode: string): Promise<void> {
    try {
      if (userId) {
        await firebase.database().ref(`/users/${userId}`).set({ ...userData, verificationCode });
      } else {
        throw new Error('User ID is null.');
      }
    } catch (error) {
      console.error('Error saving user data with verification code:', error);
      throw error;
    }
  }

  
  
}
