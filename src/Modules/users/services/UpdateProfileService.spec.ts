import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

// categorizo todos os testes dentro desse arquivo
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'aaaaaa',
            email: 'aaaaaa@sizex.com.br',
            old_password: '',
            password: '',
        });

        expect(updatedUser.name).toBe('aaaaaa');
        expect(updatedUser.email).toBe('aaaaaa@sizex.com.br');
    });

    it('should not be able to change to another existing user email', async () => {
        await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        const user = await fakeUserRepository.create({
            email: 'teste@sizex.com.br',
            name: 'teste',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Marcos',
                email: 'marcos@sizex.com.br',
                old_password: '',
                password: '',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // para não cair na trava de email já cadastrado quando atualiza e mantém o email
    it('should be able to change only the name', async () => {
        await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        const user = await fakeUserRepository.create({
            email: 'teste@sizex.com.br',
            name: 'teste',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'aaaaaaa',
            email: user.email,
            old_password: '',
            password: '',
        });

        expect(updatedUser.name).toBe('aaaaaaa');
    });

    it('should be able to update the password', async () => {
        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'aaaaaa',
            email: 'aaaaaa@sizex.com.br',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'aaaaaa',
                email: 'aaaaaa@sizex.com.br',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'aaaaaa',
                email: 'aaaaaa@sizex.com.br',
                old_password: 'senha antiga errada',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
