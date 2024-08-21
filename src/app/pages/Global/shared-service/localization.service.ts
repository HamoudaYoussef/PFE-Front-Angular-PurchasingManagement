import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {locale} from "devextreme/localization";

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  constructor(private translateService: TranslateService) {
  }

  setInitialLanguage() {
    if (localStorage.getItem('locale') != null) {
      this.translateService.use(localStorage.getItem('locale'));
    } else {
      this.translateService.use('fr');
      locale('fr');
    }
  }
}