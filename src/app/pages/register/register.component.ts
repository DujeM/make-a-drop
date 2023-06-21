import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  fullName: FormControl
  email: FormControl;
  password: FormControl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  private initForm() {
    this.fullName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);

    this.registerForm = this.fb.group({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    });
  }

  register() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value)
    }
  }

}
