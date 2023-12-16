import { ApiProperty } from '@nestjs/swagger';

export class TagAnalytics {
  @ApiProperty()
  tag: string;

  @ApiProperty()
  tagCount: number;
}

export default class GetMostPopularTagsResponse {
  @ApiProperty({ type: TagAnalytics })
  tags: TagAnalytics[];
}
