import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensuredAuthenticated';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name,
            email,
            password,
        });

        // Não devolve informação
        delete user.password;

        return response.json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        console.log(request.file);
        return response.json({ message: 'ok' });
    },
);

export default usersRouter;
