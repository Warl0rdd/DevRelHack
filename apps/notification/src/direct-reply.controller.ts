import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export default class DirectReplyController {
  @MessagePattern('undefined')
  public async consumeReply() {
    console.log('direct replied');
  }
}
