import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
  production: true ,
  logLevel: NgxLoggerLevel.TRACE ,
  serverLogLevel: NgxLoggerLevel.OFF ,
  appVersion: require('../../package.json').version,
  buildTimestamp: new Date()
};
