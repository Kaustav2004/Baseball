import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts"
        class="toast"
        [ngClass]="toast.type"
      >
        <strong *ngIf="toast.title">{{ toast.title }}</strong>
        <p>{{ toast.message }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
      }
      .toast {
        background-color: #333;
        color: #fff;
        padding: 10px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        animation: fadeInOut 3s ease-in-out forwards;
      }
      .toast.success {
        background-color: #28a745;
      }
      .toast.error {
        background-color: #dc3545;
      }
      @keyframes fadeInOut {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        10% {
          opacity: 1;
          transform: translateY(0);
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    `,
  ],
  imports: [CommonModule],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
