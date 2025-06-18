import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-select-building',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, ButtonModule],
  templateUrl: './select-building.component.html'
})
export class SelectBuildingComponent {
  @Output() next = new EventEmitter<any>();

  form = new FormGroup({
    building: new FormControl('', Validators.required)
  });

  onNext(): void {
    if (this.form.valid) {
      this.next.emit(this.form.value);
    }
  }
}