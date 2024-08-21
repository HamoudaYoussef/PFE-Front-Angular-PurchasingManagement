import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-flags-menu',
  templateUrl: './flags-menu.component.html',
  styleUrls: ['./flags-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlagsMenuComponent implements OnInit {
  
  constructor(public translateService: TranslateService, public menuService:MenuService, public appSettings: AppSettings) { }

  ngOnInit() { 
  }

  public changeLang(lang:string){  
    this.translateService.use(lang).subscribe(() => {
      let menuItems:any;
      let menu_wrapper:any;
      let menu = this.appSettings.settings.theme.menu;
      if (menu === 'vertical') {
        menuItems = this.menuService.getVerticalMenuItems(); 
        menu_wrapper = document.getElementById('vertical-menu');
        if (menu_wrapper) {
          menu_wrapper.innerHTML = '';
        } 
      } 
      if (menu === 'horizontal') {
        menuItems = this.menuService.getHorizontalMenuItems(); 
        menu_wrapper = document.getElementById('horizontal-menu');
        if (menu_wrapper) {
          menu_wrapper.innerHTML = '';
        } 
      }  
      this.menuService.createMenu(menuItems, menu_wrapper, menu); 
      let activeLink = this.menuService.getActiveLink(menuItems);
      this.menuService.setActiveLink(menuItems, activeLink); 
      if (menu === 'vertical') {
        this.menuService.showActiveSubMenu(menuItems);
      }

      let menuType = this.appSettings.settings.theme.menuType;
      if(menuType=='mini'){
        jQuery('.menu-item-link').tooltip('enable');
      } else {
        jQuery('.menu-item-link').tooltip('disable');
      }
    });
  }

  public getLangText(lang){
    if(lang == 'de'){
      return 'German';
    }
    else if(lang == 'fr'){
      return 'French';
    }
    else if(lang == 'ru'){
      return 'Russian';
    }
    else if(lang == 'tr'){
      return 'Turkish';
    }
    else{
      return 'English';
    }
  }

}
