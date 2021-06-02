import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineDataComponent } from './offline-data.component';

describe('OfflineDataComponent', () => {
  let component: OfflineDataComponent;
  let fixture: ComponentFixture<OfflineDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
