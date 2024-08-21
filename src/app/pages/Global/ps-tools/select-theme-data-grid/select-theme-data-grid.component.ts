import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import DevExpress from "devextreme";
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import themes from "devextreme/ui/themes";
@Component({
  selector: 'app-select-theme-data-grid',
  templateUrl: './select-theme-data-grid.component.html',
  styleUrls: ['./select-theme-data-grid.component.scss']
})
export class SelectThemeDataGridComponent implements OnInit {
  fromUngroupedData

  constructor(private translateService: TranslateService) {
    this.fromUngroupedData = new DataSource({
      store: new ArrayStore({
        data: this.themes,
        key: 'id',
      }),
      group: 'Category',
    });

  }

  themes=[
    {
      id:1,
      name:"Light",
      value:"Light",
      icon:"assets/themes/light.PNG",
      Category:"Generic"
    },
    {
      id:2,
      name:"Dark",
      value:"Dark",
      icon:"assets/themes/Dark.PNG",
      Category:"Generic"
    },
    {
      id:3,
      name:"Contrast",
      value:"Contrast",
      icon:"assets/themes/Contrast.PNG",
      Category:"Generic"
    },
    {
      id:4,
      name:"Carmine",
      value:"Carmine",
      icon:"assets/themes/Carmine.PNG",
      Category:"Generic"
    },
    {
      id:5,
      name:"Dark Moon",
      value:"Dark Moon",
      icon:"assets/themes/DarkMoon.PNG",
      Category:"Generic"
    },
    {
      id:6,
      name:"Soft Blue",
      value:"Soft Blue",
      icon:"assets/themes/SoftBlue.PNG",
      Category:"Generic"
    },
    {
      id:7,
      name:"Dark Violet",
      value:"Dark Violet",
      icon:"assets/themes/DarkViolet.PNG",
      Category:"Generic"
    },
    {
      id:8,
      name:"Green Mist",
      value:"Green Mist",
      icon:"assets/themes/GreenMist.PNG",
      Category:"Generic"
    },
    {
      id:9,
      name:"Light Compact",
      value:"Light Compact",
      icon:"assets/themes/LightCompact.PNG",
      Category:"Generic Compact"
    },  {
      id:10,
      name:"Dark Compact",
      value:"Dark Compact",
      icon:"assets/themes/DarkCompact.PNG",
      Category:"Generic Compact"
    }, {
      id:11,
      name:"Contrast Compact",
      value:"Contrast Compact",
      icon:"assets/themes/ContrastCompact.PNG",
      Category:"Generic Compact"
    },  {
      id:12,
      name:"Blue Light",
      value:"Blue Light",
      icon:"assets/themes/BlueLight.PNG",
      Category:"Material Design"
    }, {
      id:13,
      name:"Blue Dark",
      value:"Blue Dark",
      icon:"assets/themes/BlueDark.PNG",
      Category:"Material Design"
    }, {
      id:14,
      name:"Lime Light",
      value:"Lime Light",
      icon:"assets/themes/LimeLight.PNG",
      Category:"Material Design"
    }, {
      id:15,
      name:"Lime Dark",
      value:"Lime Dark",
      icon:"assets/themes/LimeDark.PNG",
      Category:"Material Design"
    }, {
      id:16,
      name:"Orange Light",
      value:"Orange Light",
      icon:"assets/themes/OrangeLight.PNG",
      Category:"Material Design"
    }, {
      id:17,
      name:"Orange Dark",
      value:"Orange Dark",
      icon:"assets/themes/OrangeDark.PNG",
      Category:"Material Design"
    }, {
      id:18,
      name:"Purple Light",
      value:"Purple Light",
      icon:"assets/themes/PurpleLight.PNG",
      Category:"Material Design"
    }, {
      id:19,
      name:"Purple Dark",
      value:"Purple Dark",
      icon:"assets/themes/PurpleDark.PNG",
      Category:"Material Design"
    }, {
      id:20,
      name:"Teal Light",
      value:"Teal Light",
      icon:"assets/themes/TealLight.PNG",
      Category:"Material Design"
    }, {
      id:21,
      name:"Teal Dark",
      value:"Teal Dark",
      icon:"assets/themes/TealDark.PNG",
      Category:"Material Design"
    }, {
      id:22,
      name:"Blue Light Compact",
      value:"Blue Light Compact",
      icon:"assets/themes/BlueLightCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:23,
      name:"Blue Dark Compact",
      value:"Blue Dark Compact",
      icon:"assets/themes/BlueDarkCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:24,
      name:"Lime Light Compact",
      value:"Lime Light Compact",
      icon:"assets/themes/LimeLightCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:25,
      name:"Lime Dark Compact",
      value:"Lime Dark Compact",
      icon:"assets/themes/LimeDarkCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:26,
      name:"Orange Light Compact",
      value:"Orange Light Compact",
      icon:"assets/themes/OrangeLightCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:27,
      name:"Orange Dark Compact",
      value:"Orange Dark Compact",
      icon:"assets/themes/OrangeDarkCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:28,
      name:"Purple Light Compact",
      value:"Purple Light Compact",
      icon:"assets/themes/PurpleLightCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:29,
      name:"Purple Dark Compact",
      value:"Purple Dark Compact",
      icon:"assets/themes/PurpleDarkCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:30,
      name:"Teal Light Compact",
      value:"Teal Light Compact",
      icon:"assets/themes/TealLightCompact.PNG",
      Category:"Material Design Compact"
    }, {
      id:31,
      name:"Teal Dark Compact",
      value:"Teal Dark Compact",
      icon:"assets/themes/TealDarkCompact.PNG",
      Category:"Material Design Compact"
    }
  ]
  ngOnInit(): void {
  }
  changeTheme(theme) {
    // setTimeout(() => {
      themes.current(theme);
    // }, 2000);
    // a timeout is used for the demonstration purpose so that a theme is not switched immediately
  }

  selectionChanged(e){
    switch (e.selectedItem.value) {
      case ("Light"): {
        this.changeTheme("generic.light")
        localStorage.setItem("theme","generic.light")
        break
      }
      case ("Dark"): {
        this.changeTheme("generic.dark")
        localStorage.setItem("theme","generic.dark")
        break
      }
      case ("Contrast"): {
        this.changeTheme("generic.contrast")
        localStorage.setItem("theme","generic.contrast")
        break
      }
      case ("Carmine"): {
        this.changeTheme("generic.carmine")
        localStorage.setItem("theme","generic.carmine")
        break
      }
      case ("Dark Moon"): {
        this.changeTheme("generic.darkmoon")
        localStorage.setItem("theme","generic.darkmoon")
        break
      }
      case ("Soft Blue"): {
        this.changeTheme("generic.softblue")
        localStorage.setItem("theme","generic.softblue")
        break
      }
      case ("Dark Violet"): {
        this.changeTheme("generic.darkviolet")
        localStorage.setItem("theme","generic.darkviolet")
        break
      }
      case ("Green Mist"): {
        this.changeTheme("generic.greenmist")
        localStorage.setItem("theme","generic.greenmist")
        break
      }
      case ("Light Compact"): {
        this.changeTheme("generic.light.compact")
        localStorage.setItem("theme","generic.light.compact")
        break
      }
      case ("Dark Compact"): {
        this.changeTheme("generic.dark.compact")
        localStorage.setItem("theme","generic.dark.compact")
        break
      }
      case ("Contrast Compact"): {
        this.changeTheme("generic.contrast.compact")
        localStorage.setItem("theme","generic.contrast.compact")
        break
      }
      case ("Blue Light"): {
        this.changeTheme("material.blue.light")
        localStorage.setItem("theme","material.blue.light")
        break
      }
      case ("Blue Dark"): {
        this.changeTheme("material.blue.dark")
        localStorage.setItem("theme","material.blue.dark")
        break
      }
      case ("Lime Light"): {
        this.changeTheme("material.lime.light")
        localStorage.setItem("theme","material.lime.light")
        break
      }
      case ("Lime Dark"): {
        this.changeTheme("material.lime.dark")
        localStorage.setItem("theme","material.lime.dark")
        break
      }
      case ("Lime Light Compact"): {
        this.changeTheme("material.lime.light.compact")
        localStorage.setItem("theme","material.lime.light.compact")
        break
      }
      case ("Lime Dark Compact"): {
        this.changeTheme("material.lime.dark.compact")
        localStorage.setItem("theme","material.lime.dark.compact")
        break
      }
      case ("Orange Light"): {
        this.changeTheme("material.orange.light")
        localStorage.setItem("theme","material.orange.light")
        break
      }
      case ("Orange Dark"): {
        this.changeTheme("material.orange.dark")
        localStorage.setItem("theme","material.orange.dark")
        break
      }
      case ("Purple Light"): {
        this.changeTheme("material.purple.light")
        localStorage.setItem("theme","material.purple.light")
        break
      }
      case ("Purple Dark"): {
        this.changeTheme("material.purple.dark")
        localStorage.setItem("theme","material.purple.dark")
        break
      }
      case ("Teal Light"): {
        this.changeTheme("material.teal.light")
        localStorage.setItem("theme","material.teal.light")
        break
      }
      case ("Teal Dark"): {
        this.changeTheme("material.teal.dark")
        localStorage.setItem("theme","material.teal.dark")
        break
      }


      case ("Blue Light Compact"): {
        this.changeTheme("material.blue.light.compact")
        localStorage.setItem("theme","material.blue.light.compact")
        break
      }
      case ("Blue Dark Compact"): {
        this.changeTheme("material.blue.dark.compact")
        localStorage.setItem("theme","material.blue.dark.compact")
        break
      }
      case ("Lime Light Compact"): {
        this.changeTheme("material.lime.light.compact")
        localStorage.setItem("theme","material.lime.light.compact")
        break
      }
      case ("Lime Dark Compact"): {
        this.changeTheme("material.lime.dark.compact")
        localStorage.setItem("theme","material.lime.dark.compact")
        break
      }
      case ("Orange Light Compact"): {
        this.changeTheme("material.orange.light.compact")
        localStorage.setItem("theme","material.orange.light.compact")
        break
      }
      case ("Orange Dark Compact"): {
        this.changeTheme("material.orange.dark.compact")
        localStorage.setItem("theme","material.orange.dark.compact")
        break
      }
      case ("Purple Light Compact"): {
        this.changeTheme("material.purple.light.compact")
        localStorage.setItem("theme","material.purple.light.compact")
        break
      }
      case ("Purple Dark Compact"): {
        this.changeTheme("material.purple.dark.compact")
        localStorage.setItem("theme","material.purple.dark.compact")
        break
      }
      case ("Teal Light Compact"): {
        this.changeTheme("material.teal.light.compact")
        localStorage.setItem("theme","material.teal.light.compact")
        break
      }
      case ("Teal Dark Compact"): {
        this.changeTheme("material.teal.dark.compact")
        localStorage.setItem("theme","material.teal.dark.compact")
        break
      }
    }
  }
}
