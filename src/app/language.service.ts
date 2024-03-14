import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public languages = new Map([
    ["en", "English"],
    ["zh", "简体中文"]
  ]);
  public languageKeys: string[]

  constructor(private translateService: TranslateService) {
    this.languageKeys = [...this.languages.keys()];
  }

  public getDefaultLang(){
    let userLang = this.languageKeys[0];
    const browserLangs = navigator.languages || [navigator.language];
    for (const lang of browserLangs) {
      const baseLang = lang.split('-')[0];
      if (this.languageKeys.includes(baseLang)) {
        userLang = baseLang;
        break;
      }
    }

    return userLang;
  }

  public getCurrentLang(){
    const currentLang = localStorage.getItem('lang');
    if(this.languageKeys.includes(currentLang)){
      return currentLang;
    }
    return this.getDefaultLang();
  }

  public setCurrentLang(lang: string){
    localStorage.setItem('lang', lang);
    this.translateService.use(this.getCurrentLang());
  }
}
