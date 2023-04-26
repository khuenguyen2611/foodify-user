import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Input() class = 'header-2';
    @Input() themeLogo = 'assets/images/icon/logo.png'; // Default Logo
    @Input() topbar = true; // Default True
    @Input() sticky = false; // Default false

    private token: string = localStorage.getItem('jwt-token')
    public isLoggedIn = this.firebaseService.IsLoggedIn();
    public userId: number;
    public userEmail: string;
    public userFullName: string;


    public stick = false;

    constructor(
        private firebaseService: FirebaseService,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.userService.getUserByToken(this.token).subscribe((userInfo) => {
            this.userId = userInfo.userId;
            this.userEmail = userInfo.userEmail;
            this.userService.getUserById(this.userId).subscribe((user) => {
                this.userFullName = user.fullName;
                let nameParts = this.userFullName.split(" ");
                this.userFullName = nameParts[nameParts.length - 1];
            })
        })

    }

    // @HostListener Decorator
    @HostListener('window:scroll', [])
    onWindowScroll() {
        const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (number >= 150 && window.innerWidth > 400) {
            this.stick = true;
        } else {
            this.stick = false;
        }
    }

    logOut() {
        this.firebaseService.logout();
    }
}
