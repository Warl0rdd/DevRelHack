import { UserPosition } from '../../../enum/user.position.enum';

class FindUsersUserData {
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
}

export default class FindUsersResponseMessageData {
  users: FindUsersUserData[];
  take: number;
  skip: number;
  total: number;
}
