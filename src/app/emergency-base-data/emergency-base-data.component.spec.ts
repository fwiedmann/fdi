import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyBaseDataComponent } from './emergency-base-data.component';

describe('EmergencyBaseDataComponent', () => {
  let component: EmergencyBaseDataComponent;
  let fixture: ComponentFixture<EmergencyBaseDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyBaseDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyBaseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
