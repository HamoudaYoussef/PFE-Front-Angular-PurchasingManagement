import {jsPDF} from 'jspdf';
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter';
import {exportDataGrid} from 'devextreme/excel_exporter';
import saveAs from 'file-saver';
import {CookieService} from "ngx-cookie-service";


export class Export {
    static lengthDataGrid1: number;
    cookieService :CookieService;

    constructor() {
    }

    static exportGridToPDF(dataGrid) {
        const doc = new jsPDF();
        exportDataGridToPdf({

            jsPDFDocument: doc,
            component: dataGrid,

        }).then(() => {
            let current_datetime = new Date()
            let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
            doc.save(dataGrid['_$element'][0].id +"_"+ formatted_date + '.pdf');
        })
    }

//     public lengthDataGrid1 = 0
  static  getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    static exportGridToExcel(e, name, le, par) {

        const excel = require("exceljs");
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet();


        exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            topLeftCell: { row: 4, column: 1 }
        }).then((cellRange) => {
            // header
            const headerRow = worksheet.getRow(2);
            headerRow.height = 30;
            worksheet.mergeCells(2, 6, 2, 10);
            headerRow.getCell(1).value =name
            headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
            headerRow.getCell(1).alignment = { horizontal: 'left' };
            let ch=""
            let current_datetime = new Date()
            let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
            ch=ch+le +"  "+ formatted_date
            this.getCookie('displayname')

            let  dispname =  decodeURI(this.getCookie('displayname'));

            if ((dispname=== undefined) || (dispname=== null))
               dispname=" ";

            headerRow.getCell(8).value = ch +" "+par +"  "+dispname
            headerRow.getCell(8).font = { name: 'Arial', size: 12 };
            headerRow.getCell(8).alignment = { horizontal: 'right' };

            // footer
            const footerRowIndex = cellRange.to.row + 2
            const footerRow = worksheet.getRow(footerRowIndex);
            worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);

            footerRow.getCell(1).value = window.location.protocol + "//" + window.location.hostname +":"+ window.location.port;
            footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
            footerRow.getCell(1).alignment = { horizontal: 'right' };
            console.log("last line *************")
        }).then(() => {
            // https://github.com/exceljs/exceljs#writing-xlsx


            workbook.xlsx.writeBuffer().then((buffer) => {


                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), name+'.xlsx');

            });
        });
        e.cancel = true;
    }

//
//
//     static setAlternatingRowsBackground(gridCell, excelCell) {
//         if (gridCell.rowType === 'header' || gridCell.rowType === 'data') {
//             if (excelCell.fullAddress.row % 2 === 0) {
//                 excelCell.fill = {
//                     type: 'pattern',
//                     pattern: 'solid',
//                     fgColor: {argb: 'D3D3D3'},
//                     bgColor: {argb: 'D3D3D3'}
//                 };
//             }
//         }
//     }
}
