// Router for Users

import { Router } from 'express';
import { getUsers, createUser, getUserById, updateProfile, getCurrentUser, updateAvatar } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar)

export default usersRouter;