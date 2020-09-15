import IFindAllinDayProviderDTO from 'modTeste/appointments/dtos/IFindAllinDayProviderDTO';
import { getRepository, Repository, Raw } from 'typeorm';

// Raw é pra passar a query pura na linguagem do banco de dados

import IAppointmentsRepository from 'modTeste/appointments/repositories/iAppointmentsRepository';
import ICreateAppointmentDTO from 'modTeste/appointments/dtos/ICreateAppointmentDTO';
import IFindAllinMonthProviderDTO from 'modTeste/appointments/dtos/IFindAllinMonthProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    private OrmRepository: Repository<Appointment>;

    constructor() {
        this.OrmRepository = getRepository(Appointment);
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.OrmRepository.findOne({
            where: { date, provider_id },
        });

        return findAppointment || undefined;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.OrmRepository.create({
            provider_id,
            user_id,
            date,
        });

        await this.OrmRepository.save(appointment);

        return appointment;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllinMonthProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.OrmRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllinDayProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.OrmRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });

        return appointments;
    }
}

export default AppointmentsRepository;
