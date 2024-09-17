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
        // endpoints
        'src/1-presentation/routes/auth.ts',
        'src/1-presentation/routes/user.ts',

        // presentation dtos
        'src/1-presentation/view-models/login-output.ts',
        
        // application dtos
        'src/2-application/dtos/*.vm.ts',
        'src/2-application/dtos/*.dto.ts',

        // use case dtos
        'src/2-application/use-cases/sign-up-use-case/*.dto.ts',
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}