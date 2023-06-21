import { Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, updateProfile, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, setDoc, doc, getDocs, collection, getDoc, addDoc, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DropsService {
  constructor(
    private db: Firestore,
    public auth: Auth,
    private router: Router
  ) { }

  async getAllByUserId(uid: string) {
    const q = query(collection(this.db, 'drops'), where("userId", '==', uid));
    return await getDocs(q);
  }
}
