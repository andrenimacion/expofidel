import { Component, OnInit } from '@angular/core';
import { PagonlineService } from '../services/pagonline.service';
import { WebuserService } from '../Services/webuser.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl']
})
export class DashboardComponent implements OnInit {
  showFiller = false;
  panelOpenState = false;
  
  public height: number = screen.height - 165; 
  public heightApps: number = this.height - 49

  constructor( private msg: PagonlineService, private csess: WebuserService ) { }

  ngOnInit() {
    //console.log(this.height)

    //this.msg.pOnline('mesasge');

  }

  closesession() {
    this.csess.logout();
    this.csess.verificacion();
  }

}
