// Código para sobrescrever tipo do Request do Express incluindo uma propriedade
// user pra eu passar o usuário do middleware de auth para as rotas
declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}
