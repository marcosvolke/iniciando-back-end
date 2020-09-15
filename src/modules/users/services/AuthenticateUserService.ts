import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import User from 'modTeste/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
    email: string;
    password: string;
}

interface IResponseDTO {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        email,
        password,
    }: IRequestDTO): Promise<IResponseDTO> {
        const user: User | undefined = await this.usersRepository.findByEmail(
            email,
        );
        if (!user) {
            throw new AppError('Incorret email/password combination.', 401);
        }

        const passwordMatched: boolean = await this.hashProvider.compareHash(
            password,
            user.password,
        );
        if (!passwordMatched) {
            throw new AppError('Incorret email/password combination.', 401);
        }

        // 1º parâmetro é o payload são infos do usuário não seguras, id, permissões, etc. Fácil de descriptografar.
        // 2º segundo parâmetro é um secret (senha) nossa - usar md5 online pra gerar uma chave
        // 3º configurações do token - não deixar expiração eterna e 1 dia seria muito também, deixar minutos ou horas
        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
