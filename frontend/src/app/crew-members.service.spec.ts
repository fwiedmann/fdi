import { TestBed } from '@angular/core/testing';

import { CrewMembersService } from './crew-members.service';

describe('CrewMembersService', () => {
  let service: CrewMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrewMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
