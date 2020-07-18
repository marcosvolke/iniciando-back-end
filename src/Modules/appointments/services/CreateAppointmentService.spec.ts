import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import Appointment from '../infra/typeorm/entities/Appointment';

// categorizo todos os testes dentro desse arquivo
describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '156156156',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('156156156');
    });

    it('should not be able to create appointment on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2020, 7, 18, 10);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '156156156',
        });

        // Remover sempre o await para rodar dentro do expect
        expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '156156156',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to create appointment on a different date', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        await createAppointment.execute({
            date: new Date(2020, 7, 18, 10),
            provider_id: '156156156',
        });

        // Remover sempre o await para rodar dentro do expect
        expect(
            createAppointment.execute({
                date: new Date(2020, 7, 18, 9),
                provider_id: '156156156',
            }),
        ).resolves.toBeInstanceOf(Appointment);
    });
});
