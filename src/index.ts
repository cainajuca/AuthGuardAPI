import '@shared/config/env';

import express, { NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import serverless from 'serverless-http';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { connectToDatabase } from '@infra/database/context';
import router from '@presentation/routes';

let dbConnectionInitialized = false;

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(express.json());

app.use(async (next: NextFunction) => {

    // ensure database connection
    if (!dbConnectionInitialized) {
        await connectToDatabase();
        dbConnectionInitialized = true;
    }
    
    next();
});

app.use('/', router());

const serverlessHandler = serverless(app);

export const handler: APIGatewayProxyHandler = async (event, context) => {
    if (process.env.DEBUG) {
        console.log({
            message: 'Received event',
            data: JSON.stringify(event),
        });
    }

    const result = (await serverlessHandler(event, context)) as APIGatewayProxyResult;

    return {
        statusCode: result.statusCode || 200,
        body: result.body || '',
        headers: result.headers,
        isBase64Encoded: result.isBase64Encoded || false
    };
};
  