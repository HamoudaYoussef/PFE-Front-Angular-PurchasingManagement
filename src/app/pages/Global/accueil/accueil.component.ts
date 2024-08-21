import {Component, OnChanges, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {WsService} from "../../../../ws.service";
import {DataGrid} from "../ps-tools/data-grid/dataGridClass";
import {EnvService} from "../../../../env.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {LocalizationService} from "../shared-service/localization.service";



@Component({
    selector: 'app-accueil',
    templateUrl: './accueil.component.html',
    styleUrls: ['./accueil.component.scss'],
    providers: [CookieService],
})
export class AccueilComponent implements OnInit, OnChanges {
    private ws = new WsService();
    private env = new EnvService();
    dataGrid
  datatel: any = {};
  dataAdresse: any = {};

    formulaire = {
        "components": [
            {
                "label": "Tabs",
                "components": [
                    {
                        "label": "Agence",
                        "key": "tab1",
                        "components": [
                            {
                                "label": "Columns",
                                "columns": [
                                    {
                                        "components": [
                                            {
                                                "label": "Pays",
                                                "widget": "choicesjs",
                                                "tableView": true,
                                                "key": "pays1",
                                                "type": "select",
                                                "input": true
                                            },
                                            {
                                                "label": "Type Box",
                                                "widget": "choicesjs",
                                                "placeholder": "Choisir type Box",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "typeBox",
                                                "type": "select",
                                                "input": true
                                            }
                                        ],
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "size": "md",
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Ville",
                                                "widget": "choicesjs",
                                                "tableView": true,
                                                "key": "ville1",
                                                "type": "select",
                                                "input": true
                                            },
                                            {
                                                "label": "Agence",
                                                "widget": "choicesjs",
                                                "placeholder": "Choisir une agence",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "ville",
                                                "type": "select",
                                                "input": true
                                            }
                                        ],
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "size": "md",
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Région",
                                                "widget": "choicesjs",
                                                "placeholder": "Choisir une région",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "pays",
                                                "type": "select",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Box disponible",
                                                "widget": "choicesjs",
                                                "placeholder": "Choisir box ",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "boxDisponible",
                                                "type": "select",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Text Field",
                                                "placeholder": "Montant",
                                                "hideLabel": true,
                                                "mask": true,
                                                "tableView": true,
                                                "key": "textField4",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [],
                                        "size": "md",
                                        "width": 5,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 5
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Next",
                                                "showValidations": false,
                                                "tableView": false,
                                                "key": "next",
                                                "type": "button",
                                                "input": true,
                                                "saveOnEnter": false
                                            }
                                        ],
                                        "size": "md",
                                        "width": 1,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 1
                                    }
                                ],
                                "key": "columns1",
                                "type": "columns",
                                "input": false,
                                "tableView": false
                            }
                        ]
                    },
                    {
                        "label": "information personnelle",
                        "key": "informationPersonnelle",
                        "components": [
                            {
                                "label": "Columns",
                                "columns": [
                                    {
                                        "components": [
                                            {
                                                "label": "Type",
                                                "optionsLabelPosition": "right",
                                                "inline": true,
                                                "hideLabel": true,
                                                "tableView": false,
                                                "values": [
                                                    {
                                                        "label": "Personne",
                                                        "value": "personne",
                                                        "shortcut": ""
                                                    },
                                                    {
                                                        "label": "Société",
                                                        "value": "societe",
                                                        "shortcut": ""
                                                    }
                                                ],
                                                "key": "radio",
                                                "type": "radio",
                                                "input": true
                                            }
                                        ],
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "size": "md",
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Nom / Raison sociale ",
                                                "placeholder": "Saisir votre nom",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true,
                                                    "maxLength": 80
                                                },
                                                "key": "textField2",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "width": 3,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "size": "md",
                                        "currentWidth": 3
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Matricule",
                                                "placeholder": "Saisir votre matricule",
                                                "autofocus": true,
                                                "tableView": true,
                                                "validate": {
                                                    "required": true,
                                                    "maxLength": 64
                                                },
                                                "key": "textField1",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 3,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 3
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Date d'abonnement ",
                                                "format": "dd/MM",
                                                "tableView": false,
                                                "datePicker": {
                                                    "disableWeekends": false,
                                                    "disableWeekdays": false
                                                },
                                                "enableTime": false,
                                                "timePicker": {
                                                    "showMeridian": false
                                                },
                                                "defaultDate": "new Date ()",
                                                "validate": {
                                                    "required": true
                                                },
                                                "enableMinDateInput": false,
                                                "enableMaxDateInput": false,
                                                "key": "dateTime",
                                                "type": "datetime",
                                                "input": true,
                                                "widget": {
                                                    "type": "calendar",
                                                    "displayInTimezone": "viewer",
                                                    "locale": "en",
                                                    "useLocaleSettings": false,
                                                    "allowInput": true,
                                                    "mode": "single",
                                                    "enableTime": false,
                                                    "noCalendar": false,
                                                    "format": "dd/MM",
                                                    "hourIncrement": 1,
                                                    "minuteIncrement": 1,
                                                    "time_24hr": true,
                                                    "minDate": null,
                                                    "disableWeekends": false,
                                                    "disableWeekdays": false,
                                                    "maxDate": null
                                                }
                                            }
                                        ],
                                        "size": "md",
                                        "width": 4,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 4
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Nombre d'année",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "nombreDannee",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 2,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 2
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Email",
                                                "placeholder": "email@gmail.com",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true,
                                                    "maxLength": 80
                                                },
                                                "key": "email",
                                                "type": "email",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Téléphone Mobile",
                                                "inputMask": "(+216) 99-999-999",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "telephone1",
                                                "type": "phoneNumber",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Adresse",
                                                "placeholder": "Saisir une adresse",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true,
                                                    "maxLength": 80
                                                },
                                                "key": "adresse",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Complément d'adresse",
                                                "tableView": true,
                                                "validate": {
                                                    "maxLength": 80
                                                },
                                                "key": "textField",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Pays",
                                                "widget": "choicesjs",
                                                "placeholder": "Choisir un pays",
                                                "tableView": true,
                                                "key": "select",
                                                "type": "select",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Ville",
                                                "widget": "choicesjs",
                                                "placeholder": "Choisir une ville",
                                                "tableView": true,
                                                "key": "select1",
                                                "type": "select",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 4,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 4
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Code postal",
                                                "tableView": true,
                                                "validate": {
                                                    "maxLength": 32
                                                },
                                                "key": "textField3",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 2,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 2
                                    },
                                    {
                                        "components": [],
                                        "size": "md",
                                        "width": 6,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 6
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Précedent",
                                                "showValidations": false,
                                                "tableView": false,
                                                "key": "submit",
                                                "type": "button",
                                                "input": true,
                                                "saveOnEnter": false
                                            }
                                        ],
                                        "size": "md",
                                        "width": 2,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 2
                                    },
                                    {
                                        "components": [],
                                        "size": "md",
                                        "width": 9,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 9
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Next",
                                                "showValidations": false,
                                                "tableView": false,
                                                "key": "submit1",
                                                "type": "button",
                                                "input": true,
                                                "saveOnEnter": false
                                            }
                                        ],
                                        "size": "md",
                                        "width": 1,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 1
                                    }
                                ],
                                "key": "columns2",
                                "type": "columns",
                                "input": false,
                                "tableView": false
                            }
                        ]
                    },
                    {
                        "label": "Paiements",
                        "key": "paiements",
                        "components": [
                            {
                                "label": "Columns",
                                "columns": [
                                    {
                                        "components": [
                                            {
                                                "label": "Numéro de la carte ",
                                                "placeholder": "*****************************",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true,
                                                    "minWords": 20
                                                },
                                                "key": "numeroDeLaCarte",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 125,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 125
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Valable jusqu'au",
                                                "format": "dd-MM-yyyy",
                                                "tableView": false,
                                                "datePicker": {
                                                    "disableWeekends": false,
                                                    "disableWeekdays": false
                                                },
                                                "enableTime": false,
                                                "defaultDate": "new Date()",
                                                "validate": {
                                                    "required": true
                                                },
                                                "enableMinDateInput": false,
                                                "enableMaxDateInput": false,
                                                "key": "valableJusquau",
                                                "type": "datetime",
                                                "input": true,
                                                "widget": {
                                                    "type": "calendar",
                                                    "displayInTimezone": "viewer",
                                                    "locale": "en",
                                                    "useLocaleSettings": false,
                                                    "allowInput": true,
                                                    "mode": "single",
                                                    "enableTime": false,
                                                    "noCalendar": false,
                                                    "format": "dd-MM-yyyy",
                                                    "hourIncrement": 1,
                                                    "minuteIncrement": 1,
                                                    "time_24hr": false,
                                                    "minDate": null,
                                                    "disableWeekends": false,
                                                    "disableWeekdays": false,
                                                    "maxDate": null
                                                }
                                            }
                                        ],
                                        "size": "md",
                                        "width": 8,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 8
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "CVV2 / CVC2",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true,
                                                    "maxLength": 3
                                                },
                                                "key": "cvv2Cvc2",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 4,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 4
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "le nom du détenteur",
                                                "tableView": true,
                                                "validate": {
                                                    "required": true
                                                },
                                                "key": "leNomDuDetenteur",
                                                "type": "textfield",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 12,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 12
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Email",
                                                "tableView": true,
                                                "key": "email1",
                                                "type": "email",
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 12,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 12
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Précedent",
                                                "showValidations": false,
                                                "tableView": false,
                                                "key": "precedent",
                                                "type": "button",
                                                "input": true,
                                                "saveOnEnter": false
                                            }
                                        ],
                                        "size": "md",
                                        "width": 2,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 2
                                    },
                                    {
                                        "components": [],
                                        "size": "md",
                                        "width": 9,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 9
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Next",
                                                "showValidations": false,
                                                "tableView": false,
                                                "key": "next1",
                                                "type": "button",
                                                "input": true,
                                                "saveOnEnter": false
                                            }
                                        ],
                                        "size": "md",
                                        "width": 1,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 1
                                    }
                                ],
                                "key": "columns",
                                "type": "columns",
                                "input": false,
                                "tableView": false
                            }
                        ]
                    },
                    {
                        "label": "Confirmation",
                        "key": "confirmation",
                        "components": [
                            {
                                "label": "Columns",
                                "columns": [
                                    {
                                        "components": [
                                            {
                                                "label": "Précedent",
                                                "showValidations": false,
                                                "tableView": false,
                                                "key": "precedent1",
                                                "type": "button",
                                                "input": true,
                                                "saveOnEnter": false
                                            }
                                        ],
                                        "width": 2,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "size": "md",
                                        "currentWidth": 2
                                    },
                                    {
                                        "components": [],
                                        "width": 9,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "size": "md",
                                        "currentWidth": 9
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Confirme",
                                                "showValidations": false,
                                                "theme": "success",
                                                "tableView": false,
                                                "key": "confirme",
                                                "type": "button",
                                                "saveOnEnter": false,
                                                "input": true
                                            }
                                        ],
                                        "size": "md",
                                        "width": 1,
                                        "offset": 0,
                                        "push": 0,
                                        "pull": 0,
                                        "currentWidth": 1
                                    }
                                ],
                                "key": "columns3",
                                "type": "columns",
                                "input": false,
                                "tableView": false
                            }
                        ]
                    }
                ],
                "key": "tabs",
                "type": "tabs",
                "input": false,
                "tableView": false
            }
        ]
    }
    datasource

    //End


    constructor(private fb: FormBuilder,
                private localizationService: LocalizationService,
               ) {

        this.adressForm = this.fb.group({
            phoneNumber: '',

        });
    }

    ngOnInit(): void {
        this.localizationService.setInitialLanguage()
        this.dataGrid = new DataGrid(this.env)
        this.dataGrid.urlData = this.env.apiUrlkernel + "this.ws.getAllSyncFiles" // web service get data source
        this.dataGrid.urlCount = this.env.apiUrlkernel + "this.ws.getCountAllSyncFiles" // ws get count data source
        this.dataGrid.lazy = true // egal true si web service lazy , par defaut true
        this.dataGrid.id = "gridSyncFilesTaches" // id doit etre unique

        this.dataGrid.linkAddButton = "Services/SyncFiles/AddSyncFile"
        this.dataGrid.linkSowButton = "Services/SyncFiles/ShowSyncFile/"
        this.dataGrid.linkEditButton = "Services/SyncFiles/UpdateSyncFile/"
        this.dataGrid.wsButtonDelete = "this.env.WS.deleteSyncFile"
        this.dataGrid.onRowDblClick = function onRowDblClick(e) {
        }.bind(this) // Une fonction qui est exécutée lorsqu'une ligne est double-cliquée ou double-tapée. Exécuté après onCellDblClick .

        this.dataGrid.columns = [
            {
                caption: "captions.id",
                dataType: "number",
                dataField: "id",
                visible: false,
                allowHeaderFiltering: false,
                sortOrder: "desc"
            },
            {
                caption: "#",
                allowExporting: false,
                dataField: "",
                cellTemplate: "cellTemplateIndex",
                allowHeaderFiltering: false,
                width: "26",
                dataType: "number",
                allowResizing: false,
                allowReordering: false
            },
            {
                caption: "aaaa",
                visible: true,
                dataField: "fetchDirectoryPath",
                allowHeaderFiltering: false,
                allowResizing: false,
                allowReordering: false,
                filterOperations: ['contains', '=', 'notcontains', '<>']
            },
            {
                caption: "cccc",
                visible: true,
                dataField: "ftpConnectorId",
                allowHeaderFiltering: false,
                allowResizing: false,
                allowReordering: false,
                filterOperations: ['contains', '=', 'notcontains', '<>'],
            },
            {
                caption: "sssss",
                visible: true,
                dataField: "ftpMode",
                allowHeaderFiltering: false,
                allowResizing: false,
                allowReordering: false,
                filterOperations: ['contains', '=', 'notcontains', '<>'],
            },
        ]
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
    }
    /*Consume adress*/


    /*Consume adress*/
    public adressForm: FormGroup;

    changePhoneNumber() {

        this.adressForm.get("phoneNumber").setValue(this.adressForm.value["phoneNumber"]);


    }
objectData = {
    "className": "biz.picosoft.mailmanager.mm.domain.MmInbound",
    "classId": 14,
    "simpleClassName": "MmInbound",
    "labelClass": "Courrier arrivé",
    "attachements": [
        {
            "id": 2812,
            "absctract": "1\n",
            "anomalieDescription": null,
            "anomalieDate": null,
            "checksum": "9a4e062026b15dd0e2b078c44122dcdd",
            "fileName": "document-copie_hero-copie.pdf",
            "fileType": "application/pdf",
            "locked": false,
            "transferable": true,
            "securiteLevel": 0,
            "docSize": 322852,
            "thumbnail": "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",
            "docCopies": null,
            "docExpirationDate": null,
            "docIssueDate": null,
            "docId": null,
            "issueAdress": null,
            "isReport": false,
            "docTitle": "document",
            "objectId": 105298,
            "classId": 14,
            "filesTypeDTO": {
                "id": 59,
                "type": "application/pdf",
                "icon": "fas fa-file-pdf",
                "label": "pdf",
                "bgColor": "#e82525",
                "textColor": "#faf5f5"
            },
            "responsable": "E_BO",
            "signatureDate": null,
            "sysdateCreated": "2023-01-16T11:36:20Z",
            "sysdateUpdated": "2023-01-16T11:36:20Z",
            "syscreatedBy": "u_bo",
            "sysupdatedBy": "u_bo",
            "requestFileDefinition": {
                "id": 2,
                "name": "doc",
                "label": "document",
                "labelEditable": true,
                "bsIcon": "fas fa-adjust",
                "description": "!!",
                "fileRequired": false,
                "minCopies": 1,
                "maxCopies": 1,
                "hasExpirationDate": "Notapplicable",
                "hasIssueDate": "Notapplicable",
                "hasIssueAdress": "Notapplicable",
                "hasIdRegex": "OPTIONAL",
                "hasCopiesNbr": "Notapplicable",
                "idRegex": "",
                "defaultFile": true,
                "fileOption": null,
                "hasAddButton": true,
                "hasScanButton": true,
                "hasRattachButton": true,
                "hasLockButton": false,
                "hasModelOfficeButton": false
            },
            "signed": false,
            "canUnLock": true,
            "cmisId": "c547f748-b99c-4f48-99ae-e33af60f5895",
            "ocrState": null,
            "ocrDate": null,
            "ocrLang": null,
            "public": false,
            "scanned": null,
            "report": false
        }
    ],
    "events": {
        "events": [
            {
                "evtDate": "2023-01-16T11:07:19Z",
                "eventType": "Initialisation Workflow",
                "eventLabel": null,
                "sendEmail": false,
                "sendNotif": false,
                "fctCall": false,
                "rpCall": true,
                "callRest": false
            }
        ],
        "emailNotif": [],
        "emailOut": [],
        "emailIn": []
    },
    "userActivity": [
        {
            "id": 59358,
            "activitydatetime": "2023-01-16T11:07:25Z",
            "activityName": "lecture",
            "activityType": "READ",
            "cgiRemoteAddress": "192.168.10.134",
            "cgiLocalAddress": "10.212.134.200",
            "activityData": null,
            "samaccountname": "u_bo",
            "mail": "abdelaziz.gharrech@esprit.tn",
            "displayname": "U_BO",
            "distinguishedname": "U_BO",
            "employeetype": null,
            "employeeid": "E_BO",
            "classId": 14,
            "objectId": 105298
        },
        {
            "id": 59362,
            "activitydatetime": "2023-01-16T11:33:38Z",
            "activityName": "lecture",
            "activityType": "READ",
            "cgiRemoteAddress": "192.168.10.134",
            "cgiLocalAddress": "10.212.134.200",
            "activityData": null,
            "samaccountname": "u_bo",
            "mail": "abdelaziz.gharrech@esprit.tn",
            "displayname": "U_BO",
            "distinguishedname": "U_BO",
            "employeetype": null,
            "employeeid": "E_BO",
            "classId": 14,
            "objectId": 105298
        }
    ],
    "userPermission": "WRITE",
    "currentState": {
        "label": "Brouillon",
        "color": "#f7ec11"
    },
    "formSource": "{\"components\":[{\"label\":\"commentaire\",\"tableView\":true,\"key\":\"textField\",\"type\":\"textfield\",\"input\":true}]}",
    "workflow": {
        "historicWF": [],
        "decisionsWF": [
            "Dispatch",
            "Classer",
            "Pour Traitement"
        ],
        "activityAuthor": [
            "E_BO",
            "CanCreateInbound"
        ],
        "activityReader": [],
        "processAuthor": [],
        "processReader": [],
        "activityName": "Saisie",
        "assignee": "E_BO",
        "activitystartDate": "2023-01-16T11:07:18Z",
        "processStartDate": "2023-01-16T11:07:18Z",
        "processEndDate": null,
        "wfProcessID": "f14a77a3-958d-11ed-bb36-525400472242"
    },
    "remaingRequestFileDefinitions": [
        {
            "id": 2,
            "name": "doc",
            "label": "document",
            "labelEditable": true,
            "bsIcon": "fas fa-adjust",
            "description": "!!",
            "fileRequired": false,
            "minCopies": 1,
            "maxCopies": 1,
            "hasExpirationDate": "Notapplicable",
            "hasIssueDate": "Notapplicable",
            "hasIssueAdress": "Notapplicable",
            "hasIdRegex": "OPTIONAL",
            "idRegex": "",
            "defaultFile": true,
            "issueAdressIsRequired": false,
            "idRegexIsRequired": false,
            "hasAddButton": true,
            "hasScanButton": true,
            "hasRattachButton": true,
            "hasLockButton": false,
            "hasModelOfficeButton": false
        }
    ],
    "security": {
        "level": 0,
        "readers": [
            "InboundReader"
        ],
        "authors": [
            "CanCreateInbound",
            "E_BO"
        ],
        "tempreaders": []
    },
    "components": [
        {
            "name": "TachesComponent",
            "mode": "WRITE"
        },
        {
            "name": "AttachmentComponent",
            "mode": "WRITE"
        },
        {
            "name": "FormeoComponent",
            "mode": "WRITE"
        },
        {
            "name": "AdresseInterneComponent",
            "mode": "WRITE"
        },
        {
            "name": "ComposantGeneralComponent",
            "mode": "WRITE"
        },
        {
            "name": "TagsEditorComponent",
            "mode": "WRITE"
        },
        {
            "name": "SujetCourrierArriverComponent",
            "mode": "WRITE"
        },
        {
            "name": "ContentCourrierArriveComponent",
            "mode": "WRITE"
        },
        {
            "name": "ClassementFormComponent",
            "mode": "WRITE"
        },
        {
            "name": "TacheResponsableComponent",
            "mode": "WRITE"
        },
        {
            "name": "AdresseExterneComponent",
            "mode": "WRITE"
        }
    ],
    "officeTemplateFileName": "BUSS",
    "emailTemplateFileName": "Envoi Courrier par Email",
    "readFormNameFM": null,
    "editFormNameFM": null,
    "readFormName": null,
    "editFormName": null,
    "id": 105298,
    "subject": "",
    "docDatetime": null,
    "arrivedDatetime": null,
    "reference": null,
    "autoGenerated": null,
    "extReference": null,
    "labelZpl": null,
    "typeDoc": null,
    "dateCreated": "2023-01-16T11:07:18Z",
    "rpDechage": null,
    "source": null,
    "destination": null,
    "orginalReference": null,
    "tags": [],
    "natureDocument": [],
    "mmTaskDTOList": [],
    "important": false,
    "securiteLevel": 0,
    "site": null,
    "classificationPath": null,
    "body": null,
    "other": null,
    "assignee": "E_BO",
    "dueDate": null,
    "fileAccessToken": "4515941564220616718947523885256509939648231444467018028411781241853134677268870222226079955928744896554928844106390891001700416505907132801291877518290993",
    "optionalTemplateFileName": "doc",
    "mandatoryTemplateFileName": "",
    "defaultTemplateFileName": [
        "doc"
    ]
}
    //appel get by id
    getbyID(){
        console.log("get by id")
    }


  // ------detecte changes in composant ----------------------
  ngOnChanges() {
  }



}
