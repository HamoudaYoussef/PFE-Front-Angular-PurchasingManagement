import { Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Menu } from './menu.model';
import { verticalMenuItems } from './menu';
import { horizontalMenuItems } from './menu';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MenuService {
    menu: any[] = []
    usermenu: any[]
  constructor(private location:Location, 
              private renderer2:Renderer2,
              private router:Router,
              public translateService: TranslateService){

      this.usermenu = JSON.parse(localStorage.getItem('usermenu'))
      if (this.usermenu != undefined) {
          if (this.usermenu != null) {
              this.usermenu.sort((a, b) => a.order - b.order).forEach((men, index) => {
                  if (men.typelink === "HREF") {
                      this.menu.push(new Menu(men.id, men.title, null, men.link, men.icon, null, men.hasSubMenu, men.parentId))

                  } else {
                      this.menu.push(new Menu(men.id, men.title, men.link, null, men.icon, null, men.hasSubMenu, men.parentId))

                  }
              })
          }
      }

  }


  public getVerticalMenuItems():Array<Menu> {
      return this.menu;
  }



  public getHorizontalMenuItems():Array<Menu> {
    return horizontalMenuItems;
  }

  public createMenu(menu:Array<Menu>, nativeElement, type){    
     if(type=='vertical'){
       this.createVerticalMenu(menu, nativeElement);
     }
     if(type=='horizontal'){
       this.createHorizontalMenu(menu, nativeElement);
     }
  }

  public createVerticalMenu(menu:Array<Menu>, nativeElement){    
    let menu0 = this.renderer2.createElement('div');
    this.renderer2.setAttribute(menu0, 'id', 'menu0');
    menu.forEach((menuItem) => {
        if(menuItem.parentId == 0){
          let subMenu = this.createVerticalMenuItem(menu, menuItem);
          this.renderer2.appendChild(menu0, subMenu);
        }
    });
    this.renderer2.appendChild(nativeElement, menu0); 
  }

  public createHorizontalMenu(menu:Array<Menu>, nativeElement){
    let nav = this.renderer2.createElement('div');
    this.renderer2.setAttribute(nav, 'id', 'navigation');
    let ul = this.renderer2.createElement('ul');
    this.renderer2.addClass(ul, 'menu');
    this.renderer2.appendChild(nav, ul);
    menu.forEach((menuItem) => {
        if(menuItem.parentId == 0){
          let subMenu = this.createHorizontalMenuItem(menu, menuItem);
          this.renderer2.appendChild(ul, subMenu);
        }
    });
    this.renderer2.appendChild(nativeElement, nav); 
  }

  public createVerticalMenuItem(menu:Array<Menu>, menuItem){
    let div = this.renderer2.createElement('div');
    this.renderer2.addClass(div, 'card'); 
    this.renderer2.setAttribute(div, 'id', 'menu'+menuItem.id);
    let link = this.renderer2.createElement('a');
    this.renderer2.addClass(link, 'menu-item-link');
    this.renderer2.setAttribute(link, 'data-toggle', 'tooltip');
    this.renderer2.setAttribute(link, 'data-placement', 'right');
    this.renderer2.setAttribute(link, 'data-animation', 'false');
    this.renderer2.setAttribute(link, 'data-container', '.vertical-menu-tooltip-place');    
    this.renderer2.setAttribute(link, 'data-original-title', this.translateService.instant(menuItem.title));
    let icon = this.renderer2.createElement('i');
    this.renderer2.addClass(icon, 'fa');
    this.renderer2.addClass(icon, menuItem.icon);
    this.renderer2.appendChild(link, icon);
    let span = this.renderer2.createElement('span');
    this.renderer2.addClass(span, 'menu-title');
    this.renderer2.appendChild(link, span);
    let menuText = this.renderer2.createText(this.translateService.instant(menuItem.title)); 
    this.renderer2.appendChild(span, menuText);
    this.renderer2.setAttribute(link, 'id', 'link'+menuItem.id);
    this.renderer2.addClass(link, 'transition');
    this.renderer2.appendChild(div, link);
    if(menuItem.routerLink){             
      this.renderer2.listen(link, "click", () => { 
          this.router.navigate([menuItem.routerLink]);
          this.setActiveLink(menu,link);
          this.closeOtherSubMenus(div);
      });
    }
    if(menuItem.href){
      this.renderer2.setAttribute(link, 'href', menuItem.href);
    }
    if(menuItem.target){
      this.renderer2.setAttribute(link, 'target', menuItem.target);
    }
    if(menuItem.hasSubMenu){
      this.renderer2.addClass(link, 'collapsed'); 
      let caret = this.renderer2.createElement('b');
      this.renderer2.addClass(caret, 'fa');
      this.renderer2.addClass(caret, 'fa-angle-up');
      this.renderer2.appendChild(link, caret);
      this.renderer2.setAttribute(link, 'data-toggle', 'collapse');
      this.renderer2.setAttribute(link, 'href', '#collapse'+menuItem.id);
      let collapse = this.renderer2.createElement('div');
      this.renderer2.setAttribute(collapse, 'id', 'collapse'+menuItem.id);
      this.renderer2.setAttribute(collapse, 'data-parent', '#menu'+menuItem.parentId);
      this.renderer2.addClass(collapse, 'collapse');
      this.renderer2.appendChild(div, collapse);          
      this.createSubMenu(menu, menuItem.id, collapse, 'vertical');
    }
    return div;
  }

  public createHorizontalMenuItem(menu:Array<Menu>, menuItem){
      let li = this.renderer2.createElement('li');
      this.renderer2.addClass(li, 'menu-item');
      let link = this.renderer2.createElement('a');
      this.renderer2.addClass(link, 'menu-item-link');
      this.renderer2.setAttribute(link, 'data-toggle', 'tooltip');
      this.renderer2.setAttribute(link, 'data-placement', 'top');
      this.renderer2.setAttribute(link, 'data-animation', 'false');
      this.renderer2.setAttribute(link, 'data-container', '.horizontal-menu-tooltip-place');    
      this.renderer2.setAttribute(link, 'data-original-title', this.translateService.instant(menuItem.title));
      let icon = this.renderer2.createElement('i');
      this.renderer2.addClass(icon, 'fa');
      this.renderer2.addClass(icon, menuItem.icon);
      this.renderer2.appendChild(link, icon);
      let span = this.renderer2.createElement('span');
      this.renderer2.addClass(span, 'menu-title');
      this.renderer2.appendChild(link, span);
      let menuText = this.renderer2.createText(this.translateService.instant(menuItem.title));
      this.renderer2.appendChild(span, menuText);
      this.renderer2.appendChild(li, link);
      this.renderer2.setAttribute(link, 'id', 'link'+menuItem.id);
      this.renderer2.addClass(link, 'transition');
      if(menuItem.routerLink){             
        this.renderer2.listen(link, "click", () => {  
            this.router.navigate([menuItem.routerLink]);
            this.setActiveLink(menu, link);
        });
      }
      if(menuItem.href){
        this.renderer2.setAttribute(link, 'href', menuItem.href);
      }
      if(menuItem.target){
        this.renderer2.setAttribute(link, 'target', menuItem.target);
      }
      if(menuItem.hasSubMenu){
        this.renderer2.addClass(li, 'menu-item-has-children');
        let subMenu = this.renderer2.createElement('ul');
        this.renderer2.addClass(subMenu, 'sub-menu');
        this.renderer2.appendChild(li, subMenu);
        this.createSubMenu(menu, menuItem.id, subMenu, 'horizontal');
      }
      return li;
  }

  private createSubMenu(menu:Array<Menu>, menuItemId, parentElement, type){
      let menus = menu.filter(item => item.parentId === menuItemId);
      menus.forEach((menuItem) => {
        let subMenu = null;
        if(type=='vertical'){
           subMenu = this.createVerticalMenuItem(menu, menuItem);
        }
        if(type=='horizontal'){
           subMenu = this.createHorizontalMenuItem(menu, menuItem);
        }      
        this.renderer2.appendChild(parentElement, subMenu);
      });
  } 

  private closeOtherSubMenus(elem){
      let children = (this.renderer2.parentNode(elem)).children;
      for (let i = 0; i < children.length; i++) {
          let child = this.renderer2.nextSibling(children[i].children[0]);
          if(child){
              this.renderer2.addClass(children[i].children[0], 'collapsed');   
              this.renderer2.removeClass(child, 'show');               
          }
      }
  }

  public getActiveLink(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = (url) ? url : '/'; // url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
        let activeLink = document.querySelector("#link"+activeMenuItem[0].id);
        return activeLink;
      }
      return false;
  }

  public setActiveLink(menu:Array<Menu>, link){
      if(link){
          menu.forEach((menuItem) => {
            let activeLink = document.querySelector("#link"+menuItem.id);
            if(activeLink){
              if(activeLink.classList.contains('active-link')){
                activeLink.classList.remove('active-link');
              }
            }       
          });
          this.renderer2.addClass(link, 'active-link'); 
      }    
  } 

  public showActiveSubMenu(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = url; //url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
          let activeLink = document.querySelector("#link"+activeMenuItem[0].id);      
          let parent = this.renderer2.parentNode(activeLink);
          while (this.renderer2.parentNode(parent)){         
              parent = this.renderer2.parentNode(parent); 
              if(parent.classList.contains('collapse')){
                let parentMenu = menu.filter(item => item.id === activeMenuItem[0].parentId);           
                let activeParentLink = document.querySelector("#link"+parentMenu[0].id);
                this.renderer2.removeClass(activeParentLink, 'collapsed');
                this.renderer2.addClass(parent, 'show');                
              }
              if(parent.classList.contains('menu-wrapper')){
                break;
              }
          }
      }     
  }

  public addNewMenuItem(menu:Array<Menu>, newMenuItem, type){
      menu.push(newMenuItem);
      if(newMenuItem.parentId != 0){
        let parentMenu =  menu.filter(item => item.id === newMenuItem.parentId);
        if(parentMenu.length){
            if(!parentMenu[0].hasSubMenu){
              parentMenu[0].hasSubMenu = true;
            // parentMenu[0].routerLink = null;
          } 
        }                
      }
      let menu_wrapper = null;
      if(type=='vertical'){
        menu_wrapper = document.getElementById('vertical-menu');
      }
      if(type=='horizontal'){
        menu_wrapper = document.getElementById('horizontal-menu');
      }
      while (menu_wrapper.firstChild) {
          menu_wrapper.removeChild(menu_wrapper.firstChild);
      }      
      this.createMenu(menu, menu_wrapper, type);
  } 
 
}
