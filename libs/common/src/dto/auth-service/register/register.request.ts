import { UserPosition } from '../../../enum/user.position.enum';

export class WorkExperienceDto {
  public company: string;

  public startDate: Date;

  public position: UserPosition;

  public endDate?: Date;
}

export class WorkExperienceResponseDto {
  public company: string;

  public startDate: Date;

  public position: UserPosition;

  public endDate?: Date;

  public workExperienceString: string;

  public workExperienceMilliseconds: number;
}

export default class RegisterRequestMessageData {
  email: string;

  password: string;

  fullName: string;

  birthday: Date;

  phoneNumber?: string;

  position: UserPosition;

  profilePic?: string;

  tags?: string[];

  workExperience?: WorkExperienceDto[];
}
