import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitor-registration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>Visitor Registration Component Shell</p>
  `,
})
export class VisitorRegistrationComponent {
  constructor() {
    console.log('VisitorRegistrationComponent is loaded, but it should be empty. The logic is now in the services.');
  }
}