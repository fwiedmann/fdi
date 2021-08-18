import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewManagerComponent } from './crew-manager.component';

describe('CrewManagerComponent', () => {
  let component: CrewManagerComponent;
  let fixture: ComponentFixture<CrewManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrewManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
