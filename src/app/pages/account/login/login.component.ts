import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FirebaseService } from "../../../shared/services/firebase.service";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    showPassword: boolean = false;


    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastrService,
        private firebaseAuthService: FirebaseService
    ) {
    }

    ngOnInit(): void {
        this.createLoginForm();
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
                this.toastService.success("Đăng nhập thành công.");
            }
            else {
                this.toastService.error("Sai tên tài khoản hoặc mật khẩu. Vui lòng thử lại.");
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
