import { Injectable } from '@nestjs/common';
import User from '../db/entities/user.entity';
import TelegramAccount from '../db/entities/telegram-account.entity';
import { TelegramAccountStatusEnum } from '../telegram/telegram.account-status.enum';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import UserAddTelegramResponseMessageData from '../../../../libs/common/src/dto/notification-service/user-add-telegram/user-add-telegram.response';
import { HttpStatusCode } from 'axios';
import { randomInt } from 'crypto';

@Injectable()
export default class UserService {
  public async addUser(email: string) {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return;

    const newUser = new User();
    newUser.email = email;
    await newUser.save();
  }

  public async genCode() {
    return randomInt(9999).toString();
  }

  public async addTelegramAccount(
    email: string,
    telegramName: string,
  ): Promise<RMQResponseMessageTemplate<UserAddTelegramResponseMessageData>> {
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      return {
        success: false,
        error: {
          statusCode: HttpStatusCode.BadRequest,
          message: 'Пользователь не найден',
        },
      };
    }
    const telegramAccountExists = await TelegramAccount.findOne({
      where: { user: { email: email } },
      relations: ['user'],
    });
    if (telegramAccountExists) {
      const code = await this.genCode();
      telegramAccountExists.telegramName = telegramName;
      telegramAccountExists.telegramConfirmCode = code;
      telegramAccountExists.telegramStatus = TelegramAccountStatusEnum.NEW;
      await telegramAccountExists.save();
      return {
        success: true,
        data: {
          email: email,
          telegramName,
          code,
        },
      };
    }

    const code = await this.genCode();
    const telegramAccount = new TelegramAccount();
    telegramAccount.user = userExists;
    telegramAccount.telegramName = telegramName;
    telegramAccount.telegramConfirmCode = code;
    telegramAccount.telegramStatus = TelegramAccountStatusEnum.NEW;

    await telegramAccount.save();
    return {
      success: true,
      data: {
        email: email,
        telegramName,
        code,
      },
    };
  }
}
