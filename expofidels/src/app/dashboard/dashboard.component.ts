import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl']
})
export class DashboardComponent implements OnInit {
  showFiller = false;

  public height: number = screen.height - 165; 
  public heightApps: number = this.height - 49

  constructor() { }

  ngOnInit() {
    console.log(this.height)
  }

}
