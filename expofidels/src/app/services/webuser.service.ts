import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class WebuserService {

  private apiURL = 'https://alp-cloud.com:8453/api';

  constructor(private http: HttpClient, public router: Router) { }

  login(user) {
    return this.http.post(this.apiURL + "/UserLogin/login", user);
  }

  logout() {
    sessionStorage.removeItem("User");
    sessionStorage.removeItem("Session-Key");
  }

  getUsByParam(user) {
    return this.http.get(this.apiURL + "/UserLogin/getuser/" + user);
  }

  
  verificacion () {

    if (sessionStorage.getItem('User') != null) { 
      this.router.navigate(['\dash']);
    }

    else {
      this.router.navigate(['\login']);
    }

  }

}
