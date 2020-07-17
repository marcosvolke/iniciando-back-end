import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
    private OrmRepository: Repository<User>;

    constructor() {
        this.OrmRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.OrmRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.OrmRepository.findOne({
            where: { email },
        });

        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.OrmRepository.create(userData);

        await this.OrmRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.OrmRepository.save(user);
    }
}

export default UsersRepository;
