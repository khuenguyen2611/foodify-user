import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from "@angular/router";
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    loggedIn = false;
    isUserOrAdmin: boolean = false;
    userId: number;
    userEmail: string;
    token: string;

    constructor(
        public firebaseAuth: AngularFireAuth,
        private userService: UserService,
        private toastService: ToastrService,
        private router: Router) {
    }

    signUp(email: string, password: string) {
        this.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                userCredential.user.sendEmailVerification();
            })
            .catch(
                error => console.log(error)
            );
    }

    signIn(email: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.signInWithEmailAndPassword(email, password)
                .then((response) => {
                    if (!response.user.emailVerified) {
                        response.user.sendEmailVerification();
                        window.location.assign('https://admin-foodify.vercel.app/auth/email-not-verified');
                        resolve(false); // trả về false nếu email chưa được xác thực
                    } else {
                        response.user.getIdToken().then((token: string) => {
                            this.token = token;
                            localStorage.setItem('jwt-token', token);
                            this.userService.getUserByEmail(email).subscribe((user) => {
                                if ((user.role.roleName == 'ROLE_ADMIN' || user.role.roleName == 'ROLE_USER') && !user.isLocked) {
                                    this.loggedIn = true;
                                    this.isUserOrAdmin = true;
                                    this.userId = user.id;
                                    this.userEmail = user.email;

                                    localStorage.setItem("isLoggedIn", JSON.stringify(this.loggedIn));
                                    localStorage.setItem("user-id", this.userId.toString());
                                    localStorage.setItem("user-email", this.userEmail);

                                    this.router.navigate(['/home']);
                                    resolve(true); // trả về true nếu đăng nhập thành công
                                } else {
                                    this.firebaseAuth.signOut().then(
                                        res => {
                                            this.loggedIn = false;
                                            this.token = null;
                                            localStorage.clear();
                                            if (user.isLocked) {
                                                this.toastService.error("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên để biết thêm chi tiết !")
                                            }
                                            else {
                                                this.toastService.error("Tài khoản của bạn không có quyền đăng nhập vào trang web dành cho người dùng !")
                                            }
                                            resolve(false); // trả về false nếu tài khoản không có quyền truy cập
                                        }
                                    );
                                }
                            })
                        });
                    }
                }).catch((error) => {
                    resolve(false);
                });
        });
    }

    // async signUp(email: string, password: string) {
    //     await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
    //         .then(
    //             res => {
    //                 this.isLoggedIn = true;
    //                 localStorage.setItem('user', JSON.stringify(res.user));
    //             }
    //         );
    // }

    getUserId() {
        return Number(localStorage.getItem("user-id"))
    }

    getEmail() {
        return localStorage.getItem("user-email");
    }

    IsLoggedIn() {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn != null) {
            return JSON.parse(isLoggedIn);
        }
    }

    IsUserOrAdmin() {
        return this.isUserOrAdmin;
    }

    isAuthenticated() {
        return this.token != null;
    }

    isTokenExpired() {
        const now = new Date().getTime() / 1000
        const payload = JSON.parse(atob(localStorage.getItem('jwt-token').split('.')[1]));
        return payload.exp < now
    }

    logout() {
        this.firebaseAuth.signOut().then(
            res => {

            }
        );
        this.token = null;
        localStorage.clear();
        window.location.href = '/home/login'
    }




}

