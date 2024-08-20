import { Request, Response} from "express";

import { deleteUserById, getUserById, getUsers } from '../db/users';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        user.username = username;
        await user.save();

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        // deactivate user's jwt

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const users = {
    getAllUsers,
    updateUser,
    deleteUser,
}