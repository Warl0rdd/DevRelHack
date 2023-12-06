import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TelegramAccountStatusEnum } from './telegram.account-status.enum';
import User from '../db/entities/user.entity';

@Injectable()
export default class TelegramService {
  private readonly commands = [
    {
      command: 'start',
      description: 'Запуск бота',
    },
    {
      command: 'max',
      description: 'Для Макса',
    },
  ];
  private bot: TelegramBot = null;
  constructor() {
    this.initBot();
  }

  private initBot() {
    const API_KEY_BOT = '6614650012:AAGfr3JDy6S-kflKWeVFWUN3VkD8QsK-fUY';

    this.bot = new TelegramBot(API_KEY_BOT, {
      polling: {
        interval: 300,
        autoStart: false,
      },
    });

    this.bot.on('polling_error', (err) => console.log(err));

    this.bot.on('text', (msg) => this.handleOnText(msg));

    this.bot.setMyCommands(this.commands);

    this.bot.startPolling();
  }

  public async requestTelegramConfirm(email: string, telegramName: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) return;
    user.telegramName = telegramName;
    user.telegramStatus = TelegramAccountStatusEnum.NEW;
    user.telegramConfirmCode = '12345';
    await user.save();
  }

  public async sendMessage(telegramName: string, message: string) {
    const chatId = 'TODO: Get chatid';
    await this.bot.sendMessage(chatId, message);
  }

  /** Подтверждаем тг аккаунт */
  private async onUserConfirm(
    telegramName: string,
    chatId: number,
    code: string,
  ) {
    const existsTelegramAccount = await User.findOne({
      where: { telegramName },
    });

    if (
      !existsTelegramAccount ||
      existsTelegramAccount.telegramConfirmCode !== code ||
      existsTelegramAccount.telegramStatus !== TelegramAccountStatusEnum.NEW
    )
      return false;

    existsTelegramAccount.telegramStatus = TelegramAccountStatusEnum.CONFIRMED;
    existsTelegramAccount.save();
    return true;
  }

  private async isTelegramNameConfirmed(telegramName: string) {
    const existsTelegramAccount = await User.findOne({
      where: {
        telegramName,
        telegramStatus: TelegramAccountStatusEnum.CONFIRMED,
      },
    });
    return !!existsTelegramAccount;
  }

  private async isTelegramNamePending(telegramName: string) {
    const existsTelegramAccount = await User.findOne({
      where: { telegramName, telegramStatus: TelegramAccountStatusEnum.NEW },
    });
    return !!existsTelegramAccount;
  }

  private async handleOnText(msg: TelegramBot.Message) {
    const text = msg.text;
    const chatId = msg.chat.id;
    const telegramName = msg.chat.username;
    if (text === '/start') {
      await this.bot.sendMessage(
        chatId,
        'Я бот для рассылки оповещений CRM сервиса!',
      );
      return;
    }
    if (text === '/max') {
      await this.bot.sendMessage(
        chatId,
        'https://memepedia.ru/wp-content/uploads/2017/05/%D0%BC%D0%B0%D0%BA%D1%81-%D0%B8%D0%B4%D0%B8-%D0%BD%D0%B0%D1%85%D1%83%D0%B9-%D0%BC%D0%B5%D0%BC.jpg',
      );
      return;
    }
    const isConfirmed = await this.isTelegramNameConfirmed(telegramName);
    if (isConfirmed) {
      await this.bot.sendMessage(chatId, 'Вы подтверждены');
      return;
    }
    const isPending = await this.isTelegramNamePending(telegramName);
    if (isPending) {
      const success = await this.onUserConfirm(telegramName, chatId, text);
      if (!success) {
        await this.bot.sendMessage(
          chatId,
          'Вы не подтверждены. Введите код из личного кабинета для привязки аккаунта',
        );
        return;
      }
      await this.bot.sendMessage(chatId, 'Ваш аккаунт привязан!');
      return;
    }
    await this.bot.sendMessage(chatId, 'Ваш аккаунт не найден в нашей системе');
    return;
  }
}
