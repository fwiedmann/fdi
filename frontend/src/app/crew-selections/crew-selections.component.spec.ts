import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewSelectionsComponent } from './crew-selections.component';

describe('CrewSelectionsComponent', () => {
  let component: CrewSelectionsComponent;
  let fixture: ComponentFixture<CrewSelectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrewSelectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewSelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
