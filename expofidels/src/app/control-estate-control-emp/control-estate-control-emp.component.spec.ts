import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEstateControlEmpComponent } from './control-estate-control-emp.component';

describe('ControlEstateControlEmpComponent', () => {
  let component: ControlEstateControlEmpComponent;
  let fixture: ComponentFixture<ControlEstateControlEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlEstateControlEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEstateControlEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
