import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DropsService } from 'src/app/services/drops.service';
import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drops',
  templateUrl: './drops.component.html',
  styleUrls: ['./drops.component.scss']
})
export class DropsComponent implements OnInit {
  drops: any[] = [];
  downloadInProgress = false;
  private secretKey = environment.FIREBASE_SECRET_KEY;

  constructor(
    private auth: AuthenticationService,
    private dropsService: DropsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.auth.currentUser) {
      this.router.navigateByUrl('/');
    }

    this.dropsService.getAllByUserId(this.auth.currentUser.uid)
      .then(res => {
        res.forEach(doc => {
          this.drops.push(doc.data());
        })
      })
  }

  download(drop: any) {
    drop.downloadUrls.forEach((file: any) => {
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
  }
}
