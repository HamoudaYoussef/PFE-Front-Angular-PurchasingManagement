import {Component, ElementRef, OnInit, Output, ViewChild, EventEmitter, Input} from '@angular/core';
import {ClipboardService} from "ngx-clipboard";
import {locale} from "devextreme/localization";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-formeo',
  templateUrl: './formeo.component.html',
  styleUrls: ['./formeo.component.scss']
})
export class FormeoComponent implements OnInit {
  @ViewChild('json') jsonElement?: ElementRef
  @Output() jsonOutPut=new EventEmitter<any>()
  @Input('datasource') datasource
  @Input('readOnly') readOnly

  @Input('form') form
      = {
    components:  [
    ]
  }
  constructor( private clipboardService:ClipboardService,
               private translateService: TranslateService,
               private toastr:ToastrService) {

  }
  ngOnInit(): void {
    if(this.form == null || this.form == undefined )
    {
      this.form = {
        components:  [
        ]
      }
    }
    if(this.form) {
      this.formulaire = this.form
      this.beautifyJsonInput(JSON.stringify(this.form))
    }
    if(this.datasource) {
      this.form.components.forEach(element => {
        element["defaultValue"] = this.datasource[element.key]
      })
    }
  }
  copier(){
    this.clipboardService.copyFromContent(this.jsonOutPutString)
    this.translateService.get("messageCopy").subscribe((res) => {
      this.toastr.success(res, "",
          {
            closeButton: true,
            positionClass: 'toast-top-right',
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 600,
            extendedTimeOut: 100,
          })
    })
  }
  submit(e){
  if(e.data) {
    this.beautifyJsonInput(e.data)
    this.form["data"]=e.data
    this.jsonOutPut.emit( this.form)
  }
  }

  change(e){
    if(e.data) {
      this.beautifyJsonInput(JSON.stringify(e.data))
      // this.form["data"]=e.data
      // this.jsonOutPut.emit( this.form)

      // this.form.components.forEach(element =>{
      //   element["defaultValue"]=e.data[element.key]
      // })
      this.jsonOutPut.emit( JSON.stringify(e.data))
    }
  }
  closePopupCopy(){
    this.popupShowJsonFormulaire=false
  }
  formulaire
  jsonOutPutString
  beautifyJsonInput(data: string) {
    if (data) {
      let parsed = JSON.parse(data);
      data = JSON.stringify(parsed, null, 2);
      this.jsonOutPutString = data;
    }
  }
  onChange(event) {
    this.formulaire=event.form
    // this.formulaire["data"]={
    //    checkbox: true,
    //    name: "ttttttttttttttttt",
    //    radio: "test",
    //    submit: true
    // }

    this.beautifyJsonInput(JSON.stringify(event.form))
  //  this.jsonOutPutString=JSON.stringify(event.form)
    this.jsonOutPut.emit(event.form)
  }

  refresh(){
    this.form= {
      components: []
    }
  }
  popupShowJsonFormulaire=false
  show(){
    this.popupShowJsonFormulaire=true
  }
}
