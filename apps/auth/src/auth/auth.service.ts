import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import User from '../db/entities/user.entity';
import RegistrationDto from './dto/registration.dto';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import RegistrationResponse from './dto/registration.response';
import JwtService from '../jwt/jwt.service';
import LoginDto from './dto/login.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import UpdateDto from './dto/update.dto';
import { IJwtPairTokens } from '../jwt/jwt.interface';
import {
  JWT_EXPIRE_ACCESS_TOKEN,
  JWT_EXPIRE_REFRESH_TOKEN,
} from '../jwt/jwt.const';
import AddUserDto from './dto/add-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async passwordToHash(pass: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(pass, salt);
  }

  async validatePassword(pass: string, user: User): Promise<boolean> {
    return bcrypt.compare(pass, user.password);
  }

  async addUser(dto: AddUserDto): Promise<RegistrationResponse> {
    let user = new User();
    user.email = dto.email;
    user.password = 'dasdsasdada';
    const userCreated = await User.save(user);

    return {
      user: {
        id: userCreated.id,
        phoneNumber: userCreated.phoneNumber,
        email: userCreated.email,
        fullName: userCreated.fullName,
        birthday: userCreated.birthday,
        isActive: userCreated.isActive,
        position: userCreated.position,
        profilePic: userCreated.profilePic,
      },
    };
  }

  async login(dto: LoginDto): Promise<IJwtPairTokens> {
    const user = await User.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user === null || !(await this.validatePassword(dto.password, user)))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const tokens = this.jwtService.issuePairTokens({
      id: user.id,
      email: user.email,
      position: user.position,
    });

    return tokens;
  }

  async update(dto: UpdateDto): Promise<User> {
    if (dto.redactedUser.password) {
      let salt = bcrypt.genSaltSync(10);
      dto.redactedUser.password = await bcrypt.hash(
        dto.redactedUser.password,
        salt,
      );
    }

    let updatedUser = await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set(dto.redactedUser)
      .where(`id = ${dto.id}`)
      .returning('*')
      .updateEntity(true)
      .execute();

    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    return updatedUser.raw[0];
  }

  async delete(id: number): Promise<boolean> {
    const user = await User.findOne({ where: { id } });
    if (!user) return false;
    await user.remove();

    return true;
  }

  async refreshTokens(dto: any): Promise<IJwtPairTokens | never> {
    const { access_token, refresh_token } = dto;

    const isValid = this.jwtService.verify(refresh_token);
    if (!isValid) throw new BadRequestException('TOKEN_ERROR');

    const body: any = this.jwtService.decode(access_token);
    if (!body) throw new BadRequestException('TOKEN_ERROR');

    return this.jwtService.issuePairTokens(
      {
        sub: body.sub,
        role: body.role,
      },
      JWT_EXPIRE_ACCESS_TOKEN,
      JWT_EXPIRE_REFRESH_TOKEN,
    );
  }
}
