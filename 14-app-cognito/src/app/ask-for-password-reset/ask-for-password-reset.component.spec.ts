import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskForPasswordResetComponent } from './ask-for-password-reset.component';

describe('AskForPasswordResetComponent', () => {
  let component: AskForPasswordResetComponent;
  let fixture: ComponentFixture<AskForPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskForPasswordResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskForPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
