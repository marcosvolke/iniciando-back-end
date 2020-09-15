import { container } from 'tsyringe';

// config de injeção de dependência dos provider - outro container
import 'modTeste/users/providers';
import './providers';

import IAppointmentsRepository from 'modTeste/appointments/infra/typeorm/repositories/node_modules/modTeste/appointments/repositories/iAppointmentsRepository';
import AppointmentsRepository from 'modTeste/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from 'modTeste/appointments/services/node_modules/modTeste/users/repositories/IUsersRepository';
import UsersRepository from 'modTeste/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from 'modTeste/users/infra/typeorm/repositories/node_modules/modTeste/users/repositories/IUserTokensRepository';
import UserTokensRepository from 'modTeste/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from 'modTeste/appointments/services/node_modules/modTeste/notifications/repositories/INotificationsRepository';
import NotificationsRepository from 'modTeste/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository',
    UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository',
    NotificationsRepository,
);
