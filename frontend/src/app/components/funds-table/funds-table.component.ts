// src/app/pages/funds-table/funds-table.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import type { Fund } from '../../models/fund.model';

@Component({
  selector: 'app-funds-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funds-table.component.html',
  styleUrl: './funds-table.component.scss'
})
export class FundsTableComponent implements OnInit {

  funds: Fund[] = [];
  loading = true;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 5; // default rows per page
  totalPages = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFunds();
  }

  // Gets all the funds from the database
  fetchFunds(): void {
    this.http.get<Fund[]>('http://localhost:3000/api/funds')
      .subscribe({
        next: (data) => {
          this.funds = data;
          this.loading = false;
          this.calculateTotalPages();
        },
        error: (err) => {
          this.error = 'Failed to load funds';
          this.loading = false;
          console.error(err);
        }
      });
  }

  get paginatedFunds(): Fund[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.funds.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  onPageSizeChange(newSize: any): void {
    const size = Number(newSize); 
    if (!isNaN(size) && size > 0) {
      this.pageSize = size;
      this.currentPage = 1;
      this.calculateTotalPages();
    }
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.funds.length / this.pageSize) || 1;
    // Clamp currentPage if it somehow went over
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }
}