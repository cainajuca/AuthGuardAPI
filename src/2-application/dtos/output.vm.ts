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

/**
 * @swagger
 * components:
 *   schemas:
 *     OutputVM:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *           description: Indicates whether the operation was successful, determined by the presence of errors.
 *           example: false
 *         statusCode:
 *           type: integer
 *           description: The HTTP status code of the response.
 *           example: 400
 *         data:
 *           description: Contains the result of the operation. In case of errors, this will be null.
 *           nullable: true
 *           type: object
 *           example: null
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of error messages, if any.
 *           example:
 *             - "Invalid username or password"
 *       examples:
 *         successResponse:
 *           summary: Generic example of a successful response
 *           value:
 *             valid: true
 *             statusCode: 200
 *             data: {}  # This will be replaced with endpoint-specific data format
 *             errors: []
 *         errorResponse:
 *           summary: Example of an error response
 *           value:
 *             valid: false
 *             statusCode: 400
 *             data: null
 *             errors:
 *               - "Invalid username or password"
 */
