import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import User from '../db/entities/user.entity';
import RegistrationDto from './dto/registration.dto';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import RegistrationResponse from './dto/registration.response';
import JwtService from '../jwt/jwt.service';
import LoginDto from "./dto/login.dto";
import LoginResponse from "./dto/login.response";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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

    if (user === null) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

    return {
      user: user,
      token: this.jwtService.generateToken(user)
    }
  }
}
