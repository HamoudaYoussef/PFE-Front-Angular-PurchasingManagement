import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ExampleService} from "../example.service";
import {appElement} from "../example.module";


@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.scss']
})
export class ExampleFormComponent implements OnInit {

  appForm: FormGroup
  item: any[] = [];
  currentItemId: string;
  constructor( private activatedRoute: ActivatedRoute,
               private exampleService: ExampleService,
               private router: Router) { }

  initForm(item): void {
    this.appForm = new FormGroup({
      name: new FormControl(item?.name),
      label: new FormControl(item?.label),
       });
  }
  Return() {
    this.router.navigate(['GlobalSettings/GestionModuleUi']);
  }
  onSubmit(): void {
    // Send your form here using an http request
    const objectToSubmit: appElement = {...this.item, ...this.appForm.value};
    this.exampleService.postApp(objectToSubmit).then((savedObject) => {
      console.log(savedObject);
      this.Return();
    });
  }

  ngOnInit(): void {
console.log('testjira')
    //get selected item id from url web test
    this.currentItemId = this.activatedRoute.snapshot.params.id;
    if (!!this.currentItemId) {
      this.exampleService.getAppById(this.currentItemId).then((item) => {
        this.item = item;
        this.initForm(item);
      });
    } else {
      this.initForm(null);
    }

  }

}
