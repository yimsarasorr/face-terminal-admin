import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-visitor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './visitor-form.component.html'
})
export class VisitorFormComponent {
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });

  onNext(): void {
    if (this.form.valid) {
      this.next.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onBack(): void {
    this.back.emit();
  }
}