import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

// categorizo todos os testes dentro desse arquivo
describe('SendForgotPasswordEmailService', () => {
    it('should be able to recover the password using the email', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
        );

        await fakeUserRepository.create({
            name: 'Marcos Volke',
            email: 'marcos.volke@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'marcos.volke@gmail.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();

        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
        );

        await expect(
            sendForgotPasswordEmail.execute({
                email: 'marcos.volke@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
