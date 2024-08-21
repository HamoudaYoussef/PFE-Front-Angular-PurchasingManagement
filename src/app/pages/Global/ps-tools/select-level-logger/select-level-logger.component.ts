import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'app-select-level-logger',
  templateUrl: './select-level-logger.component.html',
  styleUrls: ['./select-level-logger.component.scss']
})
export class SelectLevelLoggerComponent implements OnInit {

  constructor(private translateService: TranslateService) { }
// {
//   id:2,
//   name:"Log",
//   value:"LOG",
//   icon:"fa fa-info",
//   color:"color: rgb(20 6 235);"
// },
  levels=[
    {
      id:0,
      name:"Trace",
      value:"TRACE",
      icon:"fa fa-search-plus",
      color:"color: #9542c9;"
    },
    {
      id:1,
      name:"Debug",
      value:"DEBUG",
      icon:"fa fa-bug",
      color:"color:#00bbd3;"
    },  {
      id:2,
      name:"Info",
      value:"INFO",
      icon:"fa fa-info-circle",
      color:"color: #9d9d9d;"
    }, {
      id:3,
      name:"Warn",
      value:"WARN",
      icon:"fa fa-exclamation-circle",
      color:"color: #f5e311c4;"
    },  {
      id:4,
      name:"Error",
      value:"ERROR",
      icon:"fa fa-exclamation-triangle",
      color:"color: red;"
    },{
      id:5,
      name:"Fatal",
      value:"FATAL",
      icon:"fa fa-bomb",
      color:"color: red;"
    }
  ]
  ngOnInit(): void {
  }
  selectionChanged(e){
    switch (e.selectedItem.value) {
      case ("TRACE"): {
        localStorage.setItem("levelLogger","TRACE")
        break
      }
      case ("DEBUG"): {
        localStorage.setItem("levelLogger","DEBUG")
        break
      }
      case ("INFO"): {
        localStorage.setItem("levelLogger","INFO")
        break
      }
      case ("LOG"): {
        localStorage.setItem("levelLogger","LOG")
        break
      }
      case ("WARN"): {
        localStorage.setItem("levelLogger","WARN")
        break
      }
      case ("ERROR"): {
        localStorage.setItem("levelLogger","ERROR")
        break
      }
      case ("FATAL"): {
        localStorage.setItem("levelLogger","FATAL")
        break
      }
    }
  }
}
