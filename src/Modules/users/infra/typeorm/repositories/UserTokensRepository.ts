import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
    private OrmRepository: Repository<UserToken>;

    constructor() {
        this.OrmRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.OrmRepository.findOne({
            where: { token },
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.OrmRepository.create({
            user_id,
        });

        await this.OrmRepository.save(userToken);

        return userToken;
    }
}

export default UserTokensRepository;
