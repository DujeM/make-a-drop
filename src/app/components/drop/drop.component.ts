import { Component, Input, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.scss']
})
export class DropComponent implements OnInit {
  @Input() formValue: any;

  isHovering: boolean = false;
  files: File[] = [];
  downloadUrls: any[] = [];
  private secretKey = environment.FIREBASE_SECRET_KEY;

  constructor(
    private db: Firestore,
    private router: Router
  ) { }

  ngOnInit(): void {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: any) {
    if (!files) return;

    if (files.target) {
      for (let index = 0; index < files.target.files.length; index++) {
        this.files.push(files.target.files[index]);
      }
      return;
    }

    for (let index = 0; index < files.length; index++) {
      this.files.push(files[index]);
    }
  }

  handleUploadedFile(fileDownloadUrl: string, fileName: string) {
    this.downloadUrls.push({downloadUrl: fileDownloadUrl, fileName: crypto.AES.encrypt(fileName, this.secretKey).toString()});
  }

  async finish() {
    await addDoc(collection(this.db, 'drops'), {
      name: this.formValue.name,
      secret: crypto.AES.encrypt(this.formValue.secret, this.secretKey).toString(),
      downloadUrls: this.downloadUrls
    })

    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }

}
