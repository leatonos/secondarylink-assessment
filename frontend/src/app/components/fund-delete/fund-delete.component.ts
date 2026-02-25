import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fund-delete.component.html',
  styleUrl: './fund-delete.component.scss'
})
export class FundDeleteComponent {
  @Input() fundName: string = '';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}