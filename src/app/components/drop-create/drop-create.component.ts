import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-drop-create',
  templateUrl: './drop-create.component.html',
  styleUrls: ['./drop-create.component.scss']
})
export class DropCreateComponent implements OnInit {
  createForm: FormGroup;
  name: FormControl;
  secret: FormControl;
  displayUpload: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.secret = new FormControl('', [Validators.required]);

    this.createForm = this.fb.group({
      name: this.name,
      secret: this.secret
    });
  }

  next() {
    if (!this.createForm.valid) return;
    this.displayUpload = true;
  }

}
