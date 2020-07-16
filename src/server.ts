import 'reflect-metadata';
// teset
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './shared/routes';
import uploadConfig from './config/upload';
import AppError from './shared/errors/AppError';

import './shared/database';

const app = express();

app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
    // Trocar next por _ e configurar eslint pra quando for underline saber q eu não vou usar o parâmetro
    // esse parâmetro é obrigatório, por isso tem que fazer essa gambis
    (err: Error, request: Request, response: Response, _: NextFunction) => {
        // Se é um erro gerado pela minha aplicação, retorno dessa forma
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }

        return response.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    },
);

app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log('Server Iniciado na porta 3333!!!');
});
