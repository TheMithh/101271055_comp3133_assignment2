// src/app/models/user.model.ts
export interface User {
    id?: string;
    username: string;
    email: string;
    password?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  