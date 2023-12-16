import { UserPosition } from '../../../enum/user.position.enum';
import { WorkExpByPosition } from '../get-user/get-user.response.message-data';
import {
  WorkExperienceDto,
  WorkExperienceResponseDto,
} from '../register/register.request';

export default class UpdateUserResponseMessageData {
  fullName?: string;

  birthday?: string;

  phoneNumber?: string;

  profilePic?: string;

  email: string;

  isActive: boolean;

  position: UserPosition;

  created: Date;

  updated: Date;

  githubLink?: string;

  tags?: string[];

  workExperience: WorkExperienceResponseDto[];

  workExperienceTotalString: string;

  workExperienceTotalMilliseconds: number;

  workExpByPosition: WorkExpByPosition[];
}
