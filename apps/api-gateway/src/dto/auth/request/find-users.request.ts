import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPosition } from '../../../../../../libs/common/src/enum/user.position.enum';

export class PaginationQuery {
  @ApiProperty({ name: 'page[take]', default: 5 })
  take: number;

  @ApiProperty({ name: 'page[skip]', default: 0 })
  skip: number;
}
export default class FindUsersFilterQuery {
  @ApiPropertyOptional({ name: 'filter[position]', enum: UserPosition })
  position?: UserPosition;

  @ApiPropertyOptional({ name: 'filter[query]' })
  query?: string;

  @ApiPropertyOptional({ name: 'filter[workExperienceMin]' })
  workExperienceMin?: number;

  @ApiPropertyOptional({ name: 'filter[workExperienceMax]' })
  workExperienceMax?: number;

  @ApiPropertyOptional({ name: 'filter[tags]' })
  tags?: string[];
}
