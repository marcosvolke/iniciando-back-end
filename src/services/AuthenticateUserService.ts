import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs'; // compare compara uma senha não criptografada com uma senha criptografada
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';

import User from '../models/User';

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({
        email,
        password,
    }: RequestDTO): Promise<ResponseDTO> {
        const usersRepository = getRepository(User);

        const user: User | undefined = await usersRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new Error('Incorret email/password combination.');
        }

        const passwordMatched: boolean = await compare(password, user.password);
        if (!passwordMatched) {
            throw new Error('Incorret email/password combination.');
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
