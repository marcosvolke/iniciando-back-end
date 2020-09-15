// index, show, create, update, delete são os métodos possíveis
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from 'modTeste/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id } = request.params;
        const { month, year } = request.query;

        const listProviderMonthAvailability = container.resolve(
            ListProviderMonthAvailabilityService,
        );

        const availability = await listProviderMonthAvailability.execute({
            provider_id,
            month: Number(month),
            year: Number(year),
        });

        return response.json(availability);
    }
}