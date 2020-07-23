import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

// categorizo todos os testes dentro desse arquivo
describe('UpdateUserAvatar', () => {
    it('should be able to update avatar user', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'qqcoisa.jpg',
        });

        expect(user.avatar).toBe('qqcoisa.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        await expect(
            updateUserAvatar.execute({
                user_id: 'usuário que não existe',
                avatarFilename: 'qqcoisa.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        // retorna a função delete file que quero saber se foi executada
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        // espero que a função tenha sido chamada com o seguinte parâmetro
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
