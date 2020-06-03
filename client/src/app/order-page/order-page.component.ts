import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/serviсes/orders.service';
import { OrderPosition, Order } from './../shared/interfaces';
import { MaterialService, MaterialInstance } from './../shared/classes/material.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  isRoot: boolean;
  isPending = false;
  oSub: Subscription;

  @ViewChild('modal', {static: false}) modalRef: ElementRef;
  modal: MaterialInstance;

  constructor(private router: Router,
              private orderService: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.isPending = true;

    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} добавлен.`);
        this.orderService.clear();
      },
      error => MaterialService.toast(error.error.massage),
      () => {
        this.modal.close();
        this.isPending = false;
      }
    );
  }

  removePosition(orderPosition: OrderPosition) {
    this.orderService.remove(orderPosition);
  }
}
