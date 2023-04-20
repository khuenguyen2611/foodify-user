import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderResponse } from 'src/app/shared/classes/order-dto';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  private userId = this.firebaseService.getUserId();
  public orders: OrderResponse[];

  refreshInterval: number = 5000;
  refreshTimeout;

  constructor(
    private orderService: OrderService,
    private firebaseService: FirebaseService) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    console.log("hi")
    console.log(this.refreshInterval)
    this.orderService.getOrderByUser(this.userId).subscribe((data) => {
      this.orders = data.orders
    })

    this.refreshTimeout = setTimeout(() => {
      this.loadData();
    }, this.refreshInterval)
  }

  public ngOnDestroy() {
    console.log('destroy')
    clearTimeout(this.refreshTimeout);
  }
}
