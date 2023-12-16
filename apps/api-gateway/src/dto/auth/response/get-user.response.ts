import { ApiProperty } from '@nestjs/swagger';
import { UserPosition } from '../../../../../../libs/common/src/enum/user.position.enum';
import WorkExperienceResponse from './work-experience.response';
import WorkExperienceByPositionResponse from './work-experience-by-position.response';

export default class GetUserResponse {
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  fullName?: string;

  // YYYY-MM-DD
  @ApiProperty({ example: '2000-01-01' })
  birthday?: string;

  @ApiProperty({ example: '88005553535' })
  phoneNumber?: string;

  @ApiProperty({ example: 'developer/devrel/tester/user (pick one)' })
  position?: UserPosition;

  @ApiProperty({ example: 'some base64 profile pic string' })
  profilePic?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'some unix time string' })
  created: Date;

  @ApiProperty({ example: 'some unix time string' })
  updated: Date;

  @ApiProperty({ example: 'some base64 profile pic string' })
  githubLink?: string;

  @ApiProperty({ example: [] })
  tags?: string[];

  @ApiProperty({ type: WorkExperienceResponse })
  workExperience: WorkExperienceResponse[];

  @ApiProperty()
  workExperienceTotalString: string;

  @ApiProperty()
  workExperienceTotalMilliseconds: number;

  @ApiProperty({ type: WorkExperienceByPositionResponse })
  workExpByPosition: WorkExperienceByPositionResponse[];
}
