import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

// categorizo todos os testes dentro desse arquivo
describe('ListProviders', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        listProvidersService = new ListProvidersService(fakeUserRepository);
    });

    it('should be able to list the providers', async () => {
        const loggedUser = await fakeUserRepository.create({
            email: 'marcos@sizex.com.br',
            name: 'Marcos',
            password: '123456',
        });

        const user1 = await fakeUserRepository.create({
            email: 'lauro@sizex.com.br',
            name: 'Lauro',
            password: '123456',
        });

        const user2 = await fakeUserRepository.create({
            email: 'william@sizex.com.br',
            name: 'William',
            password: '123456',
        });

        const providers = await listProvidersService.execute(loggedUser.id);

        expect(providers).toEqual([user1, user2]);
    });
});
