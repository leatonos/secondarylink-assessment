import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Fund } from '../../models/fund.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fund-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './fund-editor.component.html',
  styleUrls: ['./fund-editor.component.scss'], // corrected
})
export class FundEditorComponent implements OnChanges {
  @Input() fund: Fund | null = null;
  fundForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { // inject HttpClient
    this.fundForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      fundSize: [0, [Validators.required, Validators.min(0)]],
      vintage: [new Date().getFullYear(), Validators.required],
      description: [''],
      strategies: [''],
      geographies: [''],
      managers: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fund'] && this.fund) {
      this.fundForm.patchValue({
        ...this.fund,
        strategies: this.fund.strategies.join(', '),
        geographies: this.fund.geographies.join(', '),
        managers: this.fund.managers.join(', ')
      });
    }
  }


  @Output() fundUpdated = new EventEmitter<Fund>();

  save(): void {
  if (!this.fund) return;
  if (this.fundForm.valid) {
    const rawValue = this.fundForm.value;

    const updatedFund: Fund = {
      ...rawValue,
      strategies: rawValue.strategies.split(',').map((s: string) => s.trim()),
      geographies: rawValue.geographies.split(',').map((g: string) => g.trim()),
      managers: rawValue.managers.split(',').map((m: string) => m.trim())
    };

    this.http.put(`http://localhost:3000/api/funds/${encodeURIComponent(this.fund.name)}`, updatedFund)
      .subscribe({
        next: (response) => {
          console.log('Updated successfully', response);
          this.fundUpdated.emit(updatedFund); // Emit the new fund so table updates its values
        },
        error: (err) => console.error('Update failed', err)
      });
  }
}
}