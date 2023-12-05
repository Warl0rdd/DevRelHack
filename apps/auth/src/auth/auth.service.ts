import { Injectable } from '@nestjs/common';
import User from '../db/entities/user.entity';
import RegistrationDto from './dto/registration.dto';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import RegistrationResponse from './dto/registration.response';
import JwtService from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async passwordToHash(pass: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    console.log(salt);
    return bcrypt.hash(pass, salt);
  }

  async create(dto: RegistrationDto): Promise<RegistrationResponse> {
    let user = new User();
    user.email = dto.email;
    user.password = await this.passwordToHash(dto.password);
    user.registrationTimestamp = DateTime.now().toISO();
    const userCreated = await User.save(user);

    const jwt = this.jwtService.generateToken(user.email);
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
}
