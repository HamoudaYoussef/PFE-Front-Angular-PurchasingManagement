export type MethodRequest = 'POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH' | 'post' | 'put' | 'delete' | 'get' | 'patch'

export class ResultWs {
    statut: boolean;
    data: any;
}

export class ParamsMethode {
    constructor(attribut: string, value: any) {
        this._attribut = attribut;
        this._value = value;
    }

    private _attribut: string;

    get attribut(): string {
        return this._attribut;
    }

    set attribut(value: string) {
        this._attribut = value;
    }

    private _value: any;

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }
}

export class HttpParam {


    constructor(method: MethodRequest, url: string, id: any, body: any, params, returnError?) {
        this._method = method;
        this._url = url;
        this._id = id;
        this._body = body;
        this._params = params;
        if (returnError != null && returnError != undefined) {
            this._returnError = returnError;
        }
    }

    private _method: MethodRequest;

    get method(): MethodRequest {
        return this._method;
    }

    set method(value: MethodRequest) {
        this._method = value;
    }

    private _url: string;

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    private _id: any;

    get id(): any {
        return this._id;
    }

    set id(value: any) {
        this._id = value;
    }

    private _body: any;

    get body(): any {
        return this._body;
    }

    set body(value: any) {
        this._body = value;
    }

    private _params: [];

    get params(): [] {
        return this._params;
    }

    set params(value: []) {
        this._params = value;
    }

    private _returnError: boolean = false;

    get returnError(): boolean {
        return this._returnError;
    }

    set returnError(value: boolean) {
        this._returnError = value;
    }
}

export class HttpParamMethodGet extends HttpParam {
    constructor(url: string, id: any, body: any, params, returnError?) {
        super('get', url, id, body, params, returnError);
    }
}

export class HttpParamMethodPost extends HttpParam {
    constructor(url: string, body: any, returnError?) {
        super('post', url, '', body, [], returnError);
    }
}

export class HttpParamMethodPut extends HttpParam {
    constructor(url: string, body: any, returnError?) {
        super('put', url, body.id, body, [], returnError);
    }
}

export class HttpParamMethodPutNEwFormat extends HttpParam {
    constructor(url: string, body: any, returnError?) {
        super('put', url, '', body, [], returnError);
    }
}

export class HttpParamMethodDelete extends HttpParam {
    constructor(url: string, id: any, returnError?) {
        super('delete', url, id, null, [], returnError);
    }
}

export class HttpParamMethodPatch extends HttpParam {
    constructor(url: string, body: any, returnError?) {
        super('patch', url, '', body, [], returnError);
    }
}

export class HttpParamMethodGetById extends HttpParam {
    constructor(url: string, id: any, returnError?) {
        super('get', url, id, null, [], returnError)
    }
}
export class Paging{

  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;

}
