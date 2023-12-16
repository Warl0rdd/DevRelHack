import { Injectable } from '@nestjs/common';
import User from '../db/entities/user.entity';
import { UserPosition } from '../../../../libs/common/src/enum/user.position.enum';
import GetPositionAnalyticsResponseMessageData from '../../../../libs/common/src/dto/auth-service/get-position-analytics/get-position-analytics.response.message-data';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import GetMostPopularTagsResponseMessageData from '../../../../libs/common/src/dto/auth-service/get-most-popular-tags/get-most-popular-tags.response.message-data';

@Injectable()
export default class AnalyticsService {
  public async getUserAnalytics(): Promise<
    RMQResponseMessageTemplate<GetPositionAnalyticsResponseMessageData>
  > {
    const total = await User.count();
    const totalAnalysts = await User.count({
      where: {
        position: UserPosition.ANALYTICS,
      },
    });
    const totalFrontend = await User.count({
      where: {
        position: UserPosition.FE_DEVELOPER,
      },
    });
    const totalBackend = await User.count({
      where: {
        position: UserPosition.BE_DEVELOPER,
      },
    });
    const totalDevrels = await User.count({
      where: {
        position: UserPosition.DEVREL,
      },
    });
    const totalProjectManagers = await User.count({
      where: {
        position: UserPosition.PROJECT_MANAGER,
      },
    });
    const totalUnassigned = await User.count({
      where: {
        position: UserPosition.UNASSIGNED,
      },
    });
    const totalTesters = await User.count({
      where: {
        position: UserPosition.TESTER,
      },
    });

    return {
      success: true,
      data: {
        total,
        totalAnalysts,
        totalBackend,
        totalDevrels,
        totalFrontend,
        totalProjectManagers,
        totalTesters,
        totalUnassigned,
      },
    };
  }

  public async getMostPopularTags(): Promise<
    RMQResponseMessageTemplate<GetMostPopularTagsResponseMessageData>
  > {
    const mostPopularTags: {
      tag_name: string;
      user_count: number;
    }[] = await User.query(`
	SELECT tag.name as tag_name, COUNT(*) as user_count FROM tag LEFT JOIN  tag_user 
	ON tag_user."tagName" = tag.name
	WHERE EXISTS(
	SELECT * FROM tag_user WHERE tag_user."tagName" = tag.name)
	GROUP BY tag.name
	LIMIT 10;
`);

    const data = mostPopularTags.map((data) => {
      return {
        tag: data.tag_name,
        tagCount: data.user_count,
      };
    });

    return {
      success: true,
      data: {
        tags: data,
      },
    };
  }
}
