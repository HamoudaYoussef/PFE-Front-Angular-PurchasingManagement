import {NgForm} from '@angular/forms'
// import * as moment from 'moment';
import * as moment from 'moment/moment'
import {EnvService} from 'src/env.service';


export class FormatDate {

    constructor(private env: EnvService) {
    }


    dateF: any
    testT: boolean = false;
    test: any

    formatDate(date: any, format: any) {

        switch (format) {
            case ('D'): {
                this.formatDF(date);
                break;
            }case ('Dshort'): {
                this.formatDshort(date);
                break;
            }
            case "DS":
                this.formatDFshort(date);
                break;
            case "DFT":
                this.formatDFT(date);
                break;
            case "DFSHORTT":
                this.formatDFTshort(date);
                break;
            case "T":
                this.formatT(date);
                break;
            default:
                this.formatDFT(date);
                break;
        }


    }
    formatT(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)

        this.dateF = this.dateF.format(this.env.T)

        this.testT = true
        return (this.dateF);

    }
//29/11/2021
    formatDFT(formdat: NgForm) {
        let str: any

        str = formdat;

        this.dateF = moment(str)

        this.dateF = this.dateF.format(this.env.DFT)

        this.testT = true
        return (this.dateF);

    }

    formatDF(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)

        this.dateF = this.dateF.format(this.env.D)

        this.testT = true
        return (this.dateF);

    }

//29/11 ou bien 01/01/2020
    formatDFshort(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)
        if (new Date(str).getFullYear() == new Date().getFullYear()) {
            this.dateF = this.dateF.format(this.env.DS)

            this.testT = true
            return (this.dateF);
        } else {
            this.dateF = this.dateF.format(this.env.D)

            this.testT = true
            return (this.dateF);
        }

    }
    formatDshort(formdat: NgForm) {
        let str: any

        str = formdat;

        this.dateF = moment(str)

        this.dateF = this.dateF.format(this.env.Dshort)

        this.testT = true
        return (this.dateF);

    }

    formatDFTshort(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)
        if (new Date(str).getFullYear() == new Date().getFullYear()) {
            this.dateF = this.dateF.format(this.env.DFSHORTT)

            this.testT = true
            return (this.dateF);
        } else {
            this.dateF = this.dateF.format(this.env.DFT)

            this.testT = true
            return (this.dateF);
        }

    }
    formatDFTshortSS(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)
        if (new Date(str).getFullYear() == new Date().getFullYear()) {
            this.dateF = this.dateF.format(this.env.DFSHORTTSS)

            this.testT = true
            return (this.dateF);
        } else {
            this.dateF = this.dateF.format(this.env.DFT)

            this.testT = true
            return (this.dateF);
        }

    }

    formatDTshort(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)

            this.dateF = this.dateF.format(this.env.DFT)

            this.testT = true
            return (this.dateF);


    }

    secondeToHour(formdat: NgForm) {
        let str: any
        let dateF

        str = formdat;

        dateF = moment.utc(moment.duration(str, "seconds").asMilliseconds()).format("HH:mm");
        return (dateF);
    }


    localnumber(numbre: NgForm) {

        let nombre: any;
        nombre = numbre;
        this.test = new Intl.NumberFormat().format(nombre);
        return (this.test);
    }

    DinarNumber(numbre: NgForm) {

        let nombre: any;
        nombre = numbre;

        this.test = new Intl.NumberFormat(this.env.formatdefault, {
            style: "currency",
            currency: this.env.LCF
        }).format(nombre);
        return (this.test);

    }

    DinarNumber1(numbre: number) {

        let nombre: any;
        nombre = numbre;

        this.test = new Intl.NumberFormat(this.env.formatdefault, {
            style: "currency",
            currency: this.env.LCF
        }).format(nombre);
        return (this.test);

    }

    EuroNumber(numbre: NgForm) {
        let nombre: any;
        nombre = numbre;


        this.test = new Intl.NumberFormat(this.env.formatdefault, {
            style: "currency",
            currency: this.env.LCEur
        }).format(nombre);
        return (this.test);

    }

    KmNumber(numbre: NgForm) {
        let nombre: any;
        nombre = numbre;
        let testing = "style: 'unit', unit: 'kilometer'"


        const formatConfig = {
            style: "unit",
            unit: this.env.kilometer,
            unitDisplay: 'short',
        };
        this.test = new Intl.NumberFormat('default', formatConfig).format(nombre);
        return (this.test);
    }

    dollarNumber(numbre: NgForm) {
        let nombre: any;
        nombre = numbre;


        this.test = new Intl.NumberFormat(this.env.formatdefault, {
            style: 'currency',
            currency: this.env.LCUsd
        }).format(nombre);
        return (this.test);
    }

    FractionNumber0(numbre: NgForm) {
        let nombre: any;
        nombre = numbre;
        this.test = new Intl.NumberFormat(this.env.L0, {maximumFractionDigits: this.env.L0num}).format(nombre)
        return (this.test);
    }

    FractionNumber2(numbre: NgForm) {
        let nombre: any;
        nombre = numbre;
        this.test = new Intl.NumberFormat(this.env.L0, {maximumFractionDigits: this.env.L2num}).format(nombre)
        return (this.test);
    }

    FractionNumber3(numbre: NgForm) {
        let nombre: any;
        nombre = numbre;
        this.test = new Intl.NumberFormat(this.env.L0, {maximumFractionDigits: this.env.L1num}).format(nombre)
        return (this.test);
    }


    formatNumber(number: any, format: any) {

        switch (format) {
            case "L0":
                this.FractionNumber0(number);
                break;
            case "L1":
                this.FractionNumber3(number);
                break;
            case "L2":
                this.FractionNumber2(number);
                break;
            case "LCF":
                this.DinarNumber(number);
                break;
            case "LCEur":
                this.EuroNumber(number);
                break;
            case "LCUsd":
                this.dollarNumber(number);
                break;
            default:
                this.DinarNumber(number);
                break;
        }


    }
    formatDFshortNEW(formdat: NgForm) {
        let str: any
        str = formdat;
        this.dateF = moment(str)
        if (new Date(str).getFullYear() == new Date().getFullYear()) {
            this.dateF = this.dateF.format(this.env.DS)
            this.testT = true
            return 'dd/MM';
        } else {
            this.dateF = this.dateF.format(this.env.D)
            this.testT = true
            return 'dd/MM/yy';
        }
    }
}


