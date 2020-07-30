import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import User from '../infra/typeorm/entities/User';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

// categorizo todos os testes dentro desse arquivo
describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'Marcos',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('Marcos');
    });

    it('should not be able to create a user with same e-mail', async () => {
        await createUser.execute({
            name: 'Marcos',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'Marcos',
                email: 'marcos.volke@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create users with different e-mail', async () => {
        await createUser.execute({
            name: 'Marcos',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'Marcos',
                email: 'marcos@sizex.com.br',
                password: '123456',
            }),
        ).resolves.toBeInstanceOf(User);
    });
});
