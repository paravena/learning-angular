import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    signupForm: FormGroup;
    maxDate: Date;
    constructor(private fb: FormBuilder) { }

    ngOnInit() {
      this.signupForm = this.fb.group({
          email : ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          birthDate: ['', Validators.required],
          agree: [false, Validators.required]
      });
      this.maxDate = new Date();
      this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }

    onSubmit() {
        console.log(this.signupForm);
    }

    public get email() {
        return this.signupForm.get('email');
    }

    public get password() {
        return this.signupForm.get('password');
    }

    public get birthDate() {
        return this.signupForm.get('birthDate');
    }
}
