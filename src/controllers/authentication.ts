import { Request, Response } from 'express';
import { getUserByUsername, createUser } from '../db/users';

import { generateToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/bcrypt';

const login_get = async (req: Request, res: Response) => {
    try {
		return res.status(200).json({
            not: "implemented" 
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const login_post = async (req: Request, res: Response) => {
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
			_id: user._id.toString(),
			username: user.username,
		});
		
		return res.status(200).json({
            user: {
                id: user._id,
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

const signup_get = async (req: Request, res: Response) => {
    try {
		return res.status(200).json({
            not: "implemented" 
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const signup_post = async (req: Request, res: Response) => {
    try {
        // UserSchema properties
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

        const createdUser = await createUser(newUser);

        const token = generateToken({
			_id: createdUser._id.toString(),
			username: createdUser.username,
		});

        return res.status(201).json({
            user: {
                id: createdUser._id,
				username: createdUser.username,
				email: createdUser.email,
			},
            token 
        });
        
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const auth = {
    login_get, login_post,
    signup_get, signup_post
}