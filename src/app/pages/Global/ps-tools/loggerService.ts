import {NGXLogger, NgxLoggerLevel} from "ngx-logger";
import {Injectable} from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export  class LoggerService {

    constructor(private logger: NGXLogger) {
    }
    getMessageTrace(paramsHttp)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
        return message
    }
    getMessageDebug(paramsHttp)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
        return message
    }
    getMessageInfo(paramsHttp)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
        return message
    }
    getMessageLog(paramsHttp)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
        return message
    }
    getMessageWarn(paramsHttp)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
      return message
    }
    getMessageError(paramsHttp,error)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
      return message=""
    }
    getMessageFatal(paramsHttp,error)
    {
        let message
        switch (paramsHttp.method) {
            case ("POST"): {
                message=""
                break
            }
            case ("PUT"): {
                message=""
                break
            }
            case ("GET"): {
                message=""
                break
            }
            case ("DELETE"): {
                message=""
                break
            }
            case ("PATCH"): {
                message=""
                break
            }
        }
        return message
    }
    log(paramsHttp,level,error?){

        switch (level) {
            case ("TRACE"): {
                this.logTrace(this.getMessageTrace(paramsHttp))
                break
            }
            case ("DEBUG"): {
                this.logDebug(this.getMessageDebug(paramsHttp))
                break
            }
            case ("INFO"): {
                this.logInfo(this.getMessageInfo(paramsHttp))
                break
            }
            case ("LOG"): {
                this.logLog(this.getMessageLog(paramsHttp))
                break
            }
            case ("WARN"): {
                this.logWarn(this.getMessageWarn(paramsHttp))
                break
            }
            case ("ERROR"): {
                this.logError(this.getMessageError(paramsHttp,error))
                break
            }
            case ("FATAL"): {
                this.logFatal(this.getMessageFatal(paramsHttp,error))
                break
            }
        }
    }
    logTrace(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.TRACE)
        this.logger.trace(message)
    }
    logDebug(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.DEBUG)
        this.logger.debug(message)
    }
    logInfo(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.INFO)
        this.logger.info(message)
    }
    logLog(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.LOG)
        this.logger.log(message)
    }
    logWarn(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.WARN)
            this.logger.warn(message)
    }
    logError(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.ERROR)
        this.logger.error(message)
    }
    logFatal(message)
    {
        if (this.levelLogger() >= NgxLoggerLevel.FATAL)
        this.logger.fatal(message)
    }
 levelLogger () {
        if (localStorage.getItem("levelLogger") == null || localStorage.getItem("levelLogger") == undefined ) localStorage.setItem("levelLogger","DEBUG")
        let lv = (localStorage.getItem("levelLogger") != null && localStorage.getItem("levelLogger") !=undefined ) ?localStorage.getItem("levelLogger"): "DEBUG";
        switch (lv) {
            case ("TRACE"): {
                return (NgxLoggerLevel.TRACE)
            }
            case ("DEBUG"): {
                return NgxLoggerLevel.DEBUG
                break
            }
            case ("INFO"): {
                return NgxLoggerLevel.INFO

            }
            case ("LOG"): {
                return NgxLoggerLevel.LOG

            }
            case ("WARN"): {
                return NgxLoggerLevel.WARN

            }
            case ("ERROR"): {
                return NgxLoggerLevel.ERROR

            }
            case ("FATAL"): {
                return NgxLoggerLevel.FATAL

            }
        }
        return NgxLoggerLevel.WARN

    }
}
