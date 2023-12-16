import { ApiProperty } from '@nestjs/swagger';
import { UserPosition } from '../../../../../../libs/common/src/enum/user.position.enum';

export default class WorkExperienceByPositionResponse {
  @ApiProperty({ enum: UserPosition })
  position: UserPosition;

  @ApiProperty()
  workExperienceString: string;

  @ApiProperty()
  workExperienceMilliseconds: number;
}
