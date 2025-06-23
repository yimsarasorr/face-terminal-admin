import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-visitor-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, ButtonModule],
  templateUrl: './visitor-type.component.html',
})
export class VisitorTypeComponent {
  @Output() next = new EventEmitter<{ visitorType: string }>();

  form = new FormGroup({
    visitorType: new FormControl<string | null>(null, Validators.required)
  });

  onNext(): void {
    if (this.form.valid) {
      this.next.emit(this.form.value as { visitorType: string });
    }
  }
}