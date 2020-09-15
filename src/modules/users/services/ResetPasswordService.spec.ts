import AppError from '@shared/errors/AppError';
import FakeUsersRepository from 'modTeste/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

// categorizo todos os testes dentro desse arquivo
describe('ResetPasswordEmailService', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Marcos Volke',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        // define nova senha
        await resetPassword.execute({
            token,
            password: '654321',
        });

        const updateUser = await fakeUserRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('654321');
        expect(updateUser?.password).toBe('654321');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: 'qq coisa',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing user',
        );

        await expect(
            resetPassword.execute({
                token,
                password: 'qq coisa',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password after two hours', async () => {
        const user = await fakeUserRepository.create({
            name: 'Marcos Volke',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        // Mock de função date.now para retornar a hora q eu quiser
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        // define nova senha
        await expect(
            resetPassword.execute({
                token,
                password: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
