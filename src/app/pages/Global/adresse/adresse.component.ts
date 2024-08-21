import {
  ChangeDetectorRef,
  Component,
  Input, OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import CustomStore from 'devextreme/data/custom_store';
import {WsService} from 'src/ws.service';
import {TokenStorageService} from '../shared-service/token-storage.service';
import {HttpServicesComponent} from '../ps-tools/http-services/http-services.component';
import {EnvService} from '../../../../env.service';
import {DataGridComponent} from '../ps-tools/data-grid/data-grid.component';
import {Paging} from "../ps-tools/class";


@Component({
  selector: 'app-adresse',
  templateUrl: './adresse.component.html',
  styleUrls: ['./adresse.component.scss']
})
export class AdresseComponent implements OnInit, OnChanges {

  gridBoxValue: [] = [];
  isGridBoxOpened: boolean;
  @Input() Mode = false;
  @Input() document: any;

  defaultCountry
  CountryData;
  CityData
  @ViewChild(HttpServicesComponent)
  public httpServicesComponent: HttpServicesComponent;
  allowedPageSizes = this.env.allowedPageSizes;
  pageSize = this.env.pageSize;
  displaycity;
  displaycountry;
  displayExprcountry = 'namenative';

  @ViewChild(DataGridComponent) private dataGridComponent: DataGridComponent;

// ----------Constructor ------------------
  constructor(private changeDetectorRef: ChangeDetectorRef, private Wservice: WsService, private fb: FormBuilder, public env: EnvService, private router: Router, private http: HttpClient, private toastr: ToastrService,
              private tokenStorage: TokenStorageService, private translateService: TranslateService) {
    if (this.tokenStorage.getToken() == null) {
      this.router.navigate(['/login']);
    }
  }


// ---------- get All Country ------------------

  getAllCountry() {
    let paging = new Paging();
    paging.pageSize = 200
    paging.pageIndex = 0
    this.CountryData = new CustomStore({
      key: 'id',
      byKey: function (key) {
        return this.http.get(this.env.apiUrlpostal + this.Wservice.getAllCountry + key.toString());
      }.bind(this),
      load: function (loadOptions: any) {

        let f = '';
        if (loadOptions.searchValue) {
          f = '?' + loadOptions.searchExpr + '.contains=' + loadOptions.searchValue;
        } else {
          f = '';
        }

        const resultat = this.httpServicesComponent.getAllLazy(false, loadOptions, this.env.apiUrlpostal + this.Wservice.getAllCountry + f
          , this.env.apiUrlpostal + this.Wservice.getCountCountry + f, paging, []);
        const count = resultat.count.then(data => {

          this.displaycountry = data.value;
        });
        return resultat.data.then(data => {


          return {
            data: data.value.content,
            totalCount: this.displaycountry
          };
        });
      }.bind(this)


    });
  }

// ---------- get All City ------------------

  getAllCity() {

    let paging = new Paging();
    paging.pageSize = 200
    paging.pageIndex = 0
    this.CityData = new CustomStore({
      byKey: function (key) {

        return this.http.get(this.env.apiUrlpostal + this.Wservice.getAllCitybyCountry + this.document.countryName + key.toString());
      }.bind(this),
      load: function (loadOptions: any) {

        let f = '';
        if (loadOptions.searchValue) {
          f = '?' + loadOptions.searchExpr + '.contains=' + loadOptions.searchValue;
        } else {
          f = '';
        }

        const resultat = this.httpServicesComponent.getAllLazy(false, loadOptions, this.env.apiUrlpostal + this.Wservice.getAllCitybyCountry + this.document.countryName
          + f, this.env.apiUrlpostal + this.Wservice.getCountCity + this.document.countryName + f, paging, []);
        const count = resultat.count.then(data => {

          this.displaycity = data.value;
        });
        return resultat.data.then(data => {
          return {

            data: data.value.content,
            totalCount: this.displaycity
          };
        });
      }.bind(this)


    });
  }

// ------value change of pays ----------------------

  changePays(e) {

    if (e.value && (typeof (e.value)!="string") ) {

      this.document.countryCode = e.value.countryCode2;
      this.document.countryName=this.document.countryName.namenative
      this.getAllCity();

    }

  }

// ------value change of city ----------------------




  ngOnInit(): void {
    this.getAllCountry();


//------------set value of country

    if (!this.document.countryName) {
      this.document.countryName = JSON.parse((localStorage.getItem('applications'))).countryName
      this.getAllCity()

    } else {
      this.getAllCity()

    }

  }


  //---------------------display of city
  gridBox_displayExpr(item) {
    return item && item.name
  }


  //-------change of city & set value of postalcode
  onGridBoxOptionChanged(e) {
    this.isGridBoxOpened = false;
    if ( (typeof (e.value)!="string") &&  e.value[0]) {
      if (e.value[0].postalCode) this.document.postalCode = e.value[0].postalCode
      else this.document.postalCode = null
    }

  }


  // ------detecte changes in composant ----------------------
  ngOnChanges() {
  }

}


