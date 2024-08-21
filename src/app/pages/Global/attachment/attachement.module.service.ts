import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {EnvService} from 'src/env.service';
import {TokenStorageService} from '../shared-service/token-storage.service';
import {CookieService} from 'ngx-cookie-service';


@Injectable({
    providedIn: 'root'
})
export class AttachementModuleService {
    private headers: HttpHeaders;

    constructor(private env: EnvService, private httpClient: HttpClient, private tokenStorage: TokenStorageService, private cookieService: CookieService) {
        this.headers = new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)

    }


    extractfileByUIID(uuid, fileAccessToken): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "extractAttachment/" +  "?uuid="+ uuid + "&fileAccessToken=" + fileAccessToken, {
            headers: this.headers,
            responseType: 'arraybuffer' as 'json',
            observe: 'response', // simply add this option
        });
    }

    /*-------------------------------------------------------------------------- KERNEL ------------------------------------------------------------------*/
    /********************** getTokenE  **************************/
    getToken(module): Promise<any> {
        return new Promise((resolve, reject) => {
                this.httpClient.get(`${this.env.apiUrlkernel}` + 'get-token/' + module, {
                    observe: 'response' as 'response',
                    withCredentials: true,
                    headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())
                        .append("application", require('package.json').name).append("Cache-Control", 'Pragma').append('Pragma', 'no-cache')
                }).toPromise().then(
                    async (res: any) => {
                        const setCookieHeader = await res.headers.get('Cookie')
                        // const setCookieHeader = await res.headers.get('Set-Cookie')
                        let coockieVarSplited = setCookieHeader.split(';')
                        let token = coockieVarSplited[0].split('=')[1]
                        let maxAge = coockieVarSplited[3].split('=')[1]

                        const expirationDate = new Date();
                        expirationDate.setTime(expirationDate.getTime() + (maxAge * 1000));

                        this.cookieService.set(module, token, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                        resolve({res, setCookieHeader});
                    }, error => {
                        // let maxAge = 3600
                        //
                        // const expirationDate = new Date();
                        // expirationDate.setTime(expirationDate.getTime() + (maxAge * 1000));
                        // this.cookieService.set(module, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                        reject(error)
                    }
                )
            }
        )
    }

    /********************** createAttachement   **************************/
    createAttachement(obj, fileAccessToken) {
        return this.httpClient.post(`${this.env.apiUrlkernel}` + 'createAttachement' + "&fileAccessToken=" + fileAccessToken, obj, {
                headers: this.headers,
            }
        )
    }

    /*ClonedDocXToPdf*/
    ClonedDocXToPdf(id, obj, fileAccessToken): Observable<any> {
        return this.httpClient.put(`${this.env.apiUrlkernel}` + "AttachmentClonageDocxToPDF/" + id + "?fileAccessToken=" + fileAccessToken, obj, {
            headers: this.headers,
        });
    }

    /********************* Extract ***************************/

    /*OutPut blob*/

    extractfileById(id, fileAccessToken): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "extractAttachment/" + id + "?fileAccessToken=" + fileAccessToken, {
            headers: this.headers,
            responseType: 'blob',
            observe: 'response', // simply add this option
        });
    }

    /*OutPut Json*/
    extractfileByIdJson(id, fileAccessToken): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "extractAttachment/" + id + "?fileAccessToken=" + fileAccessToken, {
            headers: this.headers,
            responseType: 'arraybuffer' as 'json',
        });
    }

    /********************* pdfgetDefaultInfo  ***************************/
    pdfgetDefaultInfo(obj): Observable<any> {
        return this.httpClient.post(`${this.env.apiUrlkernel}` + "pdfgetDefaultInfo", obj, {
            headers: this.headers,
        });
    }

    /********************* IsSigned  ***************************/
    IsSigned(data): Observable<any> {
        return this.httpClient.post(`${this.env.apiUrlkernel}` + "IsSigned", data, {
            headers: this.headers,
        });
    }

    // getMargeLevelFile(levelMin, levelMax): Observable<any> {
    //     return this.httpClient.get(`${this.env.apiUrlkernel}` + "securite-List-levels?levelMin=" + levelMin + "&levelMax=" + levelMax, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)});
    // }

    getAllSL(): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "securite-levels", {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)});
    }

    getFileById(id): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "attachements/" + id, {headers: this.headers});
    }

    getscan_preferences(): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "scan-preferences", {headers: this.headers});
    }

    getscan_preferencesByName(ScanPrefrenceName): Observable<any> {
        return this.httpClient.get(`${this.env.apiUrlkernel}` + "scan-preferencesByname?name=" + ScanPrefrenceName, {headers: this.headers});
    }

    getfilesByClassIdAndObjectId(classid, objectid, fileAccessToken): Observable<any> {
        let param = new HttpParams();
        param.append("classId", classid);
        param.append("objectId", objectid);
        param.append("fileAccessToken", fileAccessToken);

        return this.httpClient.get(`${this.env.apiUrlkernel}` + "AttachmentsByClassIdAndObjectId?classId=" + classid + "&objectId=" + objectid + "&fileAccessToken=" + fileAccessToken, {
            headers: this.headers
        });
    }


    editfile(filedto): Observable<any> {
        return this.httpClient.patch(`${this.env.apiUrlkernel}` + "attachements/" + filedto.id, filedto, {
            headers: this.headers
        });
    }

    downloadtous(postattachmentDto, fileAccessToken): Observable<any> {
        return this.httpClient.post(`${this.env.apiUrlkernel}` + "zipAttachments?fileAccessToken=" + fileAccessToken, postattachmentDto, {
            headers: this.headers,
            responseType: 'blob',
            observe: 'response', // simply add this option
        });
    }


    findOfficeTemplate(data): Promise<any> {
        return new Promise(
            ((resolve, reject) => {
                    this.httpClient.post(this.env.apiUrlkernel + 'findOfficeTemplate', data,
                        {
                            observe: 'body',
                            headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).set("application", require('package.json').name)
                        }
                    ).toPromise()
                        .then(
                            res => { // Success
                                resolve(res);
                            },
                            error => { // Error
                                reject(error);
                            }
                        );
                }
            )
        );
    }

    officeTemplateAttach(title, classid, objectid, data) {
        return this.httpClient.post(this.env.apiUrlkernel + 'office-template-attach?title=' + title + '&classId=' + classid + '&objectId=' + objectid, data,
            {
                responseType: 'blob',
                observe: 'response',
                headers: this.headers
            }
        )
    }

    /*-------------------------------------------------------------------------- KERNEL ------------------------------------------------------------------*/


    /*-------------------------------------------------------------------------- PSTK ------------------------------------------------------------------*/
    /*################################################################ Module Scan #################################################################################*/

    //  WS to Scan
    Scanner(authorizationToken, functionName, selectedScannerName, SetIndicators, SetHideUI,
            fileType, EnableDuplex, SetResolutionInt, SetPixelType,
            SetBitDepth, SetPaperSize, SetBlankPageMode, pathfileName,
            CompressionMode, SetBlankPageThreshold, title, enableOcr): Promise<any> {
        console.warn(`functionName:${functionName},SetIndicators: ${SetIndicators},SetHideUI: ${SetHideUI},fileType: ${fileType} , EnableDuplex: ${EnableDuplex} , 
        SetPixelType: ${SetPixelType} ,SetBitDepth: ${SetBitDepth} ,SetResolutionInt: ${SetResolutionInt} ,SetPaperSize: ${SetPaperSize},SetBlankPageMode: ${SetBlankPageMode}
        ,CompressionMode: ${CompressionMode},SetBlankPageThreshold: ${SetBlankPageThreshold},enableOcr: ${enableOcr}`);

        // let in =1 ;
        let i = 0;
        return new Promise(
            ((resolve, reject) => {
                let headers = new HttpHeaders();
                let option
                if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
                    headers = headers.set('authorizationToken', authorizationToken)
                    option = {observe: 'body', headers: headers}
                } else {
                    option = {observe: 'body'}
                }
                let defaultPort
                if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '' && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
                    defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
                else
                    defaultPort = this.env.pstkport
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/scan', {
                        'functionName': functionName,
                        'selectedScannerName': selectedScannerName,
                        'SetPixelType': SetPixelType,
                        'SetIndicators': SetIndicators,
                        'SetHideUI': SetHideUI,
                        'fileType': fileType,
                        'EnableDuplex': EnableDuplex,
                        'SetBitDepth': SetBitDepth,
                        'SetResolutionInt': SetResolutionInt,
                        'SetPaperSize': SetPaperSize,
                        'SetBlankPageMode': SetBlankPageMode,
                        'SetBlankPageThreshold': SetBlankPageThreshold,
                        'pathfileName': pathfileName,
                        'title': title,
                        'SetAutoOCR': enableOcr
                    },
                    option
                ).toPromise()
                    .then(
                        res => { // Success
                            resolve(res);
                        },
                        error => { // Error
                            reject(error);
                        }
                    );
            })
        );
    }

    //  WS to Get List Scanner
    GetListScanner(authorizationToken, functionName): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/scan',
            {'functionName': functionName}, option);
    }

    /**
     * {@code POST  https://127.0.0.1:7777/pdfScanAfter} : scan pdf after predifnie position.
     * have same input that Scanner
     * @param base64FileScanned = file scanned when user press OK in the dialog panel (filed of type Base64).
     * @param pageIndex = position to scan after (filed of type number).
     * @param base64_Existant_Scanned = file existant that will append scanned new file (filed of type Base64).
     *
     * @return the Response with status {@code 200 (OK),@result{
     *     @base64Output,@scannedPgNbr
     * }} case the situation.
     */

    scanafter(authorizationToken, index, base64, base64FileScanned, functionName, selectedScannerName, SetIndicators, SetHideUI, fileType, EnableDuplex, SetResolutionInt, SetPixelType, SetBitDepth, SetPaperSize, blankpagemode, blankpagethreshold): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {headers: headers}
        } else {
            option = {}
        }
        // let in =1 ;
        if (EnableDuplex) {
            EnableDuplex = 1;
        } else {
            EnableDuplex = 0
        }
        if (blankpagemode) {
            blankpagemode = 1;

        } else {
            blankpagemode = 0
        }
        let PaperSize;

        if (SetPaperSize != null) {
            PaperSize = SetPaperSize.label;
        }
        console.warn(`functionName:${functionName},SetIndicators: ${SetIndicators},SetHideUI: ${SetHideUI},fileType: ${fileType} , EnableDuplex: ${EnableDuplex} , 
        SetPixelType: ${SetPixelType} ,SetBitDepth: ${SetBitDepth} ,SetResolutionInt: ${SetResolutionInt} ,SetPaperSize: ${SetPaperSize},SetBlankPageMode: ${blankpagemode}
        ,CompressionMode: '',SetBlankPageThreshold: ${blankpagethreshold}`);

        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport

        return this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/pdfScanAfter', {
            'base64_Existant_Scanned': base64,
            'base64FileScanned': '',
            'pageIndex': index,
            'functionName': functionName,
            'SetIndicators': SetIndicators,
            'SetHideUI': SetHideUI,
            'fileType': fileType,
            'EnableDuplex': EnableDuplex,
            'SetResolutionInt': SetResolutionInt,
            'SetPixelType': SetPixelType,
            'SetBitDepth': SetBitDepth,
            'SetPaperSize': PaperSize,
            'selectedScannerName': selectedScannerName,
            'blankpagethreshold': blankpagethreshold,
            'SetBlankPageMode': blankpagemode,
        }, option)
    }

    /**
     * {@code POST  https://127.0.0.1:7777/pdfInfo/getpdfInfo} : .
     * have same input that Scanner
     * @param base64 = file  (filed of type Base64).
     *
     * @return the Response with status {@code 200 (OK),@base64(contains propriete of autors, subject, keyword, title ..)} case the situation.
     */
    getpdfinfo(authorizationToken, base64): Observable<any> {
        let headers = new HttpHeaders();
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {})
            headers = headers.set('authorizationToken', authorizationToken)
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport

        return this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/pdfInfo/getpdfInfo', {
            'base64': base64,
        }, {
            headers: headers
        })
    }

    /**
     * {@code POST  https://127.0.0.1:7777/pdfRemovePageo} : delete pdf after predifnie position.
     * have same input that Scanner
     * @param base64 = file  (filed of type Base64).
     * @param pageIndex = position to scan after (filed of type number).
     *
     * @return the Response with status {@code 200 (OK),@result{
     *     @base64Output
     * }} case the situation.
     */
    deletepagebyindex(authorizationToken, index, base64): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {headers: headers}
        } else {
            option = {}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/pdfRemovePage', {
            'base64': base64,
            'pageIndex': index - 1
        }, option)
    }

    getpageNbre(authorizationToken, base64): Promise<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return new Promise((resolve, reject) => {
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/pdfInfo/getpdfPg', {'base64': base64,}, option).toPromise().then(
                    res => {
                        resolve(res);
                    }, error => {
                        reject(error)
                    }
                )
            }
        )
    }

    /*################################################################ Module Scan #################################################################################*/


    /*################################################################ Module Sign #################################################################################*/

    /*sign-pdf-with-token-license-verify*/
    signedPdfWithTokenLicenseVerify(authorizationToken, file, fileInputType, certif, pin, typeSign, privateKey): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("fileInputType", fileInputType);
        formData.append("certif", certif);
        formData.append("pin", pin);
        formData.append("typeSign", typeSign);
        formData.append("privateKey", privateKey);
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/sign-pdf-with-token-license-verify', formData, option);
    }

    /*################################################################ Module Sign #################################################################################*/


    /*################################################################ Module Misc #################################################################################*/
    scriptsList(authorizationToken): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return this.httpClient.get(this.env.pstoolkitURLhttps + defaultPort + '/scripts-list', option);
    }

    ZPLPrinter(authorizationToken, obj): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + '/zplPrinter', obj, option);
    }

    /*################################################################ Module Misc #################################################################################*/


    /*################################################################ Module office #################################################################################*/

    docXToPdf(authorizationToken, filename, transactionid, base64Content): Promise<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return new Promise((resolve, reject) => {
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + "/docxToPdf", {
                        'filename': filename,
                        'base64Content': base64Content,
                        'transactionid': transactionid
                    }, option
                ).toPromise().then(
                    res => {
                        resolve(res);
                    }, error => {
                        reject(error)
                    }
                )
            }
        )
    }


    openFileForEdit(authorizationToken, filename, transactionid, base64Content): Promise<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return new Promise((resolve, reject) => {
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + "/EditFile/openFileForEdit", {
                        'filename': filename,
                        'base64Content': base64Content,
                        'transactionid': transactionid
                    }, option
                ).toPromise().then(
                    res => {
                        resolve(res);
                    }, error => {
                        reject(error)
                    }
                )
            }
        )
    }

    SaveFileAfterEdit(authorizationToken, filename, transactionid, enableDelete): Promise<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return new Promise((resolve, reject) => {
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + "/EditFile/SaveFileAfterEdit",
                    {
                        'filename': filename,
                        'transactionid': transactionid,
                        'enableDelete': enableDelete
                    }, option
                ).toPromise().then(
                    res => {
                        resolve(res);
                    }, error => {
                        reject(error)
                    }
                )
            }
        )
    }

    checkIfFileExist(authorizationToken, filename, transactionid): Promise<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return new Promise((resolve, reject) => {
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + "/EditFile/checkIfFileExist",
                    {
                        'filename': filename,
                        'transactionid': transactionid
                    }, option
                ).toPromise().then(
                    res => {
                        resolve(res);
                    }, error => {
                        reject(error)
                    }
                )
            }
        )
    }

    checkIfFileBusy(authorizationToken, filename, transactionid, base64Content): Promise<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '')
            defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return new Promise((resolve, reject) => {
                this.httpClient.post(this.env.pstoolkitURLhttps + defaultPort + "/EditFile/checkIfFileBusy",
                    {
                        'filename': filename,
                        'transactionid': transactionid,
                        'base64Content': base64Content
                    }, option
                ).toPromise().then(
                    res => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    }
                )
            }
        )
    }

    /*################################################################ Module office #################################################################################*/

    /*################################################################ check if pstk is Running  #################################################################################*/
    checkPSTK(port, authorizationtokenMisc, authorizationtokenScan, authorizationtokenSign, authorizationtokenOffice): Observable<any> {
        let headers = new HttpHeaders();
        let option;
        if (authorizationtokenMisc && authorizationtokenMisc != null && authorizationtokenMisc != undefined && authorizationtokenMisc != {}) {
            headers = headers.set('authorizationtokenmisc', authorizationtokenMisc);
            option = {observe: 'body', headers: headers};
        }
        if (authorizationtokenScan && authorizationtokenScan != null && authorizationtokenScan != undefined && authorizationtokenScan != {}) {
            headers = headers.set('authorizationtokenscan', authorizationtokenScan);
            option = {observe: 'body', headers: headers};
        }
        if (authorizationtokenSign && authorizationtokenSign != null && authorizationtokenSign != undefined && authorizationtokenSign != {}) {
            headers = headers.set('authorizationtokensign', authorizationtokenSign);
            option = {observe: 'body', headers: headers};
        }
        if (authorizationtokenOffice && authorizationtokenOffice != null && authorizationtokenOffice != undefined && authorizationtokenOffice != {}) {
            headers = headers.set('authorizationtokenoffice', authorizationtokenOffice);
            option = {observe: 'body', headers: headers};
        }
        return this.httpClient.get(this.env.pstoolkitURLhttps + port + '/checkPSTK', option);
    }

    /*################################################################ check if pstk is Running  #################################################################################*/

    /*-------------------------------------------------------------------------- PSTK ------------------------------------------------------------------*/

    /*################################################################ Module Misc #################################################################################*/


    getVariables(variableName): Observable<any> {
        return this.httpClient.get(this.env.apiUrlkernel + 'variables-by-name?variableName=' + variableName, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())});
    }


    viewerURL(nodeId, FileName, versionfile = "1.0"): any {
        let ws = "viewerURL"
        // let ws = "viewerURLwithoutrendition"

        console.log("in ws :::>", FileName)


        return this.httpClient.get(`${this.env.apiUrlMetiers}` + ws + '?nodeRefFile=' + nodeId + '&FileName=' + FileName + '&versionfile=' + versionfile,
            {
                responseType: "text", headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())
            }
        );


    }

    getRequestFileDefinitions(className) {
        let params =new HttpParams().set('className',className).set('objectId',1)
        return this.httpClient.get(this.env.apiUrlkernel + "acl-class-fileDefinition", {params , headers: new HttpHeaders().append("Authorization", this.cookieService.get("token")).append("application", require('package.json').name)});
    }
    VerifPcTk(authorizationToken): Observable<any> {
        let headers = new HttpHeaders();
        let option
        if (authorizationToken && authorizationToken != null && authorizationToken != undefined && authorizationToken != {}) {
            headers = headers.set('authorizationToken', authorizationToken)
            option = {observe: 'body', headers: headers}
        } else {
            option = {observe: 'body'}
        }
        let defaultPort
        if (localStorage.getItem('PstkPort') != null)
            defaultPort = JSON.parse(localStorage.getItem('PstkPort'));
        else
            defaultPort = this.env.pstkport
        return this.httpClient.get(this.env.pstoolkitURLhttps + defaultPort + '/scripts-list', option);
    }

}
