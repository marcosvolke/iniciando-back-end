import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader) {
        throw new Error('JWT token is missing');
    }

    // Token: Bearer dngsdngisdginsdgsdin
    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        // Já aproveita e passa o id do usuário para as próximas rotas q vem após o middleware
        // console.log(decoded);
        const { sub } = decoded as TokenPayload; // Conversão de Tipo
        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new Error('Invalid JWT token');
    }
}
