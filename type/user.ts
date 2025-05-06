export interface UserInfo {
  id: string;
  username: string;
  avatar: string | null;
  created_at: number;
}

export interface LoginResponse {
  token: string;
}
