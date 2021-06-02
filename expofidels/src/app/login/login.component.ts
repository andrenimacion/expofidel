import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { WebuserService } from '../Services/webuser.service';
//import { Iwebuser } from '../Models/webuser';
import { TokenGenerateService } from '../services/token-generate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  passwordType: string = 'password';
  passwordShow: boolean = false;

  public password: string;
  public usuario: string;
  
  public userArr: any = [];
  public userLog: any = [];
  
  env = environment;

  constructor(  public userService: WebuserService,
                public router: Router,
                private TokenUser: TokenGenerateService) { }


  private tUser = this.TokenUser.tGenerate(10);      

  ngOnInit() {
    this.userService.verificacion ();
  } 

  passwordHidShow() {
    console.log('activado');
    if (!this.passwordShow) {
      this.passwordShow = true;
      this.passwordType = 'text';
    }

    else {
      this.passwordShow = false;
      this.passwordType = 'password';
    }

  }

  getUser(user) {
    this.userService.getUsByParam(user).subscribe(y => {
        this.userArr = y;
        //sessionStorage.setItem('Token-Session', this.tUser);
    })
  }

  logeo() {
    this.userLog = {
      webUsu: this.usuario,
      webPass: this.password
    }
    this.userService.login(this.userLog)
      .subscribe(x => {
        this.userArr = x;
        sessionStorage.setItem('User', this.userArr.webUsu);
        sessionStorage.setItem('Token-User', this.userArr.codeUser);
        sessionStorage.setItem('Session-Key', this.tUser);
        // console.log(x);
        this.userService.verificacion();
        // this.getUser(localStorage.getItem('User'));
        Swal.fire({
                    icon: 'success',
                    title: 'Bien...',
                    text: 'Has ingresado con exito!',
                    footer: ''
      });
      }, err => {
        Swal.fire({
                  icon:  'error',
                  title: 'Oops...',
                  text:  'Verifica tus credenciales!',
                  footer: ''
                });
      });
  }





}
