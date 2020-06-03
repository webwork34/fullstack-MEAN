import { MaterialInstance, MaterialService } from './../shared/classes/material.service';
import { AnalitycsService } from './../shared/serviсes/analitycs.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OverviewPage } from '../shared/interfaces';

@Component({
  selector: 'app-overwiev-page',
  templateUrl: './overwiev-page.component.html',
  styleUrls: ['./overwiev-page.component.css']
})
export class OverwievPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget', {static: false}) tapTargetRef: ElementRef;
  tapTarget: MaterialInstance;
  data$: Observable<OverviewPage>;
  yesterday = new Date();

  constructor(private analitycsService: AnalitycsService) { }

  ngOnInit() {
    this.data$ = this.analitycsService.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  ngOnDestroy() {
    this.tapTarget.destroy();
  }

  openInfo() {
    this.tapTarget.open();
  }
}
