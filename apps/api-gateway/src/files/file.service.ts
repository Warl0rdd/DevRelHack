import * as fs from 'fs';
import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class FileService {
  private filePath = process.env.FILE_PATH + '/files/';
  public async saveFile(file: Express.Multer.File) {
    console.log(file);
    const [name, type] = file.originalname.split('.');
    const hashedName = randomBytes(6).toString('hex');
    if (!fs.existsSync(this.filePath)) {
      fs.mkdirSync(this.filePath);
    }
    const fullPath = this.filePath + hashedName + '.' + type;
    fs.writeFileSync(fullPath, file.buffer);
    return [fullPath, hashedName + '.' + type];
  }
}
