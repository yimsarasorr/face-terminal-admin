import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, ButtonModule],
  templateUrl: './terms-condition.component.html',
})
export class TermsConditionComponent {
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  form = new FormGroup({
    termsAccepted: new FormControl(false, Validators.requiredTrue)
  });

  onNext(): void {
    if (this.form.valid) {
      this.next.emit(this.form.value);
    }
  }

  onBack(): void {
    this.back.emit();
  }
}