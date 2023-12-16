import { ApiProperty } from '@nestjs/swagger';

export default class GetPositionAnalyticsResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  totalAnalysts: number;

  @ApiProperty()
  totalBackend: number;

  @ApiProperty()
  totalDevrels: number;

  @ApiProperty()
  totalFrontend: number;

  @ApiProperty()
  totalProjectManagers: number;

  @ApiProperty()
  totalTesters: number;

  @ApiProperty()
  totalUnassigned: number;
}
