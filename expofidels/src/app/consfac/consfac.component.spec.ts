import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsfacComponent } from './consfac.component';

describe('ConsfacComponent', () => {
  let component: ConsfacComponent;
  let fixture: ComponentFixture<ConsfacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsfacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsfacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
