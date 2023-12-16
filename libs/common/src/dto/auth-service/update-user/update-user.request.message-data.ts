import { UserPosition } from '../../../enum/user.position.enum';

export default class UpdateUserRequestMessageData {
  email: string;

  fullName?: string;

  birthday?: Date;

  phoneNumber?: string;

  position?: UserPosition;

  profilePic?: string;

  githubLink?: string;

  tags?: string[];
}
