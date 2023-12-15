import { UserPosition } from '../../enum/user.position.enum';

export default class JwtUserPayload {
  id: string;
  email: string;
  position: UserPosition;
}
