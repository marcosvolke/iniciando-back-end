// index, show, create, update, delete são os métodos possíveis
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUserService = container.resolve(
            AuthenticateUserService,
        );
        const { user, token } = await authenticateUserService.execute({
            email,
            password,
        });

        // delete user.password;

        return response.json({ user: classToClass(user), token });
    }
}
