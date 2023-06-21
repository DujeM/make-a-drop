import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  private initForm() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value)
    }
  }
}
