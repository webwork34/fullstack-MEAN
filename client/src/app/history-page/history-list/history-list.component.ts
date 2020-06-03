import { MaterialInstance, MaterialService } from './../../shared/classes/material.service';
import { Component, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order[];
  @ViewChild('modal', {static: false}) modalRef: ElementRef;

  modal: MaterialInstance;
  selecteOrder: Order;

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  selectOrder(order: Order) {
    this.selecteOrder = order;
    this.modal.open();
  }

  closeModal() {
    this.modal.close();
  }

}
