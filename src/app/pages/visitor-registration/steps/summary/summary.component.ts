import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorData } from '../../models/visitor-workflow.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './summary.component.html'
})
export class SummaryComponent {
  @Input() data: VisitorData = {};
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}