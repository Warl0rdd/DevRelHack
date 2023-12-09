import { Injectable } from '@nestjs/common';
import { dataSource } from './datasource/postgres.datasource'
import User from "./entity/user.entity";
import RegistrationDto from "./dto/registration.dto";
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";
import {DateTime} from "luxon";
import * as bcrypt from "bcrypt";
import RegistrationResponse from "./response/registration.response";

const userRepository = dataSource.getRepository(User)

@Injectable()
export class AuthService {
    constructor() {}

    async passwordToHash(pass: string): Promise<string> {
        return bcrypt.hash(pass, process.env.SALT)
    }

    async create(dto: RegistrationDto): Promise<RegistrationResponse> {
        let user = new User()
        user.email = dto.email
        user.password = await this.passwordToHash(dto.password)
        user.registrationTimestamp = DateTime.now().toISO()
        return new RegistrationResponse(await userRepository.save(user), "TODO token")
    }
}
