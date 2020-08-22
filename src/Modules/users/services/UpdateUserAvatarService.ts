import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        user_id,
        avatarFilename,
    }: IRequestDTO): Promise<User> {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError(
                'Only authenticated user can change avatar.',
                401,
            );
        }

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = filename;
        await this.usersRepository.save(user);

        // se nao invalidar todo o cache de appointments, vai dar erro pra carregar avatar dos appointments
        // o certo, certo mesmo, talvez fosse nem ter cache de appointments...
        // se atualizar o nome de usuário tb, nao vai refletir pra appointments em cache.. a nao ser q coloque esse codigo na atualizacao do perfil tb
        this.cacheProvider.invalidatePrefix('provider-appointments');

        return user;
    }
}

export default UpdateUserAvatarService;
