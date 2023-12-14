import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CheckTokenGuard from '../../../../libs/common/src/guard/check-token.guard';
import AddUserMultipleDto from '../dto/auth/request/add-user-multiple.dto';
import AddUserDto from '../dto/auth/request/add-user.dto';
import BlockUserDto from '../dto/auth/request/block-user.dto';
import UnblockUserDto from '../dto/auth/request/unblock-user.dto';
import AddUserResponseDto from '../dto/auth/response/add-user.response';
import { UserService } from './user.service';
import { UserPosition } from '../../../../libs/common/src/enum/user.position.enum';
import { CheckRoleGuard } from '../../../../libs/common/src';
import FindUsersFilterQuery, {
  PaginationQuery,
} from '../dto/auth/request/find-users.request';

@ApiTags('User')
@Controller('user')
export default class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'Find users' })
  @Get()
  @HttpCode(200)
  async findUsers(
    @Query('filter') filter: FindUsersFilterQuery,
    @Query('page') pagination: PaginationQuery,
  ) {
    const result = await this.userService.findUsers({
      take: pagination.take,
      skip: pagination.skip,
      ...filter,
    });
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);

    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard, CheckRoleGuard(UserPosition.DEVREL))
  @ApiOperation({ summary: 'add user' })
  @Post('add-user')
  @ApiResponse({ type: AddUserResponseDto })
  @HttpCode(201)
  async addUser(@Body() addUserDto: AddUserDto) {
    const result = (await this.userService.addUser(addUserDto)) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard, CheckRoleGuard(UserPosition.DEVREL))
  @ApiOperation({ summary: 'add multiple users' })
  @Post('add-user-multiple')
  @ApiResponse({ type: AddUserMultipleDto })
  @HttpCode(201)
  async addUserMultiple(@Body() addUserMultipleDto: AddUserMultipleDto) {
    const result = (await this.userService.addUserMultiple(
      addUserMultipleDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard, CheckRoleGuard(UserPosition.DEVREL))
  @ApiOperation({ summary: 'block user' })
  @Post('block-user')
  @HttpCode(202)
  async blockUser(@Body() blockUserDto: BlockUserDto) {
    const result = (await this.userService.blockUser(blockUserDto)) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard, CheckRoleGuard(UserPosition.DEVREL))
  @ApiOperation({ summary: 'unblock user' })
  @Post('unblock-user')
  @HttpCode(202)
  async unblockUser(@Body() unblockUserDto: UnblockUserDto) {
    const result = (await this.userService.unblockUser(unblockUserDto)) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }
}
