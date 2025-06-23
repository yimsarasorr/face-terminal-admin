import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pre-registration-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './pre-registration-code.component.html',
})
export class PreRegistrationCodeComponent {
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  form = new FormGroup({
    preRegistrationCode: new FormControl('', [Validators.required, Validators.minLength(6)])
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