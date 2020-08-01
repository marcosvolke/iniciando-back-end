// index, show, create, update, delete são os métodos possíveis
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        return response.json();
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, old_password, password } = request.body;

        const updateProfileService = container.resolve(UpdateProfileService);

        const user = await updateProfileService.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });

        // Não devolve informação
        delete user.password;

        return response.json(user);
    }
}
