import { createConnection } from 'typeorm';

// Ele busca o ormconfig.json pra ser a configuração da conexão - usamos assim pra conseguir usar a CLI do typeOrm
createConnection();
