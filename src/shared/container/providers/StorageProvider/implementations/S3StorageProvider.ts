import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
    private client: aws.S3;

    constructor() {
        this.client = new aws.S3({
            region: 'us-east-2',
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tempFolder, file);

        const contentType = mime.getType(originalPath);
        if (!contentType) {
            throw new Error('File not found on get content type');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        // nome da "pasta", key é o nome do arquivo e acl são as permissoes
        // try {
        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
                ACL: 'public-read',
                Body: fileContent,
                ContentType: contentType,
                // ContentDisposition: `inline; filename=${file}`,
            })
            .promise();
        // } catch (error) {
        //     console.log(error);
        // }

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: 'app-gobarber-marcosvolke',
                Key: file,
            })
            .promise();
    }
}
