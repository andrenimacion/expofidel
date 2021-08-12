import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router ) { }

  ngOnInit() {

  }

  closeSession() {
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Email-Principal');
    sessionStorage.removeItem('Token-User');
    sessionStorage.removeItem('Session-Key');
    this.router.navigate(['/Login']);
  }

}
