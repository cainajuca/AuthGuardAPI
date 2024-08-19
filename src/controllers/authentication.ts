import { Request, Response } from 'express';
import { getUserByUsername, createUser } from '../db/users'; // no tutorial é ..db/users

import { generateToken } from '../auth/jwt';
import { hashPassword, verifyPassword } from '../auth/bcrypt';

export const login = async (req: Request, res: Response) =>{
    try {
        const { username, password } = req.body;

        if(!username || !password)
            return res.status(400).json('Credentials are not in the correct format');
        
        const user = await getUserByUsername(username).select('+password');

        if(!user)
            return res.status(400).json('User does not exist');

        const isPasswordValid = await verifyPassword(password, user.password);

  		if (!isPasswordValid)
			return res.status(401).send('Invalid username or password');
		
		const token = generateToken({
			email: user.email,
			username: user.username,
		});
		
		return res.status(200).json({
            user: {
				username: user.username,
				email: user.email,
			},
            token 
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        // campos do UserSchema
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.sendStatus(400);
        }

        const existingUser = await getUserByUsername(username);

        if(existingUser){
            return res.sendStatus(400);
        }

        const passwordHash = await hashPassword(password);
        const newUser = {
            username,
            email,
			password: passwordHash,
        };

        createUser(newUser);

        const token = generateToken({ email: newUser.email, username: newUser.username });

        return res.status(201).json({
            user: {
				username: newUser.username,
				email: newUser.email,
			},
            token 
        });
        
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}
