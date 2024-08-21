export class Settings {
    constructor(public name: string,
                public title: string,
                public theme:{
                    menu: string,
                    menuType: string,
                    showMenu: boolean,
                    navbarIsFixed: boolean,
                    footerIsFixed: boolean,
                    sidebarIsFixed: boolean,
                    showSideChat: boolean,
                    sideChatIsHoverable: boolean,
                    skin:string
                }) { }
}