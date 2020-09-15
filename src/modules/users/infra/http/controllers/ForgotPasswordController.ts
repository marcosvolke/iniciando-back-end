// index, show, create, update, delete são os métodos possíveis
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from 'modTeste/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email } = request.body;

        const sendForgotPasswordEmail = container.resolve(
            SendForgotPasswordEmailService,
        );

        await sendForgotPasswordEmail.execute({
            email,
        });

        return response.status(204).json();
    }
}
