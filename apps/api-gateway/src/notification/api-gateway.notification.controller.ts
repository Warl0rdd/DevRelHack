import {Body, Controller, HttpCode, HttpException, Post} from "@nestjs/common";
import {ApiGatewayNotificationService} from "./api-gateway.notification.service";
import {ApiOperation} from "@nestjs/swagger";
import AddUserDto from "../dto/auth/request/add-user.dto";
import UserAddTelegramDto from "../dto/notification/request/user-add-telegram.dto";
import MailSingleDto from "../dto/notification/request/mail-multiple.dto";
import MailMultipleDto from "../dto/notification/request/mail-single.dto";
import TelegramSingleDto from "../dto/notification/request/telegram-single.dto";
import TelegramMultipleDto from "../dto/notification/request/telegram-multiple.dto";

@Controller('/api/notification')
export class ApiGatewayNotificationController {
    constructor(
        private readonly apiGatewayService: ApiGatewayNotificationService
    ) {}

    @ApiOperation({ summary: 'subscribe user to notifications' })
    @Post('/add-user')
    @HttpCode(202)
    async addUser(@Body() addUserDto: AddUserDto) {
        const result = (await this.apiGatewayService.addUser(addUserDto)) as any
        if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
    }

    @ApiOperation({ summary: 'subscribe user to telegram notifications' })
    @Post('/add-user-telegram')
    @HttpCode(202)
    async addUserTelegram(@Body() addUserTelegramDto: UserAddTelegramDto) {
        const result = (await this.apiGatewayService.addUserTelegram(addUserTelegramDto)) as any
        if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
    }

    @ApiOperation({ summary: 'mail a single user' })
    @Post('/mail-single')
    @HttpCode(202)
    async mailSingle(@Body() mailSingleDto: MailSingleDto) {
        const result = (await this.apiGatewayService.mailSingle(mailSingleDto)) as any
        if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
    }

    @ApiOperation({ summary: 'mail multiple users' })
    @Post('/mail-multiple')
    @HttpCode(202)
    async mailMultiple(@Body() mailMultipleDto: MailMultipleDto) {
        const result = (await this.apiGatewayService.mailMultiple(mailMultipleDto)) as any
        if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
    }

    @ApiOperation({ summary: 'send a telegram message to a single user' })
    @Post('/telegram-single')
    @HttpCode(202)
    async telegramSingle(@Body() telegramSingleDto: TelegramSingleDto) {
        const result = (await this.apiGatewayService.telegramSingle(telegramSingleDto)) as any
        if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
    }

    @ApiOperation({ summary: 'send a telegram message to a multiple users' })
    @Post('/telegram-multiple')
    @HttpCode(202)
    async telegramMultiple(@Body() telegramMultipleDto: TelegramMultipleDto) {
        const result = (await this.apiGatewayService.telegramMultiple(telegramMultipleDto)) as any
        if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
    }
}