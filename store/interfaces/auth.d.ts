export interface ICurrentUser {
  expires: string;
  id: stirng;
  token: string;
  name: string;
  username: string;
  phoneNumber: string;
  refreshToken: string;
  roles: List<T>;
}
