import { Injectable } from '@nestjs/common';
import User from '../db/entities/user.entity';
import TelegramAccount from '../db/entities/telegram-account.entity';
import { TelegramAccountStatusEnum } from '../telegram/telegram.account-status.enum';

@Injectable()
export default class UserService {
  public async addUser(email: string) {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return;

    const newUser = new User();
    newUser.email = email;
    await newUser.save();
  }

  public async addTelegramAccount(email: string, telegramName: string) {
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      console.log('user doesnt exist');
      return;
    }
    const telegramAccountExists = await TelegramAccount.findOne({
      where: { user: { email: email } },
      relations: ['user'],
    });
    if (telegramAccountExists) {
      console.log('telegram already exists');

      return;
    }

    const telegramAccount = new TelegramAccount();
    telegramAccount.user = userExists;
    telegramAccount.telegramName = telegramName;
    telegramAccount.telegramConfirmCode = '123456';
    telegramAccount.telegramStatus = TelegramAccountStatusEnum.NEW;

    await telegramAccount.save();
  }
}
