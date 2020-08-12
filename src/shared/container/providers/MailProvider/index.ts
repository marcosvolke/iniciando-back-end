import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
};

// com o register singleton não passou pelo constructor da classe, por isso usamos o registerInstance
// e continua sendo um singleton, vai executar uma vez só
container.registerInstance<IMailProvider>(
    'MailProvider',
    providers[mailConfig.driver],
); // alterado para container.resolve ao invés somente dar um new pra resolver injeção de dependência do template dentro do mail provider
// e a ordem das injeções influencia quando uma depende da outra: caso do mail q usa o template
