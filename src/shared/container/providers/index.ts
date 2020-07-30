import { container } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);

// com o register singleton não passou pelo constructor da classe, por isso usamos o registerInstance
// e continua sendo um singleton, vai executar uma vez só
container.registerInstance<IMailProvider>(
    'MailProvider',
    new EtherealMailProvider(),
);
