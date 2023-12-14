import { UserPosition } from '../../../enum/user.position.enum';

export default class FindUsersRequestMessageData {
  take: number;
  skip: number;
  position?: UserPosition;
  query?: string;
  tags?: string[];
}
