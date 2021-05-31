import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenGenerateService {

  constructor() { }

  tGenerate(cant: number) {

    let caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    let contrasenia = "";
    
    for (let i=0; i<cant; i++) {
      contrasenia += caracteres.charAt(Math.floor(Math.random()*caracteres.length));   
    }

    return contrasenia;
    
  }

}
