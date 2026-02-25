import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import type { Fund } from '../../models/fund.model';
import { FormsModule } from '@angular/forms';
import { FundEditorComponent } from '../fund-editor/fund-editor.component';
import { FundDeleteComponent } from '../fund-delete/fund-delete.component';
import { FundCreateComponent } from '../fund-create/fund-create.component';

@Component({
  selector: 'app-funds-table',
  standalone: true,
  imports: [CommonModule,FormsModule,FundEditorComponent,FundDeleteComponent,FundCreateComponent],
  templateUrl: './funds-table.component.html',
  styleUrl: './funds-table.component.scss'
})
export class FundsTableComponent implements OnInit {

  // Sorting
  sortField: 'name' | 'fundSize' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filters
  filterName: string = '';
  filterCurrency: string = '';
  filterVintage: string = '';
  filterStrategy: string = '';
  filterManager: string = '';

  //Funds actions
  selectedFund: Fund | null = null;
  fundToDelete: Fund | null = null;
  showCreator = false;

  //Table States
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
  let result = [...this.funds];

  // Filtering Logic

  // Name filter
  if (this.filterName) {
    result = result.filter(f =>
      f.name.toLowerCase().includes(this.filterName.toLowerCase())
    );
  }

  // Currency filter
  if (this.filterCurrency) {
    result = result.filter(f =>
      f.currency.toLowerCase().includes(this.filterCurrency.toLowerCase())
    );
  }

  // Vintage filter
  if (this.filterVintage) {
    result = result.filter(f =>
      f.vintage.toString().includes(this.filterVintage)
    );
  }

  // Strategy filter
  if (this.filterStrategy) {
    result = result.filter(f =>
      f.strategies.some(s =>
        s.toLowerCase().includes(this.filterStrategy.toLowerCase())
      )
    );
  }

  // Manager filter
  if (this.filterManager) {
    result = result.filter(f =>
      f.managers.some(m =>
        m.toLowerCase().includes(this.filterManager.toLowerCase())
      )
    );
  }

  // Sorting logic
  if (this.sortField) {
    result.sort((a, b) => {
      const valueA = a[this.sortField!];
      const valueB = b[this.sortField!];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Updates total pages
  this.totalPages = Math.ceil(result.length / this.pageSize) || 1;
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }

  // Pagination
  const start = (this.currentPage - 1) * this.pageSize;
  return result.slice(start, start + this.pageSize);
}

sortBy(field: 'name' | 'fundSize'): void {
  if (this.sortField === field) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortField = field;
    this.sortDirection = 'asc';
  }
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

  
  // Update Fund Logic

  selectFundForEdit(fund: Fund): void {
    this.selectedFund = fund;
  }

  closeModal(): void {
    this.selectedFund = null;
  }

  onFundUpdated(updatedFund: Fund) {
    console.log('Something got updated!')
    this.closeModal()
  const index = this.funds.findIndex(f => f.name === updatedFund.name);
  if (index !== -1) {
    this.funds[index] = updatedFund; // Angular detects the change
  }
}


  // Delete Fund Logic

  confirmDelete(fund: Fund): void {
    this.fundToDelete = fund;
  }

  cancelDelete(): void {
    this.fundToDelete = null;
  }

  executeDelete(): void {
    if (!this.fundToDelete) return;

    const encodedName = encodeURIComponent(this.fundToDelete.name);
    this.http.delete(`http://localhost:3000/api/funds/${encodedName}`)
      .subscribe({
        next: () => {
          // Refresh the local list so the deleted fund disappears
          this.funds = this.funds.filter(f => f.name !== this.fundToDelete?.name);
          this.calculateTotalPages();
          this.cancelDelete(); // Close modal
          console.log('Fund deleted successfully');
        },
        error: (err) => {
          alert('Error deleting fund');
          console.error(err);
        }
      });
  }

  // Create Fund Logic

  executeCreate(newFund: Fund): void {
    this.http.post<Fund>('http://localhost:3000/api/funds', newFund)
      .subscribe({
        next: (createdFund) => {
          // 1. Add the new fund to the local list
          this.funds = [...this.funds, createdFund];
          this.calculateTotalPages();
          // 2. Close modal
          this.showCreator = false;
          console.log('Fund created successfully');
        },
        error: (err) => {
          alert(err.error?.message || 'Error creating fund');
          console.error(err);
        }
      });
  }
}