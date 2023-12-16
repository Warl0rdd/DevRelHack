import { Controller, Get, HttpException } from '@nestjs/common';
import AnalyticsService from './analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import GetPositionAnalyticsResponse from '../dto/auth/response/get-position-analytics.response';
import GetMostPopularTagsResponse from '../dto/auth/response/get-most-popular-tags.response';

@ApiTags('Аналитика')
@ApiBearerAuth()
@Controller('analytics')
export default class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('users/position')
  public async getUsersAnalyticsPosition(): Promise<GetPositionAnalyticsResponse> {
    const result = await this.analyticsService.getUserAnalytics();
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @Get('tags')
  public async getMostPopularTags(): Promise<GetMostPopularTagsResponse> {
    const result = await this.analyticsService.getMostPopularTags();
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }
}
