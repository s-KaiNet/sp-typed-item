export class SchemaValidationError extends Error {
    constructor(message: string, public errors?: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
