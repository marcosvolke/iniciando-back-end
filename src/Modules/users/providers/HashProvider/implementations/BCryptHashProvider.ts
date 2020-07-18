import { hash, compare } from 'bcryptjs'; // compare compara uma senha não criptografada com uma senha criptografada

import IHashProvider from '../models/IHashProvider';

export default class BCryptHasProvider implements IHashProvider {
    public async generateHash(payload: string): Promise<string> {
        return hash(payload, 8);
    }

    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        return compare(payload, hashed);
    }
}
