import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciabodComponent } from './transferenciabod.component';

describe('TransferenciabodComponent', () => {
  let component: TransferenciabodComponent;
  let fixture: ComponentFixture<TransferenciabodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciabodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciabodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
