import { UserPosition } from '../../../enum/user.position.enum';
import { WorkExperienceDto } from '../register/register.request';

export class WorkExpByPosition {
  position: UserPosition;
  workExperienceString: string;
  workExperienceMilliseconds: number;
}

export default class GetUserResponseMessageData {
  fullName?: string;

  birthday?: string;

  phoneNumber?: string;

  profilePic?: string;

  email: string;

  isActive: boolean;

  position: UserPosition;

  githubLink?: string;

  created: Date;

  updated: Date;

  tags: string[];

  workExperience: WorkExperienceDto[];

  workExperienceTotalString: string;

  workExperienceTotalMilliseconds: number;

  workExpByPosition: WorkExpByPosition[];
}
