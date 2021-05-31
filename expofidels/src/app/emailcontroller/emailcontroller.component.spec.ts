import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailcontrollerComponent } from './emailcontroller.component';

describe('EmailcontrollerComponent', () => {
  let component: EmailcontrollerComponent;
  let fixture: ComponentFixture<EmailcontrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailcontrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailcontrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
