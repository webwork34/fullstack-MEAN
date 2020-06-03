import { AuthService } from './shared/serviсes/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const potentialToken = localStorage.getItem('auth-token');
    if(potentialToken !== null){
      this.authService.setToken(potentialToken);
    }
  }
}
