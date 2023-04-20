import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/user.service';
import { User } from '../classes/user';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Input() class: string = 'header-2';
    @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
    @Input() topbar: boolean = true; // Default True
    @Input() sticky: boolean = false; // Default false

    public isLoggedIn = this.firebaseService.IsLoggedIn();
    public userId = this.firebaseService.getUserId();
    public userEmail = this.firebaseService.getEmail();
    public userFullName: string;


    public stick: boolean = false;

    constructor(
        private firebaseService: FirebaseService,
        private userService: UserService
    ) {
    }

    ngOnInit(): void {
        this.userService.getUserById(this.userId).subscribe((user) => {
            this.userFullName = user.fullName;
            let nameParts = this.userFullName.split(" ");
            this.userFullName = nameParts[nameParts.length - 1];
        })
    }

    // @HostListener Decorator
    @HostListener("window:scroll", [])
    onWindowScroll() {
        let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
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
