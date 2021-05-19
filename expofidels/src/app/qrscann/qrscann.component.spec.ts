import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrscannComponent } from './qrscann.component';

describe('QrscannComponent', () => {
  let component: QrscannComponent;
  let fixture: ComponentFixture<QrscannComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrscannComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrscannComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
