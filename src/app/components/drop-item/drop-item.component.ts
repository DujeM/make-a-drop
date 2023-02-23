import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UploadTask, FirebaseStorage, Storage } from '@angular/fire/storage';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getApp } from '@angular/fire/app';
import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-drop-item',
  templateUrl: './drop-item.component.html',
  styleUrls: ['./drop-item.component.scss']
})
export class DropItemComponent implements OnInit {
  @Input() file: File;
  @Output() fileDownloadUrl: EventEmitter<string> = new EventEmitter<string>();

  task: UploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: any;
  encryptedFile: Blob;
  error: string;
  private secretKey = environment.FIREBASE_SECRET_KEY;

  constructor(
    private storage: Storage) { }

  ngOnInit(): void {
    this.encrypt();
  }

  startUpload() {
    if (!this.file) return;

    const path = `drops/${crypto.AES.encrypt(this.file.name, this.secretKey).toString()}`;
    const fileRef = ref(this.storage, path);

    this.task = uploadBytesResumable(fileRef, this.encryptedFile)

    this.task.on('state_changed', (snapshot) => {
      this.snapshot = of(snapshot);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.percentage = of(progress);
    },
    (e) => {
      this.error = e.message;
    },
    () => {
      getDownloadURL(fileRef).then((downloadURL) => {
        this.downloadURL = downloadURL;
        this.fileDownloadUrl.emit(this.downloadURL);
      });
    })

  }

  encrypt() {
    var reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) {
        return;
      }

      var encrypted = crypto.AES.encrypt(reader.result.toString(), this.secretKey).toString();

      this.encryptedFile = new Blob([encrypted]);
      this.startUpload();
    };
    reader.readAsDataURL(this.file);
}

}
