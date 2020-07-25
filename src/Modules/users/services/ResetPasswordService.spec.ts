// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

// categorizo todos os testes dentro desse arquivo
describe('SendForgotPasswordEmailService', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        resetPassword = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokensRepository,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Marcos Volke',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPassword.execute({
            token,
            password: '654321',
        });

        const updateUser = await fakeUserRepository.findById(user.id);

        expect(updateUser?.password).toBe('654321');
    });
});
