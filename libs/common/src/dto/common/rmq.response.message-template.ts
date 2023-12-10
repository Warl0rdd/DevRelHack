export default class RMQResponseMessageTemplate<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}
