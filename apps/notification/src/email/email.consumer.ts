import { Controller } from '@nestjs/common';
import EmailService from './email.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  NotificationServiceMessagePattern,
  getDataFromRMQContext,
} from '../../../../libs/common/src';
import EmailMultipleSendDto from './dto/email.send-multiple.dto';
import EmailSendDto from './dto/email.send.dto';
import MailSingleRequestMessageData from '../../../../libs/common/src/dto/notification-service/mail-single/mail-single.request.dto';
import MailMultipleRequestMessageData from '../../../../libs/common/src/dto/notification-service/mail-multiple/mail-multiple.request.dto';

@Controller()
export default class EmailConsumer {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern(NotificationServiceMessagePattern.mailSingle)
  sendEmailSingle(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<MailSingleRequestMessageData>(ctx);
    return this.emailService.sendEmail(data);
  }

  @MessagePattern(NotificationServiceMessagePattern.mailMultiple)
  sendEmailMultiple(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<MailMultipleRequestMessageData>(ctx);
    return this.emailService.sendEmails(data);
  }
}
