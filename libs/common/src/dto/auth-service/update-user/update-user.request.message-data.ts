import { UserPosition } from '../../../enum/user.position.enum';

export default class UpdateUserRequestMessageData {
  email: string;

  fullName?: string;

  birthday?: string;

  phoneNumber?: string;

  position?: UserPosition;

  profilePic?: string;

  githubLink?: string;
}
