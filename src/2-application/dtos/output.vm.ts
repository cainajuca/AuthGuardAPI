export class OutputVM<T = any> {
    valid: boolean;
    statusCode: number;
    data: T | null;
    errors: string[];

    constructor(statusCode: number, data: T | null, errors: string[]) {
        this.valid = errors.length === 0;
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
    }   
}
