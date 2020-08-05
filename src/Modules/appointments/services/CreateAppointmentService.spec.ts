import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import Appointment from '../infra/typeorm/entities/Appointment';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

// categorizo todos os testes dentro desse arquivo
describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123123',
            provider_id: '156156156',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('156156156');
    });

    it('should not be able to create appointment on the same time', async () => {
        const appointmentDate = new Date(2020, 7, 18, 10);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123123',
            provider_id: '156156156',
        });

        // Remover sempre o await para rodar dentro do expect
        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '123123',
                provider_id: '156156156',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to create appointments with different date', async () => {
        await createAppointment.execute({
            date: new Date(2020, 7, 18, 10),
            user_id: '123123',
            provider_id: '156156156',
        });

        // Remover sempre o await para rodar dentro do expect
        await expect(
            createAppointment.execute({
                date: new Date(2020, 7, 18, 9),
                user_id: '123123',
                provider_id: '156156156',
            }),
        ).resolves.toBeInstanceOf(Appointment);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '123123',
                provider_id: '156156156',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: 'user',
                provider_id: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 15, 7),
                user_id: 'user',
                provider_id: 'provider',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 15, 18),
                user_id: 'user',
                provider_id: 'provider',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
