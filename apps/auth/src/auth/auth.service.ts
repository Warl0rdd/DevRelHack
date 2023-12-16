import { HttpStatus, Injectable } from '@nestjs/common';
import UserEntity from '../db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import JwtService from '../jwt/jwt.service';
import {
  JWT_EXPIRE_ACCESS_TOKEN,
  JWT_EXPIRE_REFRESH_TOKEN,
} from '../jwt/jwt.const';
import { randomInt, randomUUID } from 'crypto';
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
import GetUserResponseMessageData, {
  WorkExpByPosition,
} from '../../../../libs/common/src/dto/auth-service/get-user/get-user.response.message-data';
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
import RegisterRequestMessageData from '../../../../libs/common/src/dto/auth-service/register/register.request';
import RegisterResponseMessageData from '../../../../libs/common/src/dto/auth-service/register/register.response';
import WorkExperienceEntity from '../db/entities/work-experience.entity';
import { msToDurationStr } from '../helper/ms-to-duration-str';
import { In } from 'typeorm';

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

  async validatePassword(pass: string, user: UserEntity): Promise<boolean> {
    return bcrypt.compare(pass, user.password);
  }

  async addRootUser(): Promise<void> {
    const user = new UserEntity();
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
        let rootUser = await UserEntity.findOne({
          where: {
            email: dto.email,
          },
        });

        if (!rootUser) {
          await this.addRootUser();
        }

        rootUser = await UserEntity.findOne({
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

    const user = await UserEntity.findOne({
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
      workExperience,
    } = dto;
    const user = await UserEntity.findOne({
      where: {
        email: email,
      },
      relations: ['tags', 'workExperience'],
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
          tags: [],
          workExperience: [],
          workExperienceTotalString: '',
          workExperienceTotalMilliseconds: 0,
          workExpByPosition: [],
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
    if (workExperience) {
      const oldWork = user.workExperience;
      await WorkExperienceEntity.delete({
        id: In(oldWork.map((item) => item.id)),
      });
      const workExperienceEntities = workExperience.map((item) => {
        const entity = new WorkExperienceEntity();
        entity.company = item.company;
        entity.startDate = item.startDate;
        entity.endDate = item.endDate;
        entity.position = item.position;
        return entity;
      });

      user.workExperience = workExperienceEntities;
    }

    await user.save();

    const {
      workExpByPosition,
      workExperience: workExperienceResponse,
      workExperienceTotalMilliseconds,
      workExperienceTotalString,
    } = this.getWorkExp(user);
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
        workExperience: workExperienceResponse,
        workExperienceTotalString: workExperienceTotalString,
        workExperienceTotalMilliseconds: workExperienceTotalMilliseconds,
        workExpByPosition: workExpByPosition,
      },
    };
  }

  async blockUser(
    dto: BlockUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<BlockUserRequestMessageData>> {
    const { email } = dto;
    const user = await UserEntity.findOne({
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
    const user = await UserEntity.findOne({
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
    const user = await UserEntity.findOne({
      where: {
        email: email,
      },
      relations: ['tags', 'workExperience'],
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

    const {
      workExpByPosition,
      workExperience,
      workExperienceTotalMilliseconds,
      workExperienceTotalString,
    } = this.getWorkExp(user);

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
        profilePic: user.profilePic,
        githubLink: user.githubLink,
        birthday: user.birthday,
        tags: user.tags ? user.tags.map((data) => data.name) : [],
        workExperience: workExperience,
        workExperienceTotalString: workExperienceTotalString,
        workExperienceTotalMilliseconds: workExperienceTotalMilliseconds,
        workExpByPosition: workExpByPosition,
      },
    };
  }

  async findUsers(
    dto: FindUsersRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<FindUsersResponseMessageData>> {
    const {
      take,
      skip,
      tags,
      position,
      query,
      workExperienceMax,
      workExperienceMin,
    } = dto;

    const qb = UserEntity.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.tags', 'tags');
    qb.leftJoinAndSelect('user.workExperience', 'workExperience');
    if (tags) {
      qb.andWhere(``);
    }
    if (position) {
      qb.andWhere(`user.position = :position`, { position });
    }
    if (query) {
      qb.andWhere(`email ILIKE :query OR full_name ILIKE :query`, {
        query: `%${query}%`,
      });
    }
    //     SELECT email,
    // SUM(EXTRACT(EPOCH FROM COALESCE("endDate",NOW())) - EXTRACT(EPOCH FROM "startDate")) as duration  FROM auth_users
    // LEFT JOIN work_experience ON work_experience.user_id = auth_users.id
    // WHERE email='bjingi3@yandex.ru'
    // GROUP BY email;
    let usersWithRequiredExp: { email: string; duration: number }[] = [];
    if (workExperienceMax || workExperienceMin) {
      let havingStr = '';
      if (workExperienceMax && workExperienceMin) {
        havingStr = `HAVING COALESCE(SUM(EXTRACT(EPOCH FROM COALESCE("endDate",NOW())) - EXTRACT(EPOCH FROM "startDate")),0) * 1000   >= ${workExperienceMin}
         AND COALESCE(SUM(EXTRACT(EPOCH FROM COALESCE("endDate",NOW())) - EXTRACT(EPOCH FROM "startDate")),0) * 1000   <= ${workExperienceMax}`;
      }
      if (workExperienceMax && !workExperienceMin) {
        havingStr = `HAVING COALESCE(SUM(EXTRACT(EPOCH FROM COALESCE("endDate",NOW())) - EXTRACT(EPOCH FROM "startDate")),0) * 1000  <= ${workExperienceMax}`;
      }
      if (workExperienceMin && !workExperienceMax) {
        havingStr = `HAVING COALESCE(SUM(EXTRACT(EPOCH FROM COALESCE("endDate",NOW())) - EXTRACT(EPOCH FROM "startDate")),0) * 1000   >= ${workExperienceMin}`;
      }
      usersWithRequiredExp = await UserEntity.query(`
SELECT email,
COALESCE(SUM(EXTRACT(EPOCH FROM COALESCE("endDate",NOW())) - EXTRACT(EPOCH FROM "startDate")),0) * 1000 
as duration    FROM auth_users
LEFT JOIN work_experience ON work_experience.user_id = auth_users.id
GROUP BY email
${havingStr};
`);
    }
    if (
      (workExperienceMax || workExperienceMin) &&
      usersWithRequiredExp.length === 0
    ) {
      return {
        success: true,
        data: {
          users: [],
          take,
          skip,
          total: 0,
        },
      };
    }
    if (workExperienceMax) {
      qb.andWhere(`email IN (:...emails)`, {
        emails: usersWithRequiredExp.map((item) => item.email),
      });
    }
    if (workExperienceMin) {
      qb.andWhere(`email IN (:...emails)`, {
        emails: usersWithRequiredExp.map((item) => item.email),
      });
    }
    qb.take(take);
    qb.skip(skip);

    const [result, count] = await qb.getManyAndCount();

    return {
      success: true,
      data: {
        users: result.map((user) => {
          const {
            workExpByPosition,
            workExperience,
            workExperienceTotalMilliseconds,
            workExperienceTotalString,
          } = this.getWorkExp(user);
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
            workExpByPosition,
            workExperience,
            workExperienceTotalMilliseconds,
            workExperienceTotalString,
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
    const user = await UserEntity.findOne({
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
    const user = await UserEntity.findOne({
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
    const user = await UserEntity.findOne({
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

  async register(
    dto: RegisterRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<RegisterResponseMessageData>> {
    const userExists = await UserEntity.findOne({
      where: {
        email: dto.email,
      },
    });
    if (userExists) {
      return {
        success: false,
        error: {
          message: 'Данный email уже занят!',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }

    const {
      email,
      password,
      fullName,
      birthday,
      phoneNumber,
      position,
      profilePic,
      tags,
      workExperience,
    } = dto;

    let user = new UserEntity();
    user.email = email;
    const originalPassword = password;
    const hashedPassword = await this.passwordToHash(originalPassword);
    user.password = hashedPassword;

    if (fullName) {
      user.fullName = fullName;
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
    if (tags) {
      const tagEntities = await this.tagService.addMissingTags(dto.tags);
      user.tags = tagEntities;
    }
    if (workExperience) {
      const workExperienceEntities = workExperience.map((item) => {
        const entity = new WorkExperienceEntity();
        entity.company = item.company;
        entity.startDate = item.startDate;
        entity.endDate = item.endDate;
        entity.position = item.position;
        return entity;
      });

      user.workExperience = workExperienceEntities;
    }
    await UserEntity.save(user);

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

  private checkIsRootUser(email: string) {
    return email === process.env.ROOT_EMAIL;
  }

  private getWorkExp(user: UserEntity) {
    let workExperienceTotalMilliseconds = 0;

    let workExpByPosition: WorkExpByPosition[] = [];
    if (user.workExperience) {
      const workYearsByPositionMap = new Map<UserPosition, WorkExpByPosition>();
      for (const experience of user.workExperience) {
        const duration = experience.endDate
          ? new Date(experience.endDate).getTime() -
            new Date(experience.startDate).getTime()
          : Date.now() - new Date(experience.startDate).getTime();

        workExperienceTotalMilliseconds += duration;
        const mapData = workYearsByPositionMap.get(experience.position);
        if (mapData) {
          workYearsByPositionMap.set(experience.position, {
            position: experience.position,
            workExperienceMilliseconds:
              mapData.workExperienceMilliseconds + duration,
            workExperienceString: '',
          });
        } else {
          workYearsByPositionMap.set(experience.position, {
            position: experience.position,
            workExperienceMilliseconds: duration,
            workExperienceString: '',
          });
        }
      }

      for (const [key, value] of workYearsByPositionMap) {
        let workExperienceString = msToDurationStr(
          value.workExperienceMilliseconds,
        );

        workExpByPosition.push({ ...value, workExperienceString });
      }
    }

    const workExperienceTotalString = msToDurationStr(
      workExperienceTotalMilliseconds,
    );

    return {
      workExperienceTotalMilliseconds,
      workExperienceTotalString,
      workExpByPosition,
      workExperience: user.workExperience
        ? user.workExperience.map((data) => {
            const duration = data.endDate
              ? new Date(data.endDate).getTime() -
                new Date(data.startDate).getTime()
              : Date.now() - new Date(data.startDate).getTime();

            let workExperienceString = msToDurationStr(duration);
            return {
              company: data.company,
              startDate: data.startDate,
              endDate: data.endDate,
              position: data.position,
              workExperienceString,
              workExperienceMilliseconds: duration,
            };
          })
        : [],
    };
  }
}
