import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import EmailSendDto from './dto/email.send.dto';

@Injectable()
export default class EmailService {
  constructor(private readonly httpService: HttpService) {}

  public async sendEmail(dto: EmailSendDto) {
    const { subject, email, body } = dto;

    const response = await lastValueFrom(
      this.httpService.post(
        '/sendEmail',
        {},
        {
          params: {
            subject,
            body,
            email,
          },
        },
      ),
    );
    console.log(response);
  }
}
