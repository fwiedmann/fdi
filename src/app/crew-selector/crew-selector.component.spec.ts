import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewSelectorComponent } from './crew-selector.component';

describe('CrewSelectorComponent', () => {
  let component: CrewSelectorComponent;
  let fixture: ComponentFixture<CrewSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrewSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
