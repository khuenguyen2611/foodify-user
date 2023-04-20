import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/classes/user';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openDashboard: boolean = false;

  public userId = this.firebaseService.getUserId();
  public user: User;

  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
      }
    })
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

}
