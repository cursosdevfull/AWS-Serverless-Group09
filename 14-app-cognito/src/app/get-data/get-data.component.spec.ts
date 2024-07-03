import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDataComponent } from './get-data.component';

describe('GetDataComponent', () => {
  let component: GetDataComponent;
  let fixture: ComponentFixture<GetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
