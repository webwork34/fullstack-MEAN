import { MaterialService } from './../../shared/classes/material.service';
import { OrderService } from './../order.service';
import { switchMap, map } from 'rxjs/operators';
import { Position } from './../../shared/interfaces';
import { Observable } from 'rxjs';
import { PositionsService } from './../../shared/serviсes/position.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<Position[]>;

  constructor(private route: ActivatedRoute,
              private positionsService: PositionsService,
              private orderService: OrderService) { }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionsService.fetch(params['id']);
          }
        ),
        map(
          (positions: Position[]) => {
            return positions.map(position => {
              position.quantity = 1;
              return position;
            });
          }
        )
      );
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено х${position.quantity} ${position.name}`);
    this.orderService.add(position);
  }

}
