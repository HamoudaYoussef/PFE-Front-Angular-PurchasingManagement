#Fermeo  
Version 1.1.1
A zero dependency JavaScript module for drag and drop form creation
 dependency :

fermio 5.2.0
@angular/core @ ^9.0.0 || ^10.0.0 || ^11.0.0 || ^12.0.0
@angular/common @ ^9.0.0 || ^10.0.0 || ^11.0.0 || ^12.0.0
@angular/elements @ ^9.0.0 || ^10.0.0 || ^11.0.0|| ^12.0.0
zone.js @ ~0.11.4
formiojs @ ^4.13.8
lodash @ ^4.17.20
ngx-bootstrap @ ^5.6.1

fermio 5.2.0


##INPUT 

@Input('datasource') datasource =>  data de type json
@Input('readOnly') readOnly=> boolean true or false (false fermo ediatble si non non editable )
@Input('form') form=> formulaire 


##Output

@Output() jsonOutPut=new EventEmitter<any>() => les modification sous forme Json 

##Exemple 

      <app-formeo *ngIf="formulaire" [form]="formulaire" [datasource]="datasource" [readOnly]="readOnlyForm" (jsonOutPut)="jsonOutPut($event)" >
           </app-formeo>
