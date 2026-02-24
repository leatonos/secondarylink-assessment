import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDetail } from './fund-detail.component';

describe('FundDetail', () => {
  let component: FundDetail;
  let fixture: ComponentFixture<FundDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
