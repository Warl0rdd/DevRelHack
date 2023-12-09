import { Module } from '@nestjs/common';
import UserService from './user.service';
import UserConsumer from './user.consumer';

@Module({
  controllers: [UserConsumer],
  providers: [UserService],
})
export default class UserModule {}
