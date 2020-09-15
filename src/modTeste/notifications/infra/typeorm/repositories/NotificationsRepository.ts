import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from 'modTeste/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from 'modTeste/notifications/dtos/ICreateNotificationDTO';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
    private OrmRepository: MongoRepository<Notification>;

    constructor() {
        this.OrmRepository = getMongoRepository(Notification, 'mongo');
        // como não é a conexão default, tem q passar o nome informado no ormconfig.json no segundo parâmetro
    }

    public async create({
        content,
        recipient_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.OrmRepository.create({
            content,
            recipient_id,
        });

        await this.OrmRepository.save(notification);

        return notification;
    }
}

export default NotificationsRepository;
