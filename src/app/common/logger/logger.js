export class Logger {
    static instance;
    constructor() {
        if (!Logger.instance) {
            Logger.instance = this;
        }
        return Logger.instance;
    }

    log(level, message, metadata = {}) {
        let log = {
            level: level,
            message: message,
            timestamp: new Date().toISOString(),
            metadata: { ...metadata }
        }

        console.log(JSON.stringify(log));
    }

    error(message, metadata = {}) {
        this.log("Error", message, metadata);
    }

    debug(message, metadata = {}) {
        this.log("Debug", message, metadata);
    }

    info(message, metadata = {}) {
        this.log("Info", message, metadata);
    }
    
    warn(message, metadata = {}) {
        this.log("Warn", message, metadata);
    }
}

export const logger = new Logger();