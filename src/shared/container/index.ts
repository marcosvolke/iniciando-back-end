import { container } from 'tsyringe';

// config de injeção de dependência dos provider - outro container
import '@modules/users/providers';
import './providers';

import IAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
// import { IUserTokensRepository } from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

// container.registerSingleton<IUserTokensRepository>(
//     'UserTokensRepository',
//     UserTokensRepository,
// );