import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsModal } from './credits.component';

describe('CreditsModal', () => {
  let component: CreditsModal;
  let fixture: ComponentFixture<CreditsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditsModal ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
