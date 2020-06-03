import { AuthService } from './../../serviсes/auth.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})

export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating', {static: false}) floatingRef: ElementRef;

  links = [
    {url: '/overview', name: 'Обзор'},
    {url: '/analytics', name: 'Аналитика'},
    {url: '/history', name: 'История'},
    {url: '/order', name: 'Добавить заказ'},
    {url: '/categories', name: 'Ассортимент'}
  ];

  constructor(private authService: AuthService,
              private router: Router) { }

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
