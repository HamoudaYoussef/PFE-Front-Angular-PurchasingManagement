import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup , FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.scss']
})
export class AddProduitComponent implements OnInit {


  forms: FormGroup[] = [];
  toolbarItems: any[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addForm(); // Initialize with one form

    this.toolbarItems = [
      {
        location: 'before',
        text: 'Choisissez vos produits'
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          hint: 'Add Produit',
          icon: 'plus',
          onClick: this.addForm(),
        },
      }
    ];
  }

  addForm(): void {
    const form = this.fb.group({
      nom: new FormControl(''),
      description: new FormControl(''),
      quantite: new FormControl(''),
    });
    this.forms.push(form);
  }

  
}
