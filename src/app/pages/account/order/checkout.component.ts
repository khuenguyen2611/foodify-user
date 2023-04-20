import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/classes/order';
import { OrderResponse } from 'src/app/shared/classes/order-dto';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private userId = this.firebaseService.getUserId();

  currentStep = 1;
  numSteps = 4;
  order: OrderResponse;

  refreshInterval: number = 5000;
  refreshTimeout;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private firebaseService: FirebaseService
  ) {

  }


  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id");
    this.orderService.getOrderById(this.userId, id).subscribe((order) => {
      this.order = order;
      if (this.order.status == 'AWAITING') {
        this.currentStep = 1;
      }
      else if (this.order.status == 'CONFIRMED') {
        this.currentStep = 1;
        this.nextStep();
      }
      else if (this.order.status == 'SHIPPING') {
        this.currentStep = 2;
        this.nextStep()
      }
      else if (this.order.status == 'COMPLETED') {
        this.currentStep = 4;
        this.nextStep();
        clearTimeout(this.refreshTimeout);
      }
      else {

      }
    })

    this.refreshTimeout = setTimeout(() => {
      this.ngOnInit();
    }, this.refreshInterval)

  }

  nextStep() {
    this.currentStep++;
    if (this.currentStep > this.numSteps + 1) {
      this.currentStep = 1;
    }
    var stepper = document.getElementById("stepper1");
    var steps = stepper.getElementsByClassName("step");

    Array.from(steps).forEach((step, index) => {
      let stepNum = index + 1;
      if (stepNum === this.currentStep) {
        this.addClass(step, "editing");
      } else {
        this.removeClass(step, "editing");
      }
      if (stepNum < this.currentStep) {
        this.addClass(step, "done");
      } else {
        this.removeClass(step, "done");
      }
    });
  }

  hasClass(elem, className) {
    return new RegExp(" " + className + " ").test(" " + elem.className + " ");
  }

  addClass(elem, className) {
    if (!this.hasClass(elem, className)) {
      elem.className += " " + className;
    }
  }

  removeClass(elem, className) {
    var newClass = " " + elem.className.replace(/[\t\r\n]/g, " ") + " ";
    if (this.hasClass(elem, className)) {
      while (newClass.indexOf(" " + className + " ") >= 0) {
        newClass = newClass.replace(" " + className + " ", " ");
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, "");
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.refreshTimeout);
  }
}
