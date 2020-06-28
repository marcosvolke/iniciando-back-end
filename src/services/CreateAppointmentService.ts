import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    // private appointmentsRepository: AppointmentsRepository;

    // constructor(appointmentsRepository: AppointmentsRepository) {
    //     this.appointmentsRepository = appointmentsRepository;
    // }

    public async execute({
        provider_id,
        date,
    }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appointmentDate = startOfHour(date);
        const findAppointmentinSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );
        if (findAppointmentinSameDate) {
            throw Error('This appointment is already booked');
            // return response
            //     .status(400)
            //     .json({ message: 'This appointment is already booked' });
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment); // Aqui salva mesmo o registro no banco

        return appointment;
    }
}

export default CreateAppointmentService;
