import {WsService} from "./ws.service";
import {EnvService} from './env.service';


export const WsServiceFactory = () => {
    const ws = new WsService();
    const browserWindow = window || {};
    const browserWindowWs = browserWindow['__ws'] || {};

    for (const key in browserWindowWs) {
        if (browserWindowWs.hasOwnProperty(key)) {
            ws[key] = window['__ws'][key];
        }
    }

    return ws;
};

export const WsServiceProvider = {
    provide: WsService,
    useFactory: WsServiceFactory,
    deps: [],
};
