import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../../config/upload';

import ensureAuthenticated from '../middlewares/ensuredAuthenticated';

import CreateUserService from '../../Modules/users/services/CreateUserService';
import UpdateUserAvatarService from '../../Modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
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
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();
        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
