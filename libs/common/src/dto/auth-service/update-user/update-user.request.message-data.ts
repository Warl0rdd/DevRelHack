import { UserPosition } from '../../../enum/user.position.enum';
import { WorkExperienceDto } from '../register/register.request';

export default class UpdateUserRequestMessageData {
  email: string;

  fullName?: string;

  birthday?: Date;

  phoneNumber?: string;

  position?: UserPosition;

  profilePic?: string;

  githubLink?: string;

  tags?: string[];

  workExperience?: WorkExperienceDto[];
}
