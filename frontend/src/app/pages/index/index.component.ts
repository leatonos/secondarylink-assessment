
import { Component } from '@angular/core';
import { FundsTableComponent } from 'src/app/components/funds-table/funds-table.component';

@Component({
  selector: 'app-index',
  imports: [FundsTableComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  standalone: true,
})
export class IndexComponent{
}
