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
import { randomBytes } from 'crypto';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import LoginRequestMessageData from '../../../../libs/common/src/dto/auth-service/login/login.request.message-data';
import LoginResponsetMessageData from '../../../../libs/common/src/dto/auth-service/login/login.response.message-data';
import RefreshTokenResponseMessageData from '../../../../libs/common/src/dto/auth-service/refresh-token/refresh-token.response.message-data';
import RefreshTokenRequestMessageData from '../../../../libs/common/src/dto/auth-service/refresh-token/refresh-token.request.message-data';
import UpdateUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/update-user/update-user.request.message-data';
import UpdateUserResponseMessageData from '../../../../libs/common/src/dto/auth-service/update-user/update-user.response.message-data';
import BlockUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/block-user/block-user.request.message-data copy';
import UnBlockUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/unblock-user/unblock-user.request.message-data';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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

    return {
      success: true,
      data: { email: user.email, password: originalPassword },
    };
  }

  async login(
    dto: LoginRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<LoginResponsetMessageData>> {
    const user = await User.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user === null) {
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
    const { email, birthday, phoneNumber, position, profilePic } = dto;
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
      },
    };
  }

  // async changePassword(
  //   dto: UpdateUserRequestMessageData,
  // ): Promise<RMQResponseMessageTemplate<UpdateUserResponseMessageData>> {
  //   const { email, birthday, phoneNumber, position, profilePic } = dto;
  //   const user = await User.findOne({
  //     where: {
  //       email: email,
  //     },
  //   });
  //   if (!user) {
  //     return {
  //       success: false,
  //       error: {
  //         message: '',
  //         statusCode: HttpStatus.NOT_FOUND,
  //       },
  //     };
  //   }

  //   if (birthday) {
  //     user.birthday = birthday;
  //   }
  //   if (phoneNumber) {
  //     user.phoneNumber = phoneNumber;
  //   }
  //   if (position) {
  //     user.position = position;
  //   }
  //   if (profilePic) {
  //     user.profilePic = profilePic;
  //   }

  //   await user.save();

  //   return {
  //     success: true,
  //     data: {
  //       email: user.email,
  //       phoneNumber: user.phoneNumber,
  //       isActive: user.isActive,
  //       position: user.position,
  //       created: user.created,
  //       updated: user.updated,
  //     },
  //   };
  // }

  // async delete(id: number): Promise<boolean> {
  //   const user = await User.findOne({ where: { id } });
  //   if (!user) return false;
  //   await user.remove();

  //   return true;
  // }

  async blockUser(
    dto: BlockUserRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<BlockUserRequestMessageData>> {
    const { email } = dto;
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
}
