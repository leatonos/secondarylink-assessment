// src/app/pages/fund-detail/fund-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import type { Fund } from '../../models/fund.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-fund-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fund-detail.component.html',
  styleUrl: './fund-detail.component.scss'
})
export class FundDetailComponent implements OnInit {

  fund: Fund | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 1. Get the name from the URL
    const fundName = this.route.snapshot.paramMap.get('name');
    
    if (fundName) {
      this.fetchFund(fundName);
    } else {
      this.error = 'No fund specified';
      this.loading = false;
    }
  }

  fetchFund(name: string): void {
    this.loading = true;
    
    // 2. Call the new specific endpoint: /api/funds/:name
    // Use encodeURIComponent to handle spaces/special characters safely
    this.http.get<Fund>(`${environment.apiUrl}/api/funds/${encodeURIComponent(name)}`)
      .subscribe({
        next: (data) => {
          this.fund = data;
          this.loading = false;
        },
        error: (err) => {
          // If the backend returns a 404, it hits this error block
          this.error = err.status === 404 ? `Fund "${name}" not found` : 'Failed to load fund';
          this.loading = false;
          console.error(err);
        }
      });
  }

   goBack(): void {
    this.location.back();
  }
}