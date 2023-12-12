import { UserPosition } from '../../../enum/user.position.enum';

export default class GetUserResponseMessageData {
  fullName?: string;

  birthday?: string;

  phoneNumber?: string;

  profilePic?: string;

  email: string;

  isActive: boolean;

  position: UserPosition;

  created: Date;

  updated: Date;
}
