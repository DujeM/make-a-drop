import { Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, updateProfile, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, setDoc, doc, getDocs, collection, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public auth: Auth
  ) { }

  anonLogin() {
    signInAnonymously(this.auth)
    .then(() => { })
    .catch((error) => {
      alert(error.message);
    });
  }
}
