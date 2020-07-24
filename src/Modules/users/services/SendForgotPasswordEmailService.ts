import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequestDTO): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('User does not exists.');
        }

        await this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(
            email,
            'Pedido de recuperação de senha recebido',
        );
    }
}

export default SendForgotPasswordEmailService;
