import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import User from '../infra/typeorm/entities/User';

// categorizo todos os testes dentro desse arquivo
describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUserRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(fakeUserRepository);

        const user = await createUser.execute({
            name: 'Marcos',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('Marcos');
    });

    it('should not be able to create a user with same e-mail', async () => {
        const fakeUserRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(fakeUserRepository);

        await createUser.execute({
            name: 'Marcos',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'Marcos',
                email: 'marcos.volke@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create users with different e-mail', async () => {
        const fakeUserRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(fakeUserRepository);

        await createUser.execute({
            name: 'Marcos',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'Marcos',
                email: 'marcos@sizex.com.br',
                password: '123456',
            }),
        ).resolves.toBeInstanceOf(User);
    });
});
