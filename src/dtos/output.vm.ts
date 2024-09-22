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
 *           description: Indicates whether the overall operation was successful
 *           example: true
 *         statusCode:
 *           type: integer
 *           description: HTTP status code of the response
 *           example: 200
 *         data:
 *           description: Contains the result of the operation, specific to each endpoint
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of error messages, if any
 *           example: []
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
