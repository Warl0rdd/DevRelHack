import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import User from '../db/entities/user.entity';
import RegistrationDto from './dto/registration.dto';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import RegistrationResponse from './dto/registration.response';
import JwtService from '../jwt/jwt.service';
import LoginDto from "./dto/login.dto";
import LoginResponse from "./dto/login.response";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";
import UpdateDto from "./dto/update.dto";

@Injectable()
export class AuthService {
  constructor(
      private readonly jwtService: JwtService,
      @InjectDataSource() private dataSource: DataSource
  ) {}

  async passwordToHash(pass: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hash(pass, salt)
  }

  async validatePassword(pass: string, user: User): Promise<boolean> {
    return bcrypt.compare(pass, user.password);
  }

  async create(dto: RegistrationDto): Promise<RegistrationResponse> {
    let user = new User();
    user.email = dto.email;
    user.password = await this.passwordToHash(dto.password);
    user.registrationTimestamp = DateTime.now().toISO();
    const userCreated = await User.save(user);

    const jwt = this.jwtService.generateToken(userCreated);
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
      token: jwt,
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await User.findOne({
      where: {
        email: dto.email
      }
    })

    if (user === null || !await this.validatePassword(dto.password, user)) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

    return {
      user: user,
      token: this.jwtService.generateToken(user)
    }
  }

  async update(dto: UpdateDto): Promise<User> {
    if (dto.redactedUser.password) {
      let salt = bcrypt.genSaltSync(10)
      dto.redactedUser.password = await bcrypt.hash(dto.redactedUser.password, salt)
    }

    let updatedUser = await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set(dto.redactedUser)
        .where(`id = ${dto.id}`)
        .returning("*")
        .updateEntity(true)
        .execute()

    if (!updatedUser) throw  new HttpException('User not found', HttpStatus.BAD_REQUEST)

    return updatedUser.raw[0]
  }

  // True if deleted, False if not found
  async delete(id: number): Promise<boolean> {
     this.dataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where(`id = ${id}`)
        .execute()
        .catch((err) => {
            return false
        })

    return true
  }
}
