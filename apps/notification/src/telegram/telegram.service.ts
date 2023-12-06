import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export default class TelegramService {
  private readonly bot: TelegramBot = null;
  constructor() {
    const API_KEY_BOT = '6614650012:AAGfr3JDy6S-kflKWeVFWUN3VkD8QsK-fUY';

    this.bot = new TelegramBot(API_KEY_BOT, {
      polling: {
        interval: 300,
        autoStart: false,
      },
    });

    this.bot.on('polling_error', (err) => console.log(err));

    this.bot.on('text', async (msg) => {
      await this.bot.sendMessage(msg.chat.id, msg.text);
    });

    this.bot.on('text', async (msg) => {
      if (msg.text === '/start') {
        console.log('User joined our bot', msg.chat.id, msg.chat.username);
      }
    });

    this.bot.startPolling();
  }
  public async sendMessage(telegramName: string, message: string) {
    const chatId = 'TODO: Get chatid';
    await this.bot.sendMessage(chatId, message);
  }

  private async onUserJoin(telegramName: string, code: string) {
    // TODO
  }

  private async isTelegramNameConfirmed(telegramName: string) {
    // TODO
  }
}
