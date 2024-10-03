import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth Guard API',
            version: '1.0.0',
            description: 'Documentation for an authentication API using Swagger',
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:8080',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>',
                },
            },
        },
        security: [
            {
                bearerAuth: [] as any[],
            },
        ],
    },
    apis: [
        // endpoints
        'src/routes/auth.ts',
        'src/routes/user.ts',

        // presentation dtos
        'src/dtos/login-output.ts',
        
        // application dtos
        'src/dtos/*.vm.ts',
        'src/dtos/*.dto.ts',

        // service dtos
        'src/services/dtos/*.dto.ts',
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}