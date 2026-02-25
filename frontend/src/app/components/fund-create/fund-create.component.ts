import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fund } from '../../models/fund.model';

@Component({
  selector: 'app-fund-creator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fund-create.component.html',
  styleUrl: './fund-create.component.scss' // You can reuse the Editor SCSS
})
export class FundCreateComponent {
  @Output() onSave = new EventEmitter<Fund>();
  @Output() onCancel = new EventEmitter<void>();
  
  fundForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fundForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['USD', Validators.required],
      fundSize: [0, [Validators.required, Validators.min(0)]],
      vintage: [new Date().getFullYear(), Validators.required],
      description: [''],
      strategies: [''],
      geographies: [''],
      managers: ['']
    });
  }

  submit(): void {
    if (this.fundForm.valid) {
      const formValue = this.fundForm.value;
      
      // Transform comma-separated strings into arrays
      const newFund: Fund = {
        ...formValue,
        strategies: formValue.strategies ? formValue.strategies.split(',').map((s: string) => s.trim()) : [],
        geographies: formValue.geographies ? formValue.geographies.split(',').map((g: string) => g.trim()) : [],
        managers: formValue.managers ? formValue.managers.split(',').map((m: string) => m.trim()) : []
      };

      this.onSave.emit(newFund);
    }
  }
}