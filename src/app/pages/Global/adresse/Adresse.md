## COMPSANT D'ADRESSE


# Version 1.1.1

dependency :


"ngx-intl-tel-input": "^3.2.0",
"google-libphonenumber": "^3.2.31",
"intl-tel-input": "17.0.13",
"ngx-bootstrap": "^8.0.0",
"rxjs": ~7.5.0", 
"libphonenumber-js": "^1.10.14",




Input
     
    /*Adress form data from get ws  */
    @Input() dataAdresse: any;

    /*Mode to show or hide phone number */
    @Input() Mode: boolean = false; 

    /*To show OR hide same fields*/
    @Input() showcompanyName: boolean = true;  
    @Input() showpersonName: boolean = true;
    @Input() showphoneNumber: boolean = true;
    @Input() showentity: boolean = true;
    @Input() showaddressLine1: boolean = true;
    @Input() showaddressLine2: boolean = true;
    @Input() showcountryName: boolean = true;
    @Input() showcity: boolean = true;
    @Input() showpostalCode: boolean = true;
    @Input() showfaxNumber: boolean = true;
    @Input() showemail: boolean = true;
    /*To show OR hide same fields*/

Output

      /*Send data of adress a chaq changement of input  */
      @Output() datasourceofadresse = new EventEmitter<any>();


Exemple d'appel :  


        <app-adresse
        [showcompanyName]="true"
        [showpersonName]="true"
        [Mode]="true"
        [dataAdresse]="dataAdresse"
        (datasourceofadresse)="datasourceofadresse()"
        ></app-adresse>

# Version 1.1.2

NB: Dans les ws post/put ,  il faut envoyé l'attribut phonenumber && faxnumber avec le format suivant if diffrent de null :  phoneNumber.internationalNumber

pour que le dto du post & put sera

            {
            "phoneNumber": "",
            "companyName": "Browsecat",
            "entity": "depp",
            "addressLine1": "63559 Rockefeller Avenue",
            "addressLine2": "37502 Scoville Place",
            "personName": "fin",
            "countryCode": "AF",
            "phoneExtension": "+216",
            "faxNumber": undefined,
            "email": "rklaesson22@ucla.edu",
            "city": "nom ",
            "countryName": "Afghanistan",
            "postalCode": "3000"
            }
et ne pas comme ca 

                {
                "phoneNumber": {
                "number": "23 564 148",
                "internationalNumber": "+216 23 564 148",
                "nationalNumber": "23 564 148",
                "e164Number": "+21623564148",
                "countryCode": "TN",
                "dialCode": "+216"
                },
                "companyName": "Browsecat",
                "entity": "depp",
                "addressLine1": "63559 Rockefeller Avenue",
                "addressLine2": "37502 Scoville Place",
                "personName": "fin",
                "countryCode": null,
                "phoneExtension": "+216",
                "faxNumber": null,
                "email": "rklaesson22@ucla.edu",
                "city": "nom ",
                "countryName": "Afghanistan",
                "postalCode": "3000"
                }


# Version 1.1.3




dependency :


"google-libphonenumber": "^3.2.31",
"ngx-mat-intl-tel-input": "^4.0.0"




Input

    /*Adress form data from get ws  */

    @Input() dataAdresse ={} : any;
Nous avons utilisé ngModel pour récupérer les attributs et les changements de ce composant.
@Input () Mode
if Mode =true ==> les champs ont mode lecture





Exemple d'appel :

en html :
<app-adresse

        [Mode]="true"
        [dataAdresse]="dataAdresse"

        ></app-adresse>

en ts :
il faut ajouter  :
export class AccueilComponent implements OnInit, **OnChanges** {

// ------detecte changes in formGroup ----------------------
ngOnChanges() {
}

Dans ngOnit : il faut déclarer vos attributs qu'ils doivent  être visibles ou bien set des valeurs
exemple :
//------show compoenent of address
this.dataAdresse.showcompanyName = true
this.dataAdresse.showpersonName = true
this.dataAdresse.showentity = true
this.dataAdresse.showphoneNumber = true
this.dataAdresse.showfaxNumber = true
this.dataAdresse.showemail = true
this.dataAdresse.showaddressLine1 = true
this.dataAdresse.showaddressLine2 = false
this.dataAdresse.showcountryName = true
this.dataAdresse.CountryInput = true
this.dataAdresse.CountrySelect = true
this.dataAdresse.showcity = true
this.dataAdresse.showpostalCode = true
this.datatel.phoneNumber="+21623564148"
this.dataAdresse.phoneNumber="+21623564148"
this.dataAdresse.faxNumber="+21671260230"
this.dataAdresse.countryName="Tunisie"



