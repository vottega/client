export type UserId = string;
export type Email = string;

export interface AuthResponseDTO {
  token: string;
}

export interface UserAuthRequestDTO {
  id: number;
  userId: UserId;
}

export interface EmailCheckRequest {
  email: Email;
}

export interface EmailCheckResponse {
  isDuplicate: boolean;
}

export interface UserIdCheckRequest {
  userId: UserId;
}

export interface UserIdCheckResponse {
  isDuplicate: boolean;
}

export interface LoginRequest {
  userId: UserId;
  password: string;
}

export interface EmailValidateRequest {
  email: Email;
  emailAuthCode: string;
}

export interface EmailSendRequest {
  email: Email;
}

export interface UserCreateRequest {
  name: string;
  userId: UserId;
  password: string;
  email: Email;
  emailAuthCode: string;
}

export interface UserResponse {
  id: number;
  username: string;
  userId: UserId;
  email: Email;
}

export class UserMapper {
  static toUserDTO(user: {
    id: number | null;
    username: string;
    userId: UserId;
    email: Email;
  }): UserResponse {
    if (!user.id) {
      throw new Error("유저 아이디가 null 입니다.");
    }

    return {
      id: user.id,
      username: user.username,
      userId: user.userId,
      email: user.email,
    };
  }
}
