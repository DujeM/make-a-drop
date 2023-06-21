import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { collection, query, where, getDocs, QuerySnapshot, DocumentData, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drop-find',
  templateUrl: './drop-find.component.html',
  styleUrls: ['./drop-find.component.scss']
})
export class DropFindComponent implements OnInit {
  downloadInProgress = false;
  deleteInProgress = false;
  findForm: FormGroup;
  name: FormControl;
  secret: FormControl;
  downloadUrls: any[] = [];
  deletedFiles: any[] = [];
  snapshot: QuerySnapshot<DocumentData>;
  private secretKey = environment.FIREBASE_SECRET_KEY;

  constructor(
    private fb: FormBuilder,
    private db: Firestore,
    private storage: Storage,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.secret = new FormControl('', [Validators.required]);

    this.findForm = this.fb.group({
      name: this.name,
      secret: this.secret
    });
  }

  async deleteFile() {
    const storage = getStorage();

    for (const url of this.downloadUrls) {
      const fileRef = ref(storage, url.downloadUrl);

      await deleteObject(fileRef).then(() => {
        this.snapshot.forEach((doc) => {
          const secret = doc.data()['secret'];

          if (crypto.AES.decrypt(secret, this.secretKey).toString(crypto.enc.Utf8) !== this.secret.value) {
            return;
          }

          deleteDoc(doc.ref).then(() => {
            this.deletedFiles.push(fileRef)
          }).catch((error) => {
            console.error(error);
          });
        });
      }).catch((error) => {
        console.error(error);
      });
    }
    this.router.navigateByUrl('/');
  }

  async findAndDownload() {
    const q = query(collection(this.db, 'drops'), where("name", '==', this.name.value));

    this.snapshot = await getDocs(q);

    this.snapshot.forEach((doc) => {
      const secret = doc.data()['secret'];

      if (crypto.AES.decrypt(secret, this.secretKey).toString(crypto.enc.Utf8) !== this.secret.value) {
        return;
      }

      this.downloadUrls = doc.data()['downloadUrls'];

      this.downloadUrls.forEach(file => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onloadstart = () => {
          this.downloadInProgress = true;
        }

        xhr.onloadend = async () => {
          const response = await xhr.response.text();
          this.decryptFile(response, crypto.AES.decrypt(file.fileName, this.secretKey).toString(crypto.enc.Utf8));
        };
        xhr.open('GET', file.downloadUrl);
        xhr.send();
      });
    })
  }

  private decryptFile(encryptedData: string, fileName: string) {
    var decryptedData = crypto.AES.decrypt(encryptedData, this.secretKey).toString(crypto.enc.Utf8);
    var file = decryptedData.split(',');
    var fileType = file[0];
    var fileContent = file[1];

    var a = document.createElement('a');
    a.href = `${fileType},` + fileContent;
    a.download = fileName;
    a.click();
    this.downloadInProgress = false;
    this.deleteInProgress = true;
  }

}
