import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlempaqueComponent } from './controlempaque.component';

describe('ControlempaqueComponent', () => {
  let component: ControlempaqueComponent;
  let fixture: ComponentFixture<ControlempaqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlempaqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlempaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
