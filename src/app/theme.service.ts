import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private Theme: 'dark' | 'light' | 'auto';
  private ThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(private rendererFactory: RendererFactory2) {
    const savedTheme = localStorage.getItem('colorTheme') as 'dark' | 'light' | 'auto';
    this.Theme = savedTheme || 'auto';
    this.renderer = this.rendererFactory.createRenderer(null, null);

    // wait for dom
    this.waitForDomReady(() => {
      this.applyColorTheme();

      this.ThemeMediaQuery.addEventListener('change', () => {
        if (this.Theme === 'auto') {
          this.applyColorTheme();
        }
      });
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

    this.setStatusBarColor(isDarkMode);
  }

  getTheme() {
    return this.Theme;
  }

  private setStatusBarColor(isDarkMode: boolean) {
    // For Android
    this.updateMetaTag('theme-color', isDarkMode ? '#2a2f33' : '#f9fafa');

    // For iOS
    this.updateMetaTag('apple-mobile-web-app-status-bar-style', isDarkMode ? 'black' : 'default');
  }

  private updateMetaTag(name: string, content: string): void {
    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = this.renderer.createElement('meta');
      this.renderer.setAttribute(metaTag, 'name', name);
      this.renderer.appendChild(document.head, metaTag);
    }
    this.renderer.setAttribute(metaTag, 'content', content);
  }

  private waitForDomReady(callback: () => void): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
}
