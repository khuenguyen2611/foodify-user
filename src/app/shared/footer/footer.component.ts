import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    @Input() class = 'footer-light'; // Default class
    @Input() themeLogo = 'assets/images/icon/logo.png'; // Default Logo
    @Input() newsletter = true; // Default True

    public today: number = Date.now();

    constructor() {
    }

    ngOnInit(): void {
    }
}
