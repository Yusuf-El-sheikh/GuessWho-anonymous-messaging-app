//my custom error class since TS wont allow me to just ".status = whatever" anymore inn the future
export class appError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

/*ok one thing i wanted to point out, while studying i realized that making ready instances of 
appError like dataTypeMismatch error defeats the whole point of "Error.captureStackTrace(this, this.constructor)"
because it will point to where the instance was created instead of where it was thrown which is a considerable trade off*/