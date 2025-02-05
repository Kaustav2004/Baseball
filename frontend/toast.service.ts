import { Injectable } from '@angular/core';

interface Toast {
  type: 'success' | 'error';
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  showToast(type: 'success' | 'error', message: string, title?: string): void {
    this.toasts.push({ type, message, title });
    setTimeout(() => this.toasts.shift(), 3000); // Auto-remove after 3s
  }
}
