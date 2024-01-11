import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmailVerificationComponent } from './new-email-verification.component';

describe('NewEmailVerificationComponent', () => {
  let component: NewEmailVerificationComponent;
  let fixture: ComponentFixture<NewEmailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewEmailVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
