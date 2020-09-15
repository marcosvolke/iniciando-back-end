import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from 'modTeste/users/repositories/IUsersRepository';
import ICreateUserDTO from 'modTeste/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from 'modTeste/users/dtos/IFIndAllProvidersDTO';

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

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];

        if (except_user_id) {
            users = await this.OrmRepository.find({
                where: {
                    id: Not(except_user_id),
                },
            });
        } else {
            users = await this.OrmRepository.find();
        }

        return users;
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
