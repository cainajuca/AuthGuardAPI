import { IUserRepository } from "@domain/repositories/user-repository.interface";
import { User } from "@domain/entities/user";
import { dynamoDbClient, usersTable } from "../database/context";

export class UserRepository implements IUserRepository {
    async findAllUsers(): Promise<User[]> {
        
        const params = {
            TableName: usersTable,
        };
    
        const result = await dynamoDbClient.scan(params).promise();

        console.log({
            message: 'Users has been found',
            data: JSON.stringify(result),
        });

        return result.Items as User[];
    }

    async findById(userId: string): Promise<User | null> {

        const params = {
            TableName: usersTable,
            Key: {
                userId: userId,
            }
        };

        const { Item } = await dynamoDbClient.get(params).promise();
        const { id, username, name, email, password, role } = Item;

        console.log({
            message: 'User has been found',
            data: JSON.stringify(Item),
        });

        return Item ? new User(id, username, name, email, password, role) : null;
    }

    async findByUsername(usernameParam: string): Promise<User | null> {

        const params = {
            TableName: usersTable,
            Key: {
                username: usernameParam,
            }
        };

        const { Item } = await dynamoDbClient.get(params).promise();
        const { id, username, name, email, password, role } = Item;

        console.log({
            message: 'User has been found',
            data: JSON.stringify(Item),
        });

        return Item ? new User(id, username, name, email, password, role) : null;
    }

    async save(user: User): Promise<void> {

        const { id, username, name, email, password, role } = user;

        const params = {
            TableName: usersTable,
            Item: {
                id,
                username, 
                name,
                email,
                password,
                role
            },
        };

        await dynamoDbClient.put(params).promise();

        console.log({
            message: 'User has been created',
            data: JSON.stringify(params.Item),
        });
    }

    async update(user: User): Promise<void> {
        
        const { id, username, name, email, password, role } = user;

        const params = {
            TableName: usersTable,
            Key: { id: id },
            UpdateExpression: 'set #username = :username, #name = :name, #email = :email, #password = :password, #role = :role',
            ExpressionAttributeNames: {
                '#username': 'username',
                '#name': 'name',
                '#email': 'email',
                '#password': 'password',
                '#role': 'role'
            },
            ExpressionAttributeValues: {
                ':username': username,
                ':name': name,
                ':email': email,
                ':password': password,
                ':role': role
            }
        };

        await dynamoDbClient.update(params).promise();

        console.log({
            message: 'User has been updated',
            data: JSON.stringify({
                id,
                username, 
                name,
                email,
                password,
                role
            }),
        });
    }

    async delete(id: string): Promise<void> {

        const params = {
            TableName: usersTable,
            Key: { id: id }
        };
        
        await dynamoDbClient.delete(params).promise();

        console.log({
            message: 'User has been deleted',
            data: JSON.stringify({ id }),
        });
    }
}