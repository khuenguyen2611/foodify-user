import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderResponse } from 'src/app/shared/classes/order-dto';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  public orders: OrderResponse[];
  private token: string = localStorage.getItem('jwt-token');

  refreshInterval = 5000;
  refreshTimeout;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private firebaseService: FirebaseService) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.userService.getUserByToken(this.token).subscribe((userInfo) => {
      this.orderService.getOrderByUser(userInfo.userId).subscribe((data) => {
        this.orders = data.orders
      })

      this.refreshTimeout = setTimeout(() => {
        this.loadData();
      }, this.refreshInterval)
    })

  }

  public ngOnDestroy() {
    clearTimeout(this.refreshTimeout);
  }
}
