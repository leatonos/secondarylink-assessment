import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDeleteComponent } from './fund-delete.component';

describe('FundDeleteComponent', () => {
  let component: FundDeleteComponent;
  let fixture: ComponentFixture<FundDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
