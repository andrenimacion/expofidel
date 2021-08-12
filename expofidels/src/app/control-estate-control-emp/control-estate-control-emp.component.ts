import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { TipoControlEmpService } from '../services/tipo-control-emp.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-control-estate-control-emp',
  templateUrl: './control-estate-control-emp.component.html',
  styleUrls: ['./control-estate-control-emp.component.styl']
})
export class ControlEstateControlEmpComponent implements OnInit {

  public _tipo: string;
  public _consumo: string;

  constructor( private controlType: TipoControlEmpService ) { }

  ngOnInit() {
    this.gTypes();
  }

  public gt: any = [];
  gTypes() {
    this.controlType.getTypes().subscribe( x => {
      this.gt = x;
      // for( let c=0; c<=this.gt.length; c++ ) {
      //   this.gt[c].tipo
      // }
    })
  }

  public _id;
  public pt: any = [];
  collectTypes(id, a ,b) {    
    this._id = id;
    this._tipo = a;
    this._consumo = b;
  }
  
  pTypes() {
    
    this.pt = {
      id:      this._id,
      tipo:    this._tipo,
      consumo: this._consumo
    }
    
    this.controlType.putTypes(this._id, this.pt).subscribe( y => {
      this.gTypes();
      console.log(y);
    })

  }


  controlLength(value, limite, valSwitchs) {

    if( value.length <= 0 ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No puedes dejar este campo vacio!'
      })
    }

    else if( value.length > limite ) {
    
      // value.slice(0,2);
      // console.log(value);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Límite máximo de caracteres alcanzado!',
        footer: `Disponibilidad de ${limite} caracteres a ingresar, ha sido superado`
      })
      
      
      switch(valSwitchs) {
        case 1:
            this._tipo = value.slice(0,2);
            console.log(valSwitchs + ' / ' + this._tipo);
            this._tipo;
          break;
        case 2:
            this._consumo = value.slice(0,6);
            console.log(valSwitchs + ' / ' + this._consumo);
            this._consumo;
        break;

      }

    }

    else {
      this._tipo;
      this._consumo;
    }

  }
  
}
