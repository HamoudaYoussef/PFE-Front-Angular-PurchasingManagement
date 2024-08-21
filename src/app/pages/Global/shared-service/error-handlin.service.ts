import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private errorShown = false;

  showError(): boolean {
    if (!this.errorShown) {
      this.errorShown = true;
      return true;
    }
    return false;
  }

  resetErrorState(): void {
    this.errorShown = false;
  }
}