import { uuid } from 'uuidv4';

import IUsersRepository from 'modTeste/users/repositories/IUsersRepository';
import ICreateUserDTO from 'modTeste/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from 'modTeste/users/dtos/IFIndAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);

        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);

        return findUser;
    }

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let { users } = this;

        if (except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id);
        }

        return users;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        // Object.assign(user, { id: uuid(), userData });
        user.id = uuid();
        user.name = userData.name;
        user.email = userData.email;
        user.password = userData.password;

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        this.users[findIndex] = user;

        return this.users[findIndex];
    }
}

export default FakeUsersRepository;