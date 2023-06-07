import { TestBed } from '@angular/core/testing';

import { AuthroleGuard } from './authrole.guard';

describe('AuthroleGuard', () => {
  let guard: AuthroleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthroleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
