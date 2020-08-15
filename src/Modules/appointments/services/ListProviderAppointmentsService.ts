import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAppointmentsRepository from '../repositories/iAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequestDTO {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequestDTO): Promise<Appointment[]> {
        // const cacheData = await this.cacheProvider.recover('fafssfs');

        // console.log(cacheData);

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                year,
                month,
                day,
            },
        );

        // await this.cacheProvider.save('fafssfs', 'sfsafasfsaf');

        return appointments;
    }
}

export default ListProviderAppointmentsService;
