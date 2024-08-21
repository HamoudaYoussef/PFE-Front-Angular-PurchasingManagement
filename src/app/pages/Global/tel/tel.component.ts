import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
import {PhoneNumberUtil, PhoneNumberType} from 'google-libphonenumber';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-tel',
  templateUrl: './tel.component.html',
  styleUrls: ['./tel.component.scss']
})
export class TelComponent implements OnInit, OnChanges {

  @Input() Mode: Boolean = false;
  @Input() label = 'Mobile'
  @Input() document
  countrycode
  typeicon

  constructor(private toster: ToastrService) {

  }


  ngOnInit() {
    if (this.label) {
      if (this.label == 'Mobile') {
        this.typeicon = "fa-mobile-screen-button"
        if(this.document.phoneNumber)this.document[this.label]=this.document.phoneNumber

      }
      else if (this.label == 'Fax') {
        this.typeicon = "fa-fax"
        if(this.document.faxNumber){
          if(this.document.faxNumber)this.document[this.label]=this.document.faxNumber
        }
        else this.document[this.label]=null
      }
      else this.typeicon = ""
    }


  }


//--------------------function of change country
  countrychange(e) {

  this.countrycode = e.iso2

  }

//--------------function of change input phone---------------------------------
  change(e) {
    if (e.target.value) {

//-----------------parse phone -----------------------------------
      const phoneNumberUtil = PhoneNumberUtil.getInstance();
      const phoneNumber = phoneNumberUtil.parse(e.target.value, this.countrycode);
//-----------isPhoneNumber or not -----------------------------
      const isPossibleNumber = phoneNumberUtil.isPossibleNumber(phoneNumber);
      const honeNumberType = phoneNumberUtil.getNumberType(phoneNumber);
 //---------------choose between Mobile & Fax ---------------------
      if (this.label == 'Mobile') {
        if (isPossibleNumber) {
          if (honeNumberType !== PhoneNumberType.MOBILE) {

            this.toster.error("Ce n'est pas un numéro de portable.  ")
            this.document.phone=null

          }
          else
            this.document.phoneNumber = e.target.value
        }

      } else if (this.label == 'Fax') {
        if (isPossibleNumber) {
          if (honeNumberType !== PhoneNumberType.FIXED_LINE) {
            this.toster.error("Ce n'est pas un numéro fixe.  ")
            this.document.phone=null
          } else{
            this.document.faxNumber = this.document.Fax
          }

        }
      } else {
        this.toster.error("Merci de verifier le numero")
      }
    }

  }



 //-----------detect change of all component --------------------------------
  ngOnChanges() {
  }
}
