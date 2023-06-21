import { Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, updateProfile, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, setDoc, doc, getDocs, collection, getDoc, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: any;

  constructor(
    private db: Firestore,
    public auth: Auth,
    private router: Router
  ) { }

  getCurrentUser = onAuthStateChanged(this.auth, (user) => {
    if (user) {
      this.currentUser = user;
    } else {
      this.anonLogin();
    }
  });

  anonLogin() {
    signInAnonymously(this.auth)
      .then(() => { })
      .catch((error) => {
        alert(error.message);
      });
  }

  login(data: any) {
    signInWithEmailAndPassword(this.auth, data.email, data.password)
      .then(_ => {
        this.router.navigateByUrl('/');
      })
  }

  register(data: any) {
    createUserWithEmailAndPassword(this.auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.createUserProfile(user.uid, data);
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration error:', errorCode, errorMessage);
      });
  }

  async createUserProfile(uid: string, data: any) {
    await addDoc(collection(this.db, 'users'), {
      id: uid,
      email: data.email,
      fullName: data.fullName
    });
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        this.currentUser = null;
        this.router.navigateByUrl('/');
      });
  }
}
