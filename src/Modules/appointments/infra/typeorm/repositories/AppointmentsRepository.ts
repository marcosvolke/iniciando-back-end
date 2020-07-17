import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    private OrmRepository: Repository<Appointment>;

    constructor() {
        this.OrmRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.OrmRepository.findOne({
            where: { date },
        });

        return findAppointment || undefined;
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.OrmRepository.create({ provider_id, date });

        await this.OrmRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
