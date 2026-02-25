import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundEditorComponent } from './fund-editor.component';

describe('FundEditorComponent', () => {
  let component: FundEditorComponent;
  let fixture: ComponentFixture<FundEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
