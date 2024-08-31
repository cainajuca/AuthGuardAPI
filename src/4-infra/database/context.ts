import { DynamoDB } from 'aws-sdk'
import { seedData } from './seed-data';

export const dynamoDbClient = new DynamoDB.DocumentClient({
    region: process.env.AWS_DB_REGION
});

const dynamoDB = new DynamoDB();

export const usersTable = process.env.USERS_TABLE;

let dbConnectionInitialized = false;

export async function connectToDatabase() {
    if (dbConnectionInitialized)
        return;

    try {
        const tables = await dynamoDB.listTables().promise();
        console.log('Connected to DynamoDB', tables.TableNames);

        if (!tables.TableNames.includes(usersTable)) {
            console.log(`Table ${usersTable} not found. Running seed data...`);
            await seedData(dynamoDbClient);
        }

        dbConnectionInitialized = true;
    } catch (err) {
        console.error('Failed to connect to DynamoDB', err);
        throw err;
    }
}
