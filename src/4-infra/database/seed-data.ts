import { hashPassword } from '@shared/utils/bcrypt';
import { DynamoDB } from 'aws-sdk'

export async function seedData(dynamoDBClient: DynamoDB.DocumentClient) {
    
    const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD);
    
    const params = {
        TableName: 'users',
        Item: {
            id: 100,
			username: 'admin',
			name: 'Administrator',
			email: 'admin@admin.com',
			password: passwordHash,
			role: 'user',
            createdAt: new Date().toISOString(),
        },
    };

    await dynamoDBClient.put(params).promise();
    console.log('Seed data inserted');
}
