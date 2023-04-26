import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import { Router } from "@angular/router";

const config = {
    apiKey: 'AIzaSyAZFFIuXkbgdp2F-Em4CK2z8kVJ2L4p_UU',
    authDomain: 'foodify-55954.firebaseapp.com',
    databaseURL: 'https://foodify-55954-default-rtdb.firebaseio.com/',
    projectId: 'foodify-55954',
    storageBucket: 'foodify-55954.appspot.com',
    messagingSenderId: '213676556381',
    appId: '1:213676556381:web:865bb2e949d708cae88db4',
    measurementId: 'G-TV0D4CW51W'
};

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    showPassword = false;
    reCaptchaVerifier: any;
    otp!: string;
    verify: any;
    phoneNumber = '+84905696521';

    captchaConfig = {
        allowNumbersOnly: true,
        length: 6,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            width: '50px',
            height: '50px',
        },
    };

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastrService,
        private firebaseAuthService: FirebaseService,
        private ngZone: NgZone,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        firebase.initializeApp(config);
        this.createLoginForm();
        this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
        console.log(this.verify);
    }

    createLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: [''],
            password: [''],
        });
    }

    onSignIn() {
        this.firebaseAuthService.signIn(this.getSignInEmail, this.getSignInPassword).then((result) => {
            if (result) {
                this.toastService.success('Đăng nhập thành công.');
            } else {
                this.toastService.error('Sai tên tài khoản hoặc mật khẩu. Vui lòng thử lại.');
            }
        });
    }

    get getSignInEmail() {
        return this.loginForm.get('email').getRawValue();
    }

    get getSignInPassword() {
        return this.loginForm.get('password').getRawValue();
    }
}
