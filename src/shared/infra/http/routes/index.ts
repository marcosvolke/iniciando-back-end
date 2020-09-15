import { Router } from 'express';

import appointmentsRouter from 'modTeste/appointments/infra/http/routes/appointments.routes';
import providersRouter from 'modTeste/appointments/infra/http/routes/providers.routes';
import usersRouter from 'modTeste/users/infra/http/routes/users.routes';
import sessionsRouter from 'modTeste/users/infra/http/routes/sessions.routes';
import passwordRouter from 'modTeste/users/infra/http/routes/password.routes';
import profileRouter from 'modTeste/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
