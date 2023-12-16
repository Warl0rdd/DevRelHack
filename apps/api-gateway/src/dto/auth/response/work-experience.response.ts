import { ApiProperty } from '@nestjs/swagger';
import { UserPosition } from '../../../../../../libs/common/src/enum/user.position.enum';

export default class WorkExperienceResponse {
  @ApiProperty()
  public workExperienceString: string;
  @ApiProperty()
  public workExperienceMilliseconds: number;

  @ApiProperty()
  public company: string;

  @ApiProperty()
  public startDate: Date;

  @ApiProperty({ enum: UserPosition })
  public position: UserPosition;

  @ApiProperty()
  public endDate?: Date;
}
