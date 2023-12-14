import { Module } from '@nestjs/common';
import UsersController from './user.controller';
import { UserService } from './user.service';
import { NotificationModule } from '../notification/api-gateway.notifictaion.module';

@Module({
  imports: [NotificationModule],
  controllers: [UsersController],
  providers: [UserService],
})
export default class UserModule {}
