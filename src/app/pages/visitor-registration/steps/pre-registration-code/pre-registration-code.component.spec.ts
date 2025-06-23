import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegistrationCodeComponent } from './pre-registration-code.component';

describe('PreRegistrationCodeComponent', () => {
  let component: PreRegistrationCodeComponent;
  let fixture: ComponentFixture<PreRegistrationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreRegistrationCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreRegistrationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
