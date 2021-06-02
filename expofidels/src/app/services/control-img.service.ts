import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlImgService {

  public _IMGE;

  constructor() { }

  //'fileUp'
  encodeImageFileAsURL(idFile, idDiv) {
    const filesSelected = document.getElementById(idFile) as HTMLInputElement;
    const fileId = filesSelected.files;
    let base;
    if (fileId.length > 0) {
      const fileToLoad = filesSelected[0];
      const fileReader = new FileReader();

      // tslint:disable-next-line: only-arrow-functions
      fileReader.onload = () => {
        base = fileReader.result;
        document.getElementById(idDiv).style.backgroundImage = `url(${base})`;
      };
      fileReader.onloadend = () => {
        this._IMGE = fileReader.result;
        console.log(this._IMGE);
      };

      const a = fileReader.readAsDataURL(fileId[0]);
      // // tslint:disable-next-line: prefer-for-of
      // for (let i = 0; i < fileId.length; i++) {
      // }

    }

  }

}
