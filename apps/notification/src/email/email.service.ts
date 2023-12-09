import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import EmailSendDto from './dto/email.send.dto';
import EmailMultipleSendDto from './dto/email.send-multiple.dto';

@Injectable()
export default class EmailService {
  constructor(private readonly httpService: HttpService) {}

  public async sendEmail(dto: EmailSendDto) {
    const { subject, email, body } = dto;

    await lastValueFrom(
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
  }

  public async sendEmails(dto: EmailMultipleSendDto) {
    const { subject, emails, body } = dto;

    for (const email of emails) {
      await lastValueFrom(
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
    }
  }
}
