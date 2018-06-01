import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    signupForm: FormGroup;
    maxDate: Date;
    constructor(private fb: FormBuilder,
                private authService: AuthService) {
    }

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
        const { email, password } = this.signupForm.value;
        this.authService.registerUser({ email, password });
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
