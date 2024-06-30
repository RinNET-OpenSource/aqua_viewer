import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private Theme: 'dark' | 'light' | 'auto';
  private ThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    const savedTheme = localStorage.getItem('colorTheme') as 'dark' | 'light' | 'auto';
    this.Theme = savedTheme || 'auto';
    this.applyColorTheme();

    this.ThemeMediaQuery.addEventListener('change', () => {
      if (this.Theme === 'auto') {
        this.applyColorTheme();
      }
    });
  }

  public setTheme(newTheme: 'dark' | 'light' | 'auto') {
    this.Theme = newTheme;
    localStorage.setItem('colorTheme', newTheme);
    this.applyColorTheme();
  }

  private applyColorTheme() {
    const isDarkMode = this.Theme === 'dark' || (this.Theme === 'auto' && this.ThemeMediaQuery.matches);
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }

  getTheme() {
    return this.Theme;
  }
}
