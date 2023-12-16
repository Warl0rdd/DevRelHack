import { HttpStatus, Injectable } from '@nestjs/common';
import User from '../db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import JwtService from '../jwt/jwt.service';
import {
  JWT_EXPIRE_ACCESS_TOKEN,
  JWT_EXPIRE_REFRESH_TOKEN,
} from '../jwt/jwt.const';
import AddUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/add-user/add-user.request.message-data';
import AddUserResponseMessageData from '../../../../libs/common/src/dto/auth-service/add-user/add-user.response.message-data';
import { randomBytes, randomInt, randomUUID } from 'crypto';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import LoginRequestMessageData from '../../../../libs/common/src/dto/auth-service/login/login.request.message-data';
import LoginResponseMessageData from '../../../../libs/common/src/dto/auth-service/login/login.response.message-data';
import RefreshTokenResponseMessageData from '../../../../libs/common/src/dto/auth-service/refresh-token/refresh-token.response.message-data';
import RefreshTokenRequestMessageData from '../../../../libs/common/src/dto/auth-service/refresh-token/refresh-token.request.message-data';
import UpdateUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/update-user/update-user.request.message-data';
import UpdateUserResponseMessageData from '../../../../libs/common/src/dto/auth-service/update-user/update-user.response.message-data';
import BlockUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/block-user/block-user.request.message-data copy';
import UnBlockUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/unblock-user/unblock-user.request.message-data';
import { UserPosition } from '../../../../libs/common/src/enum/user.position.enum';
import GetUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/get-user/get-user.request.message-data';
import GetUserResponseMessageData from '../../../../libs/common/src/dto/auth-service/get-user/get-user.response.message-data';
import ChangePasswordRequestMessageData from '../../../../libs/common/src/dto/auth-service/change-password/change-password.request.message-data';
import SendTelegramCodeRequestMessageData from '../../../../libs/common/src/dto/auth-service/send-telegram-code/send-telegram-code.request.message-data';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';
import {
  NotificationServiceMessagePattern,
  QueueName,
} from '../../../../libs/common/src';
import TelegramSingleRequestMessageData from '../../../../libs/common/src/dto/notification-service/telegram-single/telegram-single.request';
import { EventEmitter2 } from '@nestjs/event-emitter';
import TelegramCodeEntity from '../db/entities/telegram-code.entity';
import TelegramLoginRequestMessageData from '../../../../libs/common/src/dto/auth-service/telegram-login/telegram-login.request.message-data';
import TelegramLoginResponseMessageData from '../../../../libs/common/src/dto/auth-service/telegram-login/telegram-login.response.message-data';
import FindUsersRequestMessageData from '../../../../libs/common/src/dto/auth-service/find-users/find-users.request.message-data';
import FindUsersResponseMessageData from '../../../../libs/common/src/dto/auth-service/find-users/find-users.response.message-data';
import TagService from './tag.service';
import NotificationAdapterService from './notification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly producerService: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
    private readonly tagService: TagService,
    private readonly notificationService: NotificationAdapterService,
  ) {}

  async passwordToHash(pass: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(pass, salt);
  }

  async validatePassword(pass: string, user: User): Promise<boolean> {
    return bcrypt.compare(pass, user.password);
  }

  async addUser(
    dto: AddUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<AddUserResponseMessageData>> {
    const userExists = await User.findOne({
      where: {
        email: dto.email,
      },
    });
    if (userExists) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }
    let user = new User();
    user.email = dto.email;
    const originalPassword = randomBytes(6).toString('hex');
    const hashedPassword = await this.passwordToHash(originalPassword);
    user.password = hashedPassword;
    await User.save(user);

    // TODO: Включить для демо
    // const sendEmailData: MailSingleRequestMessageData = {
    //   email: user.email,
    //   body: `
    //   <h1>Логин: ${user.email}</h1>
    //   <h1>Пароль: ${originalPassword}</h1>`,
    //   subject: 'Вы зарегистрированы в DevRel системе',
    // };
    // await this.producerService.produce({
    //   data: sendEmailData,
    //   queue: QueueName.notification_queue,
    //   pattern: NotificationServiceMessagePattern.mailSingle,
    // });

    return {
      success: true,
      data: { email: user.email, password: originalPassword },
    };
  }

  async addRootUser(): Promise<void> {
    const user = new User();
    user.email = process.env.ROOT_EMAIL;
    user.password = await this.passwordToHash(process.env.ROOT_PASSWORD);
    user.position = UserPosition.DEVREL;
    await user.save();
  }

  async login(
    dto: LoginRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<LoginResponseMessageData>> {
    // Root user login / creation
    if (this.checkIsRootUser(dto.email)) {
      const { password } = dto;
      if (password === process.env.ROOT_PASSWORD) {
        let rootUser = await User.findOne({
          where: {
            email: dto.email,
          },
        });

        if (!rootUser) {
          await this.addRootUser();
        }

        rootUser = await User.findOne({
          where: {
            email: dto.email,
          },
        });

        const tokens = this.jwtService.issuePairTokens({
          id: rootUser.id,
          email: rootUser.email,
          position: rootUser.position,
        });

        return {
          success: true,
          data: tokens,
        };
      }
    }

    const user = await User.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user === null || user.isActive === false) {
      return {
        success: false,
        error: {
          message: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      };
    }

    const isPasswordValid = await this.validatePassword(dto.password, user);
    if (!isPasswordValid) {
      return {
        success: false,
        error: {
          message: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      };
    }

    const tokens = this.jwtService.issuePairTokens({
      id: user.id,
      email: user.email,
      position: user.position,
    });

    return {
      success: true,
      data: tokens,
    };
  }

  async update(
    dto: UpdateUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<UpdateUserResponseMessageData>> {
    const {
      email,
      fullName,
      birthday,
      phoneNumber,
      position,
      profilePic,
      githubLink,
      tags,
    } = dto;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user || user.isActive === false) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.NOT_FOUND,
        },
      };
    }
    if (this.checkIsRootUser(dto.email)) {
      return {
        success: true,
        data: {
          email: user.email,
          isActive: user.isActive,
          position: user.position,
          created: user.created,
          updated: user.updated,
        },
      };
    }

    if (birthday) {
      user.birthday = birthday;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (position) {
      user.position = position;
    }
    if (profilePic) {
      user.profilePic = profilePic;
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (githubLink) {
      user.githubLink = githubLink;
    }
    if (tags) {
      const tagEntities = await this.tagService.addMissingTags(dto.tags);
      user.tags = tagEntities;
    }

    await user.save();

    return {
      success: true,
      data: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        position: user.position,
        created: user.created,
        updated: user.updated,
        tags: user.tags ? user.tags.map((data) => data.name) : [],
      },
    };
  }

  async blockUser(
    dto: BlockUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<BlockUserRequestMessageData>> {
    const { email } = dto;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (this.checkIsRootUser(email)) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }
    if (!user) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.NOT_FOUND,
        },
      };
    }

    user.isActive = false;

    await user.save();

    return {
      success: true,
    };
  }

  async unblockUser(
    dto: UnBlockUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<BlockUserRequestMessageData>> {
    const { email } = dto;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (this.checkIsRootUser(email)) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }
    if (!user) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.NOT_FOUND,
        },
      };
    }

    user.isActive = true;

    await user.save();

    return {
      success: true,
    };
  }

  async refreshTokens(
    dto: RefreshTokenRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<RefreshTokenResponseMessageData>> {
    const { accessToken, refreshToken } = dto;

    const isValid = this.jwtService.verify(refreshToken);
    if (!isValid) {
      return {
        success: false,
        error: {
          message: 'Bad request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }

    const body: any = this.jwtService.decode(accessToken);
    if (!body) {
      return {
        success: false,
        error: {
          message: 'Bad request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }

    const tokens = await this.jwtService.issuePairTokens(
      {
        sub: body.sub,
        role: body.role,
      },
      JWT_EXPIRE_ACCESS_TOKEN,
      JWT_EXPIRE_REFRESH_TOKEN,
    );

    return {
      success: true,
      data: tokens,
    };
  }

  async getUser(
    dto: GetUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<GetUserResponseMessageData>> {
    const { email } = dto;
    const user = await User.findOne({
      where: {
        email: email,
      },
      relations: ['tags'],
    });
    if (!user) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.NOT_FOUND,
        },
      };
    }

    return {
      success: true,
      data: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        isActive: user.isActive,
        position: user.position,
        created: user.created,
        updated: user.updated,
        githubLink: user.githubLink,
        tags: user.tags ? user.tags.map((data) => data.name) : [],
      },
    };
  }

  async findUsers(
    dto: FindUsersRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<FindUsersResponseMessageData>> {
    const { take, skip, tags, position, query } = dto;

    const qb = User.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.tags', 'tags');
    if (tags) {
      qb.andWhere(``);
    }
    if (position) {
      qb.andWhere(`position = :position`, { position });
    }
    if (query) {
      qb.andWhere(`email ILIKE :query OR full_name ILIKE :query`, {
        query: `%${query}%`,
      });
    }
    qb.take(take);
    qb.skip(skip);

    const [result, count] = await qb.getManyAndCount();

    return {
      success: true,
      data: {
        users: result.map((user) => {
          return {
            email: user.email,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            isActive: user.isActive,
            position: user.position,
            created: user.created,
            updated: user.updated,
            githubLink: user.githubLink,
            tags: user.tags ? user.tags.map((item) => item.name) : [],
          };
        }),
        take,
        skip,
        total: count,
      },
    };
  }

  async changePassword(
    dto: ChangePasswordRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<null>> {
    const { email, oldPassword, newPassword } = dto;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return {
        success: false,
        error: {
          message: '',
          statusCode: HttpStatus.NOT_FOUND,
        },
      };
    }

    const actualOldPassword = user.password;
    const oldPasswordMatches = bcrypt.compareSync(
      oldPassword,
      actualOldPassword,
    );
    if (!oldPasswordMatches) {
      return {
        success: false,
        error: {
          message: 'Старый пароль неверный',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }

    user.password = await this.passwordToHash(newPassword);
    await user.save();

    return {
      success: true,
    };
  }

  async sendTelegramCode(
    dto: SendTelegramCodeRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<null>> {
    const { telegramName } = dto;
    const userByTelegramResponse =
      await this.notificationService.getUserEmailByTelegramName(telegramName);
    if (userByTelegramResponse.success === false) {
      return {
        success: false,
        error: userByTelegramResponse.error,
      };
    }
    const email = userByTelegramResponse.data.email;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user || user.isActive === false) {
      return {
        success: false,
        error: {
          message: 'Пользователь не найден',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }

    await TelegramCodeEntity.delete({
      email,
    });
    const code = await randomInt(9999);
    const telegramCodeEntity = new TelegramCodeEntity();
    telegramCodeEntity.code = code.toString();
    telegramCodeEntity.email = email;
    await telegramCodeEntity.save();

    const data: TelegramSingleRequestMessageData = {
      email: email,
      message: `Одноразовый код для входа: ${code}`,
    };

    const uuid = randomUUID();
    await this.producerService.produce({
      queue: QueueName.notification_queue,
      pattern: NotificationServiceMessagePattern.telegramSingle,
      data,
      reply: {
        correlationId: uuid,
        replyTo: QueueName.notification_to_auth_queue_reply,
      },
    });

    const response: RMQResponseMessageTemplate<null> = await new Promise(
      (resolve) => {
        this.eventEmitter.once(uuid, async (data) => {
          resolve(JSON.parse(data));
        });
      },
    );

    if (response.success === false) {
      return response;
    }

    return {
      success: true,
    };
  }

  async telegramLogin(
    dto: TelegramLoginRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<TelegramLoginResponseMessageData>> {
    const { telegramName } = dto;
    const userByTelegramResponse =
      await this.notificationService.getUserEmailByTelegramName(telegramName);
    if (userByTelegramResponse.success === false) {
      return {
        success: false,
        error: userByTelegramResponse.error,
      };
    }
    const email = userByTelegramResponse.data.email;
    const telegramCode = await TelegramCodeEntity.findOne({
      where: {
        email: email,
      },
    });
    if (!telegramCode) {
      return {
        success: false,
        error: {
          message: 'Код не найден',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }
    if (dto.code !== telegramCode.code) {
      return {
        success: false,
        error: {
          message: 'Код неверный',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user === null || user.isActive === false) {
      return {
        success: false,
        error: {
          message: 'Код не найден',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      };
    }

    await TelegramCodeEntity.delete({
      email,
    });
    const tokens = this.jwtService.issuePairTokens({
      id: user.id,
      email: user.email,
      position: user.position,
    });

    console.log(user);
    return {
      success: true,
      data: tokens,
    };
  }

  private checkIsRootUser(email: string) {
    return email === process.env.ROOT_EMAIL;
  }
}
