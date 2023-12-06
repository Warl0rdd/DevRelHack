import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import EmailService from './email.service';
import EmailSendDto from './dto/email.send.dto';

@ApiTags('Письма')
@Controller('email')
export default class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Post()
  sendEmail(@Body() data: EmailSendDto): any {
    return this.emailService.sendEmail(data);
  }
}
