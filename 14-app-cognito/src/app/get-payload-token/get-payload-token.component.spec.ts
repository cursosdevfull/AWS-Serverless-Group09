import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPayloadTokenComponent } from './get-payload-token.component';

describe('GetPayloadTokenComponent', () => {
  let component: GetPayloadTokenComponent;
  let fixture: ComponentFixture<GetPayloadTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetPayloadTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPayloadTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
