import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Autenticação',
            version: '1.0.0',
            description: 'Documentação da API de autenticação usando Swagger',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: [
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}