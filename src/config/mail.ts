interface IMailConfig {
    driver: 'ethereal' | 'ses';
    defaultsSES: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaultsSES: {
        from: {
            email: 'marcos@sizex.com.br',
            name: 'Marcos da Sizex',
        },
    },
} as IMailConfig;
