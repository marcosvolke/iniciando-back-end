import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

// categorizo todos os testes dentro desse arquivo
describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        showProfile = new ShowProfileService(fakeUserRepository);
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        const profile = await showProfile.execute(user.id);

        expect(profile.email).toBe('marcos@sizex.com.br');
        expect(profile.name).toBe('Marcos');
    });

    it('should not be able to show the profile from non-existing user', async () => {
        await expect(
            showProfile.execute('non existing user id'),
        ).rejects.toBeInstanceOf(AppError);
    });
});
